<template>
  <div class="mobile-category-bar" role="group" :aria-label="t('promptManagement.categoriesBar')">
    <div class="mobile-category-bar__scroller">
      <button
        type="button"
        class="mobile-category-bar__chip"
        :class="{ 'is-active': selectedId === null }"
        :aria-pressed="selectedId === null"
        @click="select(null)"
      >
        <span class="mobile-category-bar__name">{{ t('promptManagement.allCategories') }}</span>
      </button>

      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="mobile-category-bar__chip"
        :class="{ 'is-active': selectedId === category.id }"
        :aria-pressed="selectedId === category.id"
        @click="select(category.id ?? null)"
      >
        <span class="mobile-category-bar__name">{{ category.name }}</span>
        <span v-if="getCount(category.id)" class="mobile-category-bar__count">{{ getCount(category.id) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { Category } from '@shared/types'

/**
 * 提示词列表顶部的横向分类频道栏。
 *
 * 分类筛选此前只能从漏斗图标的筛选弹层里点，选完之后想换分类必须重新打开弹层；
 * 这个组件把「全部 + 全部分类」平铺在列表上方，横向滑动浏览，点一下即切换，
 * 与底部浮动标签栏的「选中态用强调色浅底、不加边框加重」语言保持一致。
 */
interface Props {
  /** 已按 sortOrder 排好序的分类列表 */
  categories: Category[]
  /** 当前选中的分类 id；null 表示「全部分类」 */
  selectedId: number | null
  /** 可选的分类 -> 提示词数量映射，用于在频道名后展示计数 */
  counts?: Record<number, number>
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: null,
  counts: undefined
})

const emit = defineEmits<{
  'update:selectedId': [categoryId: number | null]
}>()

const { t } = useI18n()

const getCount = (categoryId?: number) => {
  if (!categoryId) return 0
  return props.counts?.[categoryId] ?? 0
}

// 重复点击当前频道是幂等操作，不再通知父级触发一次无意义的重新加载
const select = (categoryId: number | null) => {
  if (categoryId === props.selectedId) return
  emit('update:selectedId', categoryId)
}
</script>

<style scoped>
/*
 * 频道栏是列表上方的轻量控件，不占标题的视觉重量：无背景、无外框，
 * 只有横向轨道上的胶囊频道。频道高度 32px 略大于 ion-chip 的 26px，
 * 保证指腹点选足够稳，又不像列表项那样粗。
 */
.mobile-category-bar {
  margin-bottom: var(--spacing-sm);
}

.mobile-category-bar__scroller {
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  /* 分类很多时只在水平方向滚动，不挤压标题栏和列表 */
  -webkit-overflow-scrolling: touch;
  /* 隐藏滚动条：手指/滚轮滑动即可，条状指示器会显得拥挤 */
  scrollbar-width: none;
  padding-block: 2px;
}

.mobile-category-bar__scroller::-webkit-scrollbar {
  display: none;
}

.mobile-category-bar__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  margin-right: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: var(--surface-secondary);
  color: var(--content-secondary);
  font-size: var(--mobile-font-size-footnote);
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
}

.mobile-category-bar__chip:last-child {
  margin-right: 0;
}

/* 选中态是状态而不是新容器：只换强调色浅底与字重，不加阴影 */
.mobile-category-bar__chip.is-active {
  background: color-mix(in srgb, var(--accent-primary) 15%, transparent);
  color: var(--accent-primary);
  border-color: color-mix(in srgb, var(--accent-primary) 35%, transparent);
  font-weight: 600;
}

.mobile-category-bar__name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-category-bar__count {
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
}

.mobile-category-bar__chip.is-active .mobile-category-bar__count {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .mobile-category-bar__chip {
    transition: none;
  }
}
</style>
