<template>
  <div id="quill-toolbar"></div>
  <div id="quill-editor"></div>
</template>
<script setup lang="ts">
import 'quill/dist/quill.snow.css';

import Quill from 'quill';
import { watch } from 'vue';
import hljs from '@/utils/highlightjs';

const model = defineModel<string>({ required: true });
let quill: Quill | null = null;

watch(() => model.value, (newValue) => {
  if (!quill || quill.getSemanticHTML() === newValue) return;
  quill.clipboard.dangerouslyPasteHTML(newValue);
}, { immediate: true });

const reinit = () => {
  if (quill)
    // @ts-expect-error - has a container
    quill.getModule('toolbar')?.container.remove(); // after update we're going to have to rebuild this toolbar

  const html = document.querySelector('#quill-editor .ql-editor')?.innerHTML; // get what was there before

  quill = new Quill('#quill-editor', {
    theme: 'snow',
    modules: {
      syntax: {
        hljs,
        languages: [
          { key: 'plain', label: 'Plain' },
          { key: 'css', label: 'CSS' },
          { key: 'xml', label: 'HTML/XML' },
          { key: 'json', label: 'JSON' },
          { key: 'javascript', label: 'JavaScript' },
          { key: 'typescript', label: 'TypeScript' },
          { key: 'sql', label: 'SQL' },
        ],
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'code-block', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
    },
  });
  if (html) quill.root.innerHTML = html; // quill tries to add an extra line
  quill.on('text-change', () => {
    if (!quill) return;
    model.value = quill.getSemanticHTML();
  });
};
onMounted(() => {
  reinit();
});
onUpdated(() => {
  if (document.querySelector('#quill-editor.ql-container')) return;
  reinit();
});
</script>
<style lang="scss">
// stylelint-disable-next-line selector-class-pattern
.v-theme--dark {
  .ql-editing input {
    color: black;
  }

  .ql-action,
  .ql-preview,
  .ql-remove {
    color: blue !important;
  }
}
</style>
