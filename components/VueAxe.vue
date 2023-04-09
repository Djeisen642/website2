<template>
  <vue-axe-popup v-if="showAxePopup" />
</template>
<script setup lang="ts">
// @ts-expect-error - vue-axe doesn't have types
import { VueAxePopup } from 'vue-axe';

const config = useRuntimeConfig();
const showAxePopup = ref(false);

onMounted(() => {
  showAxePopup.value = !config.IS_PRODUCTION;
});
</script>
