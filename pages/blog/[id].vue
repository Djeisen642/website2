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
        <div
          class="post-content"
          v-html="blogText"
        ></div>
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
import { postTimestamps, convertBlogText } from '@/utils/helpers_posts';

const postStore = usePostStore();
const route = useRoute();
const postId = route.params.id as string;

const postTitle = postId.toLowerCase().replace(/\+/g, ' ');
const post = postStore.posts.find(p => p.title.toLowerCase() === postTitle);
const blogText = computed(() => convertBlogText(post?.content || ''));

definePageMeta({
  name: 'Blog Post',
  validate: async (route) => {
    const postStore = usePostStore();
    await postStore.init();
    if (typeof route.params.id !== 'string')
      return false;

    const postTitle = route.params.id.toLowerCase().replace(/\+/g, ' ');
    return postStore.posts.some(p => p.title.toLowerCase() === postTitle);
  },
});
</script>
<style lang="scss">
@import url('../../assets/styles/blog_post.scss');
</style>