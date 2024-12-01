<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout :error="error">
    <NuxtLoadingIndicator />
    <error-four-oh-four v-if="error.statusCode === 404" />
    <error-other
      v-else
      :error="error"
    />
  </NuxtLayout>
</template>