<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  fetchArticleList,
  type Article,
  type ArticleListParams,
  createArticle,
  type CreateArticlePayload,
} from '../mockApi'

const page = ref(1)
const pageSize = ref(2)
const total = ref(0)
const query = ref('')

const loading = ref(false)
const errorMessage = ref('')
const list = ref<Article[]>([])

const totalPages = computed(() =>
  total.value === 0 ? 1 : Math.ceil(total.value / pageSize.value),
)

const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

async function loadList() {
  loading.value = true
  errorMessage.value = ''
  try {
    const params: ArticleListParams = {
      page: page.value,
      pageSize: pageSize.value,
      query: query.value,
    }
    const result = await fetchArticleList(params)
    list.value = result.list
    total.value = result.total
  } catch (error) {
    errorMessage.value = '加载列表失败（本地 mock）。'
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadList()
}

function goPrev() {
  if (!canPrev.value) return
  page.value -= 1
  loadList()
}

function goNext() {
  if (!canNext.value) return
  page.value += 1
  loadList()
}

// 简单表单状态
const form = ref<CreateArticlePayload>({ title: '', summary: '' })
const submitting = ref(false)
const submitError = ref('')

async function handleSubmit() {
  submitting.value = true
  submitError.value = ''
  try {
    await createArticle(form.value)
    // 提交成功后清空表单 & 回到第一页重新加载
    form.value = { title: '', summary: '' }
    page.value = 1
    await loadList()
  } catch (error: any) {
    submitError.value = error?.message || '创建失败（本地 mock）。'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadList()
})

// 也可以 watch pageSize 变化时重新加载
watch(pageSize, () => {
  page.value = 1
  loadList()
})
</script>

<template>
  <section>
    <h1>文章管理（Mock）</h1>

    <h2>搜索</h2>
    <div class="search-bar">
      <input v-model="query" type="text" placeholder="输入关键词搜索标题或摘要" />
      <button type="button" @click="handleSearch">搜索</button>
    </div>

    <h2>新建文章（表单提交）</h2>
    <form class="create-form" @submit.prevent="handleSubmit">
      <div>
        <label>
          标题
          <input v-model="form.title" type="text" placeholder="请输入标题" />
        </label>
      </div>
      <div>
        <label>
          摘要
          <textarea
            v-model="form.summary"
            rows="3"
            placeholder="请输入摘要"
          ></textarea>
        </label>
      </div>
      <button type="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : '提交' }}
      </button>
      <p v-if="submitError" class="error">{{ submitError }}</p>
    </form>

    <h2>文章列表（分页 + 搜索）</h2>

    <p v-if="loading">正在加载列表...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <template v-else>
      <p v-if="list.length === 0">暂无数据。</p>
      <ul v-else class="article-list">
        <li v-for="item in list" :key="item.id">
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </li>
      </ul>

      <div class="pagination">
        <button type="button" :disabled="!canPrev" @click="goPrev">
          上一页
        </button>
        <span>第 {{ page }} / {{ totalPages }} 页（共 {{ total }} 条）</span>
        <button type="button" :disabled="!canNext" @click="goNext">
          下一页
        </button>
        <label>
          每页
          <select v-model.number="pageSize">
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="5">5</option>
          </select>
          条
        </label>
      </div>
    </template>
  </section>
</template>
