<template>
  <v-app :theme="mainStore.theme">
    <v-main>
      <under-construction-banner />
      <slot />
    </v-main>
    <default-footer />
  </v-app>
</template>
<script setup lang="ts">
import DefaultFooter from '~/components/DefaultFooter.vue';
import UnderConstructionBanner from '~/components/UnderConstructionBanner.vue';
import { useStore } from '~/store/mainStore.js';

const mainStore = useStore();
</script>
