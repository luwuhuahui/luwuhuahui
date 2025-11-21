<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchArticles, type Article } from '../mockApi'
import PageSection from '../components/ui/PageSection.vue'
import InfoCard from '../components/ui/InfoCard.vue'

const loading = ref(false)
const errorMessage = ref('')
const articles = ref<Article[]>([])

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchArticles()
    articles.value = data
  } catch (error) {
    errorMessage.value = '加载文章列表失败（本地 mock 数据）。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home-layout">
    <PageSection
      title="欢迎来到 Vue Up Demo"
      subtitle="练习响应式布局、路由、Mock 接口和动态数据渲染的示例项目。"
    >
      <p>
        当前首页通过一个简单的“组件库风格”布局组件来组织内容区块，并使用本地
        Mock 接口加载文章数据。
      </p>
    </PageSection>

    <PageSection
      class="home-layout__grid-section"
      title="最近的学习主题（来自 Mock 列表）"
      subtitle="这些数据来自 src/mockApi.ts，可以按需扩展或替换为真实接口。"
    >
      <div class="home-layout__grid">
        <p v-if="loading">正在加载文章列表...</p>
        <p v-else-if="errorMessage">{{ errorMessage }}</p>

        <template v-else>
          <p v-if="articles.length === 0">暂无数据。</p>
          <div v-else class="home-layout__cards">
            <InfoCard
              v-for="article in articles"
              :key="article.id"
              :title="article.title"
              :description="article.summary"
            >
              <RouterLink :to="`/user/${article.id}`">查看详情（动态路由）</RouterLink>
            </InfoCard>
          </div>
        </template>
      </div>
    </PageSection>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-layout__grid-section {
  padding: 1.25rem;
}

.home-layout__grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-layout__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.home-layout__cards :deep(a) {
  color: #4f46e5;
}

.home-layout__cards :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .home-layout {
    gap: 1.25rem;
  }
}
</style>
