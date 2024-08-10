<template>
  <v-app :theme="mainStore.theme">
    <v-main role="main">
      <slot />
    </v-main>
    <default-footer />
    <error-snackbar
      :snackbar="mainStore.snackbar.snackbar"
      :text="mainStore.snackbar.text"
    />
  </v-app>
</template>
<script
  setup
  lang="ts"
>
import DefaultFooter from '~/components/DefaultFooter.vue';
import { useStore } from '~/store/mainStore.js';

const mainStore = useStore();
</script>
