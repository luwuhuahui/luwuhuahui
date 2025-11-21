<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section class="page-section">
    <header v-if="props.title || props.subtitle" class="page-section__header">
      <h2 v-if="props.title" class="page-section__title">{{ props.title }}</h2>
      <p v-if="props.subtitle" class="page-section__subtitle">
        {{ props.subtitle }}
      </p>
    </header>
    <div class="page-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-section {
  width: 100%;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  box-shadow: 0 10px 25px -15px rgb(15 23 42 / 0.25);
}

.page-section__header {
  margin-bottom: 1rem;
}

.page-section__title {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.page-section__subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.page-section__body {
  font-size: 0.95rem;
  color: #374151;
}
</style>
