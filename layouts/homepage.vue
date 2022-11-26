<template>
  <v-app :theme="mainStore.theme">
    <v-banner icon="mdi-wrench" color="warning" class="banner">
      <v-banner-text class="text-lg-h5">
        Website under construction. Excuse the mess!
      </v-banner-text>
    </v-banner>
    <v-main>
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
<style lang="scss" scoped>
.banner {
  min-height: 70px;
}
</style>
