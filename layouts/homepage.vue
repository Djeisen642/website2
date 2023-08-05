<template>
  <v-app :theme="mainStore.theme">
    <under-construction-banner />
    <v-main>
      <slot />
    </v-main>
    <default-footer />
    <error-snackbar :snackbar="mainStore.snackbar.snackbar" :text="mainStore.snackbar.text" />
    <dev-only>
      <vue-axe />
    </dev-only>
  </v-app>
</template>
<script setup lang="ts">
import DefaultFooter from '~/components/DefaultFooter.vue';
import UnderConstructionBanner from '~/components/UnderConstructionBanner.vue';
import { useStore } from '~/store/mainStore.js';

const mainStore = useStore();
</script>
