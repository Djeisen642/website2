<template>
  <v-footer class="px-10 footer">
    <p>2022 - Jason Suttles</p>
    <v-spacer />
    <v-btn icon="mdi-github" target="_blank" href="https://github.com/Djeisen642" />
    <v-btn
      icon="mdi-linkedin"
      class="ml-2"
      target="_blank"
      href="https://www.linkedin.com/in/jssuttles/"
    />
    <v-btn icon="mdi-brightness-4" class="ml-2" @click="toggleTheme" />
  </v-footer>
</template>
<script setup lang="ts">
import { Theme, useStore } from '~/store/mainStore';

const mainStore = useStore();

function toggleTheme() {
  mainStore.setTheme(mainStore.theme === Theme.LIGHT, true);
}
</script>
<style scoped lang="scss">
.footer {
  max-height: 80px;
}
</style>
