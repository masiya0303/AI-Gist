<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button />
        </ion-buttons>
        <ion-title :style="{ opacity: headerProgress }">{{ t('promptManagement.categoryManageTitle') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="!isCreating && !editingCategory" @click="startCreating">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="ionContentRef" :fullscreen="true" :scroll-events="true" @ionScroll="onIonScroll">
      <!-- 下拉刷新 -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- 大标题 -->
      <div class="mobile-large-title-bar" :style="{ '--collapse-progress': headerProgress }">
        <h1 class="mobile-large-title-text" aria-hidden="true">{{ t('promptManagement.categoryManageTitle') }}</h1>
      </div>

      <!-- 工具栏：分类总数 + 创建按钮 -->
      <div v-if="!loading && categories.length > 0" class="category-toolbar">
        <span class="category-count">{{ t('promptManagement.totalCategories', { count: categories.length }) }}</span>
        <ion-button v-if="!isCreating && !editingCategory" size="small" fill="outline" @click="startCreating">
          <ion-icon :icon="add" slot="start"></ion-icon>
          {{ t('promptManagement.createCategory') }}
        </ion-button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
      </div>

      <!-- 空状态 -->
      <div v-else-if="categories.length === 0" class="empty-container">
        <p class="empty-text">{{ t('promptManagement.categoryManageEmpty') }}</p>
        <ion-button @click="startCreating">
          <ion-icon :icon="add" slot="start"></ion-icon>
          {{ t('promptManagement.createCategory') }}
        </ion-button>
      </div>

      <!-- 分类列表 -->
      <div v-else class="mobile-grouped-card">
        <ion-list>
          <!-- 新建分类：内联行，置顶 -->
          <ion-item v-if="isCreating" class="category-form-item">
            <ion-label>
              <span class="field-caption">{{ t('promptManagement.categoryName') }}</span>
            </ion-label>
          </ion-item>
          <ion-item v-if="isCreating" class="category-form-item">
            <ion-input
              v-model="newCategory.name"
              :placeholder="t('promptManagement.categoryNamePlaceholder')"
              autofocus
              enterkeyhint="done"
              @keyup.enter="handleCreate"
            ></ion-input>
          </ion-item>
          <ion-item v-if="isCreating" class="category-form-item">
            <ion-label>
              <span class="field-caption">{{ t('promptManagement.color') }}</span>
            </ion-label>
          </ion-item>
          <ion-item v-if="isCreating" class="category-form-item">
            <div class="color-picker">
              <button
                v-for="color in colorSwatches"
                :key="color"
                type="button"
                class="color-swatch"
                :class="{ active: newCategory.color === color }"
                :style="{ backgroundColor: color }"
                :aria-label="color"
                @click="newCategory.color = color"
              ></button>
            </div>
          </ion-item>
          <ion-item v-if="isCreating" class="category-form-actions">
            <ion-button type="button" fill="solid" size="small" @click="handleCreate" :disabled="!newCategory.name.trim()">
              {{ t('promptManagement.createCategory') }}
            </ion-button>
            <ion-button type="button" fill="outline" size="small" @click="cancelCreating">
              {{ t('common.cancel') }}
            </ion-button>
          </ion-item>

          <!-- 现有分类列表 -->
          <template v-for="category in categories" :key="category.id">
            <!-- 编辑模式 -->
            <ion-item v-if="editingCategory?.id === category.id" class="category-form-item">
              <ion-label>
                <span class="field-caption">{{ t('promptManagement.categoryName') }}</span>
              </ion-label>
            </ion-item>
            <ion-item v-if="editingCategory?.id === category.id" class="category-form-item">
              <ion-input
                v-model="editingCategory!.name"
                :placeholder="t('promptManagement.categoryNamePlaceholder')"
                @keyup.enter="handleSaveEdit"
              ></ion-input>
            </ion-item>
            <ion-item v-if="editingCategory?.id === category.id" class="category-form-item">
              <ion-label>
                <span class="field-caption">{{ t('promptManagement.color') }}</span>
              </ion-label>
            </ion-item>
            <ion-item v-if="editingCategory?.id === category.id" class="category-form-item">
              <div class="color-picker">
                <button
                  v-for="color in colorSwatches"
                  :key="color"
                  type="button"
                  class="color-swatch"
                  :class="{ active: editingCategory!.color === color }"
                  :style="{ backgroundColor: color }"
                  :aria-label="color"
                  @click="editingCategory!.color = color"
                ></button>
              </div>
            </ion-item>
            <ion-item v-if="editingCategory?.id === category.id" class="category-form-actions">
              <ion-button type="button" fill="solid" size="small" @click="handleSaveEdit" :disabled="!editingCategory?.name.trim()">
                {{ t('common.save') }}
              </ion-button>
              <ion-button type="button" fill="outline" size="small" @click="handleCancelEdit">
                {{ t('common.cancel') }}
              </ion-button>
            </ion-item>

            <!-- 普通模式 -->
            <template v-else>
              <ion-item button @click="handleEdit(category)">
                <span class="category-color-dot" :style="{ backgroundColor: category.color || 'var(--content-tertiary)' }"></span>
                <ion-label>
                  <h2 class="category-name">{{ category.name }}</h2>
                  <p class="category-count-text">{{ t('promptManagement.categoryPromptCount', { count: getPromptCount(category.id) }) }}</p>
                </ion-label>
                <ion-icon :icon="createOutline" slot="end"></ion-icon>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option color="danger" @click="handleDelete(category)">
                  <ion-icon :icon="trashOutline" slot="start"></ion-icon>
                  {{ t('common.delete') }}
                </ion-item-option>
              </ion-item-options>
            </template>
          </template>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onActivated, onUnmounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonItemOptions,
  IonItemOption,
  alertController,
  onIonViewWillLeave
} from '@ionic/vue'
import {
  add,
  createOutline,
  trashOutline
} from 'ionicons/icons'
import { useI18n } from '~/composables/useI18n'
import { api } from '~/lib/api'
import { presentMobileToast } from '~/lib/utils/mobile-toast'
import { sortCategoriesByOrder } from '~/lib/utils/category-order'
import type { Category, CategoryWithRelations } from '@shared/types'
import { useCollapsingHeader } from '~/composables/useCollapsingHeader'

const { t } = useI18n()
const { progress: headerProgress, onIonScroll } = useCollapsingHeader()

// 颜色选择器：使用纯色值（非透明），与创建/编辑表单中的颜色圆点匹配
const colorSwatches = ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#A3E635', '#22C55E', '#10B981', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899', '#94A3B8']

const DEFAULT_CATEGORY_COLOR = '#18a058'

// 状态
const categories = ref<CategoryWithRelations[]>([])
const loading = ref(true)
const isCreating = ref(false)
const editingCategory = ref<{ id: number; name: string; color: string } | null>(null)
const creating = ref(false)
const updating = ref(false)

// 新建分类数据
const newCategory = ref({
  name: '',
  color: DEFAULT_CATEGORY_COLOR
})

// 滚动位置相关
const ionContentRef = ref<any>(null)
let savedScrollTop = 0

// 获取分类下的提示词数量
const getPromptCount = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.prompts?.length || 0
}

