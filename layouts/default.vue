<template>
  <v-app :theme="mainStore.theme" class="default-layout">
    <v-app-bar
      color="primary"
      prominent
    >
      <v-app-bar-nav-icon
        aria-label="Open navigation drawer"
        color="secondary"
        @click.stop="drawer = !drawer"
      />
      <v-app-bar-title>
        <h1 class="text-h4">jason's website - {{ route.name }} {{ pageId }}</h1>
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      role="navigation"
    >
      <v-list aria-label="Pages to navigate to">
        <v-list-item
          v-for="page in pages"
          :key="page.title"
          :to="page.to"
          role="option"
        >
          <v-list-item-title>{{ page.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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
import { ref, useRoute } from '#imports';

import DefaultFooter from '~/components/DefaultFooter.vue';
import { useStore } from '~/store/mainStore.js';

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
  {
    title: 'Cat and Mouse game',
    to: '/catandmouse',
  },
  {
    title: '2048 Clone',
    to: '/2048',
  },
  {
    title: 'Code Editor',
    to: '/codeeditor',
  },
  {
    title: 'Pong',
    to: '/pong',
  },
]);

const route = useRoute();
const pageId = route.params.id;
</script>

<style lang="scss">
.default-layout {
  &.v-theme--dark {
    a {
      color: rgb(var(--v-theme-secondary-lighten-3));
    }
    a:visited {
      color: rgb(var(--v-theme-secondary-lighten-2));
    }
  }
}
</style>
