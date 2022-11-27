<template>
  <v-app :theme="mainStore.theme">
    <v-app-bar />
    <v-main>
      <under-construction-banner />
      <slot />
    </v-main>
    <default-footer />
  </v-app>
</template>
<script setup lang="ts">
import { useStore } from '~/store/mainStore';
import DefaultFooter from '~/components/DefaultFooter.vue';
import UnderConstructionBanner from '~/components/UnderConstructionBanner.vue';

const mainStore = useStore();
</script>