// 加载分类
const loadCategories = async () => {
  try {
    loading.value = true
    const data = await api.categories.getAll.query()
    categories.value = sortCategoriesByOrder(data)
  } catch (error) {
    console.error('加载分类失败:', error)
    await presentMobileToast(t('promptManagement.loadFailed'), 'danger')
  } finally {
    loading.value = false
  }
}

// 开始创建
const startCreating = () => {
  editingCategory.value = null
  newCategory.value = {
    name: '',
    color: DEFAULT_CATEGORY_COLOR
  }
  isCreating.value = true
}

// 取消创建
const cancelCreating = () => {
  isCreating.value = false
  newCategory.value = {
    name: '',
    color: DEFAULT_CATEGORY_COLOR
  }
}

// 创建分类
const handleCreate = async () => {
  if (!newCategory.value.name.trim()) {
    await presentMobileToast(t('promptManagement.enterCategoryName'), 'warning')
    return
  }

  try {
    creating.value = true
    await api.categories.create.mutate({
      name: newCategory.value.name.trim(),
      color: newCategory.value.color,
      uuid: '',
      isActive: true,
      description: ''
    })
    await presentMobileToast(t('promptManagement.categoryCreatedSuccess'))
    await loadCategories()
    cancelCreating()
  } catch (error) {
    console.error('创建分类失败:', error)
    await presentMobileToast(t('promptManagement.categoryCreatedFailed'), 'danger')
  } finally {
    creating.value = false
  }
}

