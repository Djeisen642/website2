<template>
  <v-container fluid>
    <template v-if="postStore.loaded">
      <div v-if="post">
        <h1>{{ post.title }}</h1>
        <div class="mb-2">
          <p>By {{ post.author }}</p>
          <p>{{ postTimestamps(post) }}</p>
        </div>
        <v-divider />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="post.content"></div>
      </div>
    </template>
    <v-progress-circular
      v-else
      indeterminate
      class="ma-4"
    />
  </v-container>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { usePostStore } from '~/store/postStore';
import { postTimestamps } from '@/utils/helpers_posts';

const postStore = usePostStore();
const route = useRoute();
const postId = route.params.id as string;

const postTitle = postId.toLowerCase().replace(/\+/g, ' ');
const post = postStore.posts.find(p => p.title.toLowerCase() === postTitle);

definePageMeta({
  name: 'Blog Post',
  validate: async (route) => {
    const postStore = usePostStore();
    await postStore.init();
    const postTitle = route.params.id.toLowerCase().replace(/\+/g, ' ');
    return postStore.posts.some(p => p.title.toLowerCase() === postTitle);
  },
});
</script>