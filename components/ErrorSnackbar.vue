<template>
  <v-snackbar
    v-model="mainStore.snackbar.snackbar"
    color="error"
  >
    <v-icon>$error</v-icon>
    {{ mainStore.snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useStore } from '~/store/mainStore.js';

const mainStore = useStore();
</script>
