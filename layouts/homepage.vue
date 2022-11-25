<template>
  <v-app :theme="mainStore.theme">
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { useStore } from '~/store/mainStore';

const mainStore = useStore();
</script>
