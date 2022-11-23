import { defineNuxtPlugin } from 'nuxt/app';
import { button, snackbar, dialog } from 'vue-material-adapter';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(button);
  nuxtApp.vueApp.use(snackbar);
  nuxtApp.vueApp.use(dialog);
});
