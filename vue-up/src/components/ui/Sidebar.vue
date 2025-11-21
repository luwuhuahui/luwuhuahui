<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  collapsed?: boolean
}>()

const isCollapsed = computed(() => !!props.collapsed)
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <div class="sidebar__inner">
      <div class="sidebar__section sidebar__section--title">
        <span class="sidebar__label">导航</span>
      </div>
      <nav class="sidebar__nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/articles">文章管理</RouterLink>
        <RouterLink :to="'/user/123'">示例详情</RouterLink>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: relative;
  width: 240px;
  flex: 0 0 240px;
  border-right: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 1rem;
  box-sizing: border-box;
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar__section--title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.sidebar__nav :deep(a) {
  padding: 0.4rem 0.6rem;
  border-radius: 0.375rem;
  color: #4b5563;
}

.sidebar__nav :deep(a.router-link-active) {
  background-color: #e5e7eb;
  color: #111827;
  font-weight: 600;
}

/* 小屏默认隐藏，由 App.vue 控制显示 */
.sidebar--collapsed {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    inset-block: 0;
    left: 0;
    z-index: 30;
    transform: translateX(0);
    width: 220px;
    max-width: 70vw;
    box-shadow: 0 10px 40px -15px rgb(15 23 42 / 0.5);
  }
}
</style>
