<template>
  <v-app :theme="mainStore.theme">
    <!--    <v-app-bar></v-app-bar>-->
    <v-banner icon="mdi-wrench" color="warning" class="banner" sticky>
      <v-banner-text>
        <p>Website under construction. Excuse the mess!</p>
      </v-banner-text>
    </v-banner>
    <v-main>
      Some default layout shared across all pages
      <slot />
    </v-main>
    <default-footer />
  </v-app>
</template>
<script setup lang="ts">
import { useStore } from '~/store/mainStore';
import DefaultFooter from '~/components/DefaultFooter.vue';

const mainStore = useStore();
</script>
