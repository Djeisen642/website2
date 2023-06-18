import VueAxe from 'vue-axe';

export default defineNuxtPlugin(nuxtApp => {
  const runtimeConfig = useRuntimeConfig();
  if (runtimeConfig.public.IS_PRODUCTION) return;

  nuxtApp.vueApp.use(VueAxe);
});
