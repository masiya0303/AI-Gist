import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8')

const categoryBar = read('src/renderer/components/mobile/MobileCategoryBar.vue')
const promptPage = read('src/renderer/pages/mobile/MobilePromptPage.vue')

describe('移动端分类频道栏组件', () => {
  it('把全部分类横向平铺在同一个可滚动轨道上', () => {
    // ion-scroll + scroll-x：分类多了也能横向滑动，而不是把列表挤成两行
    expect(categoryBar).toMatch(/<ion-scroll class="mobile-category-bar__scroller" scroll-x/)

    expect(categoryBar).toMatch(/v-for="category in categories"/)
    expect(categoryBar).toMatch(/category\.name/)
  })

  it('「全部分类」始终是第一个频道，选中态用 aria-pressed 表达', () => {
    expect(categoryBar).toMatch(/selectedId === null/)
    expect(categoryBar).toMatch(/aria-pressed="selectedId === null"/)
    expect(categoryBar).toMatch(/t\('promptManagement\.allCategories'\)/)
  })

  it('支持 v-model:selected-id，重复点击当前频道不重复通知父级', () => {
    expect(categoryBar).toMatch(/'update:selectedId': \[categoryId: number \| null\]/)
    expect(categoryBar).toMatch(/if \(categoryId === props\.selectedId\) return/)
    expect(categoryBar).toMatch(/emit\('update:selectedId', categoryId\)/)
  })

  it('分类名过长时截断，避免把轨道撑高', () => {
    const nameStyle = categoryBar.match(/\.mobile-category-bar__name\s*\{([^}]*)\}/)?.[1] || ''
    expect(nameStyle).toContain('overflow: hidden')
    expect(nameStyle).toContain('text-overflow: ellipsis')
  })

  it('选中态只用强调色浅底与字重变化，不引入边框加重或常驻阴影', () => {
    const activeStyle = categoryBar.match(/\.mobile-category-bar__chip\.is-active\s*\{([^}]*)\}/)?.[1] || ''
    expect(activeStyle).toContain('var(--accent-primary)')
    expect(activeStyle).toContain('font-weight: 600')
    expect(activeStyle).not.toContain('box-shadow')
    expect(activeStyle).not.toContain('--ion-chip')
  })

  it('频道文字使用移动端字号阶梯而不是裸 px', () => {
    const chipStyle = categoryBar.match(/\.mobile-category-bar__chip\s*\{([\s\S]*?)\n\}/)?.[1] || ''
    expect(chipStyle).toContain('font-size: var(--mobile-font-size-footnote)')
  })
})

describe('移动端提示词页顶部分类频道栏', () => {
  it('频道栏位于折叠大标题正下方，列表与瀑布流视图共用', () => {
    const barStart = promptPage.indexOf('<mobile-category-bar')
    const titleEnd = promptPage.indexOf('</div>', promptPage.indexOf('mobile-large-title-bar'))
    const listStart = promptPage.indexOf("viewMode === 'list'")
    const modalStart = promptPage.indexOf('<ion-modal :is-open="showFilterModal"')

    expect(barStart).toBeGreaterThan(-1)
    expect(barStart).toBeGreaterThan(titleEnd)
    // 频道栏在列表/瀑布流两种视图的公共区块里，切换视图不丢分类筛选
    expect(barStart).toBeLessThan(listStart)
    expect(barStart).toBeLessThan(modalStart)
  })

  it('双向下发选中分类并带上每个分类的条数', () => {
    expect(promptPage).toMatch(/v-model:selected-id="selectedCategory"/)
    expect(promptPage).toMatch(/:counts="categoryCounts"/)
    expect(promptPage).toMatch(/const categoryCounts = computed\(/)
  })

  it('没有分类时不渲染空的频道栏', () => {
    expect(promptPage).toMatch(/<mobile-category-bar\s+[\s\S]*?v-if="categories\.length > 0"/)
  })

  it('分类被删除后清空失效的选中态并恢复为全部分类', () => {
    expect(promptPage).toMatch(/watch\(categories, async \(\) => \{[\s\S]*?selectedCategory\.value = null[\s\S]*?loadPrompts\(\)/)
  })

  it('分类、提示词与 AI 配置并行加载', () => {
    expect(promptPage).toMatch(/await Promise\.all\([\s\S]*?loadCategories\(\),[\s\S]*?loadPrompts\(\),[\s\S]*?refreshAIConfigStatus\(\)/)
  })

  it('频道栏区块仍可通过漏斗图标打开高级筛选', () => {
    expect(promptPage).toMatch(/@click="showFilterModal = true"/)
  })
})
