import VueAxe from 'vue-axe';

// only loaded in development
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(VueAxe);
});