// 编辑分类
const handleEdit = (category: Category) => {
  isCreating.value = false
  editingCategory.value = {
    id: category.id!,
    name: category.name,
    color: category.color || DEFAULT_CATEGORY_COLOR
  }
}

// 保存编辑
const handleSaveEdit = async () => {
  if (!editingCategory.value?.name.trim()) {
    await presentMobileToast(t('promptManagement.enterCategoryName'), 'warning')
    return
  }

  try {
    updating.value = true
    await api.categories.update.mutate({
      id: editingCategory.value.id,
      data: {
        name: editingCategory.value.name.trim(),
        color: editingCategory.value.color
      }
    })
    await presentMobileToast(t('promptManagement.categoryUpdatedSuccess'))
    editingCategory.value = null
    await loadCategories()
  } catch (error) {
    console.error('更新分类失败:', error)
    await presentMobileToast(t('promptManagement.categoryUpdatedFailed'), 'danger')
  } finally {
    updating.value = false
  }
}

// 取消编辑
const handleCancelEdit = () => {
  editingCategory.value = null
}

// 删除分类
const handleDelete = async (category: Category) => {
  const promptCount = getPromptCount(category.id!)
  if (promptCount > 0) {
    await presentMobileToast(t('promptManagement.categoryHasPrompts'), 'warning')
    return
  }

  const alert = await alertController.create({
    header: t('common.confirm'),
    message: t('promptManagement.confirmDeleteCategory', { name: category.name }),
    buttons: [
      {
        text: t('common.cancel'),
        role: 'cancel'
      },
      {
        text: t('common.delete'),
        role: 'destructive',
        handler: async () => {
          try {
            await api.categories.delete.mutate(category.id!)
            await presentMobileToast(t('promptManagement.categoryDeletedSuccess'))
            await loadCategories()
          } catch (error) {
            console.error('删除分类失败:', error)
            await presentMobileToast(t('promptManagement.categoryDeletedFailed'), 'danger')
          }
        }
      }
    ]
  })

  await alert.present()
}

// 下拉刷新
const handleRefresh = async (event: any) => {
  await loadCategories()
  event.target.complete()
}

// 离开页面时保存滚动位置
onIonViewWillLeave(async () => {
  const scrollEl = await ionContentRef.value?.$el?.getScrollElement?.()
  savedScrollTop = scrollEl?.scrollTop ?? 0
})

// 初始化加载：onActivated 在 keep-alive 首次挂载时也会触发，无需 onMounted
onActivated(async () => {
  await loadCategories()
  // 恢复滚动位置（仅返回时）
  if (savedScrollTop > 0) {
    await ionContentRef.value?.$el?.scrollToPoint?.(0, savedScrollTop, 0)
  }
})

onUnmounted(() => {
  // cleanup
})
</script>

<style scoped>
.category-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  margin-bottom: 12px;
}

.category-count {
  color: var(--ion-color-medium);
  font-size: var(--mobile-font-size-footnote);
}

.category-form-item {
  padding: 8px 16px;
}

.field-caption {
  display: block;
  font-size: var(--mobile-font-size-footnote);
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.color-swatch.active {
  border-color: var(--ion-color-primary);
  transform: scale(1.1);
}

.category-form-actions {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
}

.category-form-actions ion-button {
  flex: 1;
}

.category-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex: 0 0 auto;
  margin-right: 12px;
}

.category-name {
  margin: 0;
}

.category-count-text {
  margin: 2px 0 0;
  color: var(--ion-color-medium);
  font-size: var(--mobile-font-size-footnote);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

ion-content {
  --padding-bottom: calc(env(safe-area-inset-bottom, 0px) + var(--mobile-nav-clearance));
}
</style>
