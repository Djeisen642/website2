<template>
  <v-container fluid>
    <h1>Blog!</h1>
    <p>Coming some day using this wysiwig...</p>
    <QuillEditor v-model="blogText" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="displayBlogText" />
  </v-container>
</template>
<script setup lang="ts">
import hljs from '@/utils/highlightjs';
useHead({
  title: 'Blog!',
});
const blogText = ref('');

const displayBlogText = computed(() => {
  const text = blogText.value;
  if (!blogText.value.includes('</pre>')) return text;
  const el = document.createElement('div');
  el.innerHTML = blogText.value;
  el.querySelectorAll('pre').forEach(pre => {
    const language = pre.getAttribute('data-language');
    if (!language) return;
    const code = hljs.highlight(pre.innerText, { language });
    pre.innerHTML = code.value;
  });

  return el.innerHTML;
});
</script>
<style lang="scss">
.ql-size-small {
  font-size: 0.8rem;
}

.ql-size-large {
  font-size: 1.2rem;
}

.ql-size-huge {
  font-size: 1.8rem;
}

:where(main ol, main ul) {
  margin-inline-start: 0;
  padding-inline-start: 40px;
}

:where(main ul) > li {
  list-style-type: disc;
}

:where(main ul ul) > li {
  list-style-type: circle;
}

:where(main ul ul ul) > li {
  list-style-type: square;
}

:where(main ol) > li {
  list-style-type: decimal;
}

:where(main ol ol) > li {
  list-style-type: lower-alpha;
}

:where(main ol ol ol) > li {
  list-style-type: lower-roman;
}
</style>
