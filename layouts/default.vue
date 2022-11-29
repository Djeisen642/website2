<template>
  <v-app :theme="mainStore.theme">
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon color="secondary" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>jason's website - {{ route.name }}</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="page in pages" :key="page.title" :to="page.to">
          <v-list-item-title>{{ page.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <under-construction-banner />
      <slot />
    </v-main>
    <default-footer />
  </v-app>
</template>
<script setup lang="ts">
import { useStore } from '~/store/mainStore';
import DefaultFooter from '~/components/DefaultFooter.vue';
import UnderConstructionBanner from '~/components/UnderConstructionBanner.vue';
import { ref, useRoute } from '#imports';

const mainStore = useStore();

const drawer = ref(false);
const pages = ref([
  {
    title: 'Home',
    to: '/',
  },
  {
    title: 'Games',
    to: '/games',
  },
  {
    title: 'Blog',
    to: '/blog',
  },
  {
    title: 'Interesting links',
    to: '/links',
  },
]);

const route = useRoute();
</script>
