<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <header class="nav-bar">
    <div class="nav-bar__inner">
      <div class="nav-bar__brand">
        <span class="nav-bar__logo-circle" />
        <span class="nav-bar__title">{{ props.title ?? 'My App' }}</span>
      </div>
      <nav class="nav-bar__links">
        <slot />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-bar {
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffffcc;
  backdrop-filter: blur(8px);
}

.nav-bar__inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  gap: 1.5rem;
}

.nav-bar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;
}

.nav-bar__logo-circle {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
}

.nav-bar__title {
  font-size: 1rem;
}

.nav-bar__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.nav-bar__links :deep(a) {
  color: #4b5563;
}

.nav-bar__links :deep(a.router-link-active) {
  color: #111827;
  font-weight: 600;
}

@media (max-width: 640px) {
  .nav-bar__inner {
    padding-inline: 1rem;
  }
}
</style>
