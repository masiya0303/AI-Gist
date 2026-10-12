import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const page = readFileSync(resolve(process.cwd(), 'src/renderer/pages/mobile/MobilePromptDetailPage.vue'), 'utf8')

// 底部操作栏里的所有按钮
const actionBar = page.slice(page.indexOf('class="action-buttons"'), page.indexOf('</ion-content>'))

describe('移动端详情页复制按钮', () => {
  it('有描述时给两个复制按钮：描述与正文各自独立', () => {
    expect((actionBar.match(/<ion-button/g) || []).length).toBe(2)
    expect(actionBar).toMatch(/v-if="prompt\.description"/)
    expect(actionBar).toMatch(/@click="copyDescription"/)
    expect(actionBar).toMatch(/@click="copyContent"/)
    // 两个按钮都撑满底部操作栏，纵向排列
    expect((actionBar.match(/expand="block"/g) || []).length).toBe(2)
  })

  it('按钮文案标明各自复制哪一块，不靠图标区分', () => {
    expect(actionBar).toMatch(/detailModal\.copyDescription'/)
    expect(actionBar).toMatch(/detailModal\.copyContent'/)
  })

  it('复制描述不记使用次数', () => {
    const copyDescription = page.match(/const copyDescription = async \(\) => \{[\s\S]*?\n\}/)?.[0] || ''

    expect(copyDescription).toContain('prompt.value?.description?.trim()')
    expect(copyDescription).toContain('navigator.clipboard.writeText(text)')
    expect(copyDescription).not.toContain('recordPromptUsage')
    // 用独立的文案区分「复制的是描述」，不复用正文复制成功的那条提示
    expect(copyDescription).toContain('copyDescriptionSuccess')
  })

  it('描述为空时不复制', () => {
    expect(page).toMatch(/const text = prompt\.value\?\.description\?\.trim\(\)/)
  })
})
