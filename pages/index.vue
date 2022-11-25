<template>
  <div>
    <h1>Hi! Welcome to my website!</h1>
    <v-btn to="/games">Check out my games!</v-btn>
    <v-btn @click="toggleTheme">Toggle Theme</v-btn>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import { Theme, useStore } from '~/store/mainStore';

const mainStore = useStore();

function toggleTheme() {
  mainStore.setTheme(mainStore.theme === Theme.LIGHT, true);
}

definePageMeta({
  layout: 'homepage',
});
</script>
