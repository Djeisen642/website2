<template>
  <v-app
    :theme="mainStore.theme"
    class="default-layout"
  >
    <v-app-bar
      color="primary"
      prominent
      class="app-bar-on-top"
    >
      <v-app-bar-nav-icon
        aria-label="Open navigation drawer"
        @click.stop="drawer = !drawer"
      />
      <v-app-bar-title>
        <h1 class="text-h4 personal-heading">jason's website - {{ routeName }}</h1>
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      :mobile="device.isMobile"
      class="nav-bar-near-top"
    >
      <v-list aria-label="Pages to navigate to">
        <v-list-item
          v-for="page in pagesList"
          :key="page.title"
          :to="page.to"
          role="option"
        >
          <v-list-item-title :class="{ 'ml-4': page.isChild }">{{ page.title }}</v-list-item-title>
          <v-list-item-subtitle
            v-if="page.subtitle"
            :class="{ 'ml-4': page.isChild }"
          >
            {{ page.subtitle }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main role="main">
      <slot />
    </v-main>
    <default-footer />
    <error-snackbar :snackbar="mainStore.snackbar.snackbar" />
  </v-app>
</template>
<script setup lang="ts">
import { ref, useRoute } from '#imports';

import DefaultFooter from '~/components/DefaultFooter.vue';
import { useStore } from '~/store/mainStore.js';
import { usePostStore } from '~/store/postStore.js';
import { NUM_POSTS_TO_DISPLAY } from '~/utils/constants';

const mainStore = useStore();
const postStore = usePostStore();
const device = useDevice();

const props = defineProps({
  error: {
    type: Object,
    default: null,
    required: false
  }
})

const drawer = ref(false);
type Page = {
  title: string;
  to: string;
  subtitle?: string;
  children?: Page[];
  isChild?: boolean;
};
const pages = ref<Page[]>([
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

// I want to maintain a nested structure for data structure, but the navigation drawer doesn't support that
// so, we flatten it
const pagesList = computed(() => {
  const pagesList = [];
  for (const page of pages.value) {
    pagesList.push(page);
    if (page.children) {
      for (const child of page.children)
        pagesList.push({
          ...child,
          isChild: true,
        });
    }
  }
  return pagesList;
});

onMounted(async () => {
  await postStore.init();
  const newestPosts = postStore.posts
    .filter((post: BlogPost) => post.status === 'published')
    .sort((a: BlogPost, b: BlogPost) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, NUM_POSTS_TO_DISPLAY);
  const blogPage = pages.value.find(page => page.title === 'Blog');
  if (!blogPage)
    return;
  blogPage.children = newestPosts.map((post: BlogPost) => ({
    title: post.title,
    subtitle: postTimestamps(post, true),
    to: `/blog/${post.title.replace(/\s/g, '+').toLowerCase()}`,
  }));
});

const route = useRoute();
const routeName = computed(() => props.error?.statusCode || route.name);
</script>

<style lang="scss">
.default-layout {
  .app-bar-on-top {
    z-index: 5000 !important;
  }

  .nav-bar-near-top {
    z-index: 4000 !important;
  }

  .personal-heading {
    font-family: 'Permanent Marker', cursive;
    opacity: 0.87;
  }
}
</style>
