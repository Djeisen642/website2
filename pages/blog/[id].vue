<template>
  <v-container fluid>
    <h1>Blog!</h1>
    <div class="post">
      {{ postId }}
    </div>
  </v-container>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const postId = route.params.id;
definePageMeta({
  name: `Blog - `,
});
</script>
