<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/ui/NavBar.vue'
import Sidebar from './components/ui/Sidebar.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="layout-root">
    <!-- 小屏遮罩层，用于点击关闭侧边栏 -->
    <div v-if="sidebarOpen" class="layout-root__backdrop" @click="closeSidebar" />

    <aside
      class="layout-root__sidebar"
      :class="{ 'layout-root__sidebar--open': sidebarOpen }"
    >
      <Sidebar />
    </aside>

    <main class="layout-root__main">
      <NavBar title="Vue Up Demo">
        <button type="button" class="nav-toggle" @click="toggleSidebar">
          菜单
        </button>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink :to="'/user/123'">用户 123</RouterLink>
        <RouterLink to="/articles">文章管理（Mock）</RouterLink>
      </NavBar>
      <section class="layout-root__content">
        <div class="layout-root__content-inner">
          <RouterView />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout-root {
  display: flex;
  height: 100vh;
}

.layout-root__sidebar {
  position: relative;
  z-index: 20;
  display: block;
}

.layout-root__main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.layout-root__content {
  flex: 1 1 auto;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow-y: auto; /* 内容区内部垂直滚动 */
  overflow-x: hidden; /* 禁止内容区内部横向滚动 */
}

.layout-root__content-inner {
  width: 100%;
  max-width: 1280px; /* 内容区域最大宽度，避免视觉上溢出太多 */
  margin: 0 auto; /* 居中显示 */
}

.layout-root__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 10;
}

.nav-toggle {
  display: none;
  margin-right: 0.75rem;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.8rem;
}

@media (max-width: 1024px) {
  .layout-root {
    min-height: 100vh;
  }

  .layout-root__sidebar {
    position: fixed;
    inset-block: 0;
    left: -260px;
    transition: transform 0.2s ease-out;
  }

  .layout-root__sidebar--open {
    transform: translateX(260px);
  }

  .nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .layout-root__content {
    padding: 1rem;
  }
}
</style>
