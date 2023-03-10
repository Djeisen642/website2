<template>
  <v-footer class="px-md-10 footer">
    <p>{{ new Date().getFullYear() }} - Jason Suttles</p>
    <v-spacer />
    <v-btn icon="$github" target="_blank" href="https://github.com/Djeisen642" />
    <v-btn
      icon="$linkedin"
      class="ml-2"
      target="_blank"
      href="https://www.linkedin.com/in/jssuttles/"
    />
    <v-btn icon="$brightness" class="ml-2" @click="toggleTheme" />
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
