import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * 防止「导入了 @ionic/vue 里不存在的组件」这类错误进 CI 才暴露。
 *
 * 起因：分类频道栏最初用 <ion-scroll>，@ionic/vue 并没有导出 IonScroll，
 * 结果推上去之后 vite build 在 rollup 阶段直接报
 *   "IonScroll" is not exported by "node_modules/@ionic/vue/dist/index.js"
 * 而本机装不全依赖、跑不了 build，只能靠这种纯静态检查兜住。
 *
 * 检查方式：把 src/renderer 下所有 import { ... } from '@ionic/vue' 的具名导入
 * 收集出来，逐个到已安装的 @ionic/vue 入口文件里核对是否真实存在。
 * 本机没装 @ionic 时整组跳过（此时也没有可核对的入口文件，CI 上是全量的）。
 */

const repoRoot = process.cwd()
const sourceRoot = resolve(repoRoot, 'src/renderer')
const ionVueEntry = resolve(repoRoot, 'node_modules/@ionic/vue/dist/index.js')
const ionVueExports = existsSync(ionVueEntry) ? readFileSync(ionVueEntry, 'utf8') : ''

const IONIC_IMPORT = /import\s*\{([^}]+)\}\s*from\s*['"]@ionic\/vue['"]/g

/** 解析单个导入项，返回它从 @ionic/vue 真正导入的导出名；解析不出就返回 null。 */
const IONIC_SPECIFIER = /^(?:type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+[A-Za-z_$][\w$]*)?$/

function parseIonVueSpecifier(raw: string): string | null {
  const match = IONIC_SPECIFIER.exec(raw.trim())
  return match ? match[1] : null
}

function collectSources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      collectSources(full, out)
    } else if (/\.(vue|ts|tsx|js|jsx)$/.test(entry)) {
      out.push(full)
    }
  }
  return out
}

describe.skipIf(!ionVueExports)('@ionic/vue 具名导入', () => {
  it('引用到的每个组件名都真实导出', () => {
    const missing: string[] = []

    for (const file of collectSources(sourceRoot)) {
      const source = readFileSync(file, 'utf8')
      const where = relative(repoRoot, file)

      for (const match of source.matchAll(IONIC_IMPORT)) {
        for (const rawName of match[1].split(',')) {
          // 去掉 `type Foo`、以及 `Foo as Bar` 的别名部分，只核对真正的导出名。
          // 注意不能直接 split('as')：toastController 本身包含 "as"，会被切成 "to"。
          const exportedName = parseIonVueSpecifier(rawName)
          if (!exportedName) continue
          if (!new RegExp(`\\b${exportedName}\\b`).test(ionVueExports)) {
            missing.push(`${where} -> ${exportedName}`)
          }
        }
      }
    }

    expect(missing).toEqual([])
  })

  it('至少扫到了几个 @ionic/vue 导入，避免规则空转', () => {
    const names = new Set<string>()
    for (const file of collectSources(sourceRoot)) {
      for (const match of readFileSync(file, 'utf8').matchAll(IONIC_IMPORT)) {
        for (const rawName of match[1].split(',')) {
          const exportedName = parseIonVueSpecifier(rawName)
          if (exportedName) names.add(exportedName)
        }
      }
    }
    expect(names.size).toBeGreaterThan(10)
  })
})
