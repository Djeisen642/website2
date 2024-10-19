<template>
  <v-container fluid>
    <h1>Blog!</h1>
    <p>Coming some day using this wysiwig...</p>
    <Editor
      v-model="blogText"
      icons="material"
      :init="{
        license_key: 'gpl',
        plugins: 'lists link wordcount',
        toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link'
      }"
    />
  </v-container>
</template>
<script setup lang="ts">
import 'tinymce/tinymce';
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/wordcount';
import Editor from '@tinymce/tinymce-vue'

useHead({
  title: 'Blog!',
});
const blogText = ref('');

</script>
