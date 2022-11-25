<template>
  <v-app :theme="mainStore.theme">
    <v-app-bar> </v-app-bar>
    <v-main>
      Some default layout shared across all pages
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { useStore } from '~/store/mainStore';

const mainStore = useStore();
</script>
