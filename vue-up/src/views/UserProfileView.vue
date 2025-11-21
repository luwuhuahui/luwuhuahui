<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchArticleById, type Article } from '../mockApi'

const props = defineProps<{
  id: string
}>()

const loading = ref(false)
const errorMessage = ref('')
const article = ref<Article | null>(null)

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchArticleById(props.id)
    if (!data) {
      errorMessage.value = `未找到 ID 为 ${props.id} 的数据（本地 mock）。`
      article.value = null
    } else {
      article.value = data
    }
  } catch (error) {
    errorMessage.value = '加载详情失败（本地 mock 数据）。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h1>详情页（通过动态路由 /user/:id 模拟）</h1>

    <p>当前路由参数 <code>id</code> 为：<strong>{{ props.id }}</strong></p>

    <p v-if="loading">正在加载详情数据...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <article v-else-if="article">
      <h2>{{ article.title }}</h2>
      <p>{{ article.summary }}</p>
    </article>

    <p v-else>暂无数据。</p>
  </section>
</template>
