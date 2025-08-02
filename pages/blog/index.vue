<template>
  <v-container fluid>
    <v-list v-if="postStore.loaded">
      <v-list-subheader v-if="!postStore.posts.length">
        No blog posts yet. Start writing one below!
      </v-list-subheader>
      <v-list-item
        v-for="post in postStore.posts"
        :key="post.id"
        :title="post.title"
        :subtitle="postTimestamps(post)"
      >
        <template #append>
          <div class="d-flex align-center">
            <v-btn
              v-if="post.status === 'published'"
              :href="`/blog/${post.title.replace(/\s/g, '+').toLowerCase()}`"
              target="_blank"
              color="secondary"
              variant="text"
              class="mr-2 font-weight-bold"
            >
              View
            </v-btn>
            <template v-if="authStore.user">
              <v-btn
                v-if="post.status === 'draft'"
                color="secondary"
                variant="text"
                class="mr-2 font-weight-bold"
                :loading="publishingId === post.id"
                @click="publishPost(post)"
              >
                Publish
              </v-btn>
              <v-btn
                color="secondary"
                variant="text"
                class="mr-2 font-weight-bold"
                :disabled="publishingId === post.id"
                @click="editPost(post)"
              >
                Edit
              </v-btn>
              <v-btn
                color="secondary"
                variant="text"
                class="mr-2 font-weight-bold"
                :disabled="publishingId === post.id"
                @click="deletePost(post)"
              >
                Delete
              </v-btn>
            </template>
            <v-chip
              :color="post.status === 'published' ? 'success' : 'warning'"
              size="small"
            >
              {{ post.status }}
            </v-chip>
          </div>
        </template>
      </v-list-item>
    </v-list>
    <v-progress-circular
      v-else
      indeterminate
      class="ma-4"
    />
    <v-divider class="my-4" />
    <v-text-field
      v-model="blogTitle"
      label="Blog Title"
      class="mb-2"
      :loading="loading"
      :disabled="loading"
    />
    <p class="mb-4">
      (I'm using Quill to write these blog posts. You can find it here:
      <a
        href="https://quilljs.com/"
        target="_blank"
      >Quill</a>)
    </p>
    <QuillEditor
      v-model="blogText"
      :disabled="loading"
    />
    <div class="d-flex mt-4">
      <v-btn
        v-if="authStore.user"
        color="secondary"
        :loading="loading"
        @click="savePost"
      >
        Save Post
      </v-btn>
      <v-btn
        v-if="editingPost"
        class="ml-2"
        color="secondary"
        :disabled="loading"
        @click="cancelEdit"
      >
        Cancel
      </v-btn>
    </div>
    <template v-if="editingPost || blogTitle || !isEmptyText">
      <v-divider class="my-4" />
      <h2>{{ blogTitle || 'No title' }}</h2>
      <div class="mb-2">
        <p>By {{ authStore.user?.displayName || 'Anonymous' }}</p>
        <p>{{
          postTimestamps(editingPost || getTimestamps()) }}</p>
      </div>
      <v-divider />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="post-content"
        v-html="displayBlogText"
      ></div>
    </template>
  </v-container>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/store/authStore';
import { usePostStore } from '~/store/postStore';
import { useStore } from '~/store/mainStore';
import type { BlogPost } from '~/utils/types';
import { getTimestamps, postTimestamps, convertBlogText, hashString } from '@/utils/helpers_posts';

useHead({
  title: 'Blog index',
});

const mainStore = useStore();
const authStore = useAuthStore();
const postStore = usePostStore();
const publishingId = ref<string | null>(null);

postStore.init();

const loading = ref(false);
const blogTitle = ref('');
const blogText = ref('');
const emptyBlogText = '<p></p>'
const editingPost = ref<BlogPost | null>(null);
const isEmptyText = computed(() => !blogText.value || blogText.value === emptyBlogText);
let originalHash = '';
setTimeout(() => {
  originalHash = hashString(blogTitle.value + blogText.value);
}, 300);

async function editPost(post: BlogPost) {
  if (!isEmptyText.value && blogTitle.value && originalHash !== hashString(blogTitle.value + blogText.value)) {
    // TODO maybe make this a dialog
    const confirm = window.confirm('You have unsaved changes. Are you sure you want to edit this post?');
    if (!confirm) return;
  }
  editingPost.value = post;
  blogTitle.value = post.title;
  blogText.value = post.content;
  originalHash = hashString(post.title + post.content);
}
async function deletePost(post: BlogPost) {
  try {
    await postStore.deletePost(post);
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  }
}

async function savePost() {
  loading.value = true;
  try {
    if (!authStore.user) {
      mainStore.setSnackbar('You must be logged in to save a blog post');
      return;
    }
    if (blogTitle.value === '') {
      mainStore.setSnackbar('Blog title cannot be empty');
      return;
    }
    if (isEmptyText.value) {
      mainStore.setSnackbar('Blog post cannot be empty');
      return;
    }
    if (editingPost.value) {
      await postStore.updatePost({
        ...editingPost.value,
        title: blogTitle.value,
        content: blogText.value,
      });
      editingPost.value = null;
    } else {
      await postStore.addPost({
        title: blogTitle.value,
        content: blogText.value,
      }, authStore.user);
    }
    // Clear form after successful save
    blogTitle.value = '';
    blogText.value = '';
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  } finally {
    loading.value = false;
  }
}

function cancelEdit() {
  editingPost.value = null;
  blogTitle.value = '';
  blogText.value = '';
}

async function publishPost(post: BlogPost) {
  if (!post.id) return;

  publishingId.value = post.id;
  try {
    await postStore.publishPost(post.id);
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  } finally {
    publishingId.value = null;
  }
}

const displayBlogText = computed(() => {
  return convertBlogText(blogText.value);
});
</script>
<style lang="scss">
@import url('../../assets/styles/blog_post.scss');

.ql-size-small {
  font-size: 0.8rem;
}

.ql-size-large {
  font-size: 1.2rem;
}

.ql-size-huge {
  font-size: 1.8rem;
}
</style>
