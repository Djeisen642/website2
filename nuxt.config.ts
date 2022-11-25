// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/styles/index.scss'],
  debug: process.env.NODE_ENV !== 'production',
  typescript: {
    strict: true,
  },
  modules: ['@pinia/nuxt'],
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  ssr: false,
  telemetry: false,
});
