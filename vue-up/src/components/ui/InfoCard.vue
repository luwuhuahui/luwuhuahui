<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <article class="info-card">
    <h3 class="info-card__title">{{ props.title }}</h3>
    <p class="info-card__description">
      {{ props.description }}
    </p>
    <div class="info-card__footer">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.info-card {
  padding: 1.25rem 1.5rem;
  border-radius: 0.9rem;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.info-card__description {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.info-card__footer {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #4b5563;
}
</style>
