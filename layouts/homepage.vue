<template>
  <v-app :theme="mainStore.theme">
    <under-construction-banner />
    <v-main>
      <slot />
    </v-main>
    <default-footer />
  </v-app>
</template>
<script setup lang="ts">
import { useStore } from '~/store/mainStore';
import DefaultFooter from '~/components/DefaultFooter.vue';
import UnderConstructionBanner from '~/components/UnderConstructionBanner.vue';

const mainStore = useStore();
</script>
<style lang="scss" scoped>
.banner {
  min-height: 70px;
}
</style>
