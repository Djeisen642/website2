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
  runtimeConfig: {
    public: {
      GOOGLE_FIREBASE_API_KEY: process.env.GOOGLE_FIREBASE_API_KEY,
      GOOGLE_FIREBASE_MESSAGING_ID: process.env.GOOGLE_FIREBASE_MESSAGING_ID,
      GOOGLE_FIREBASE_APP_ID: process.env.GOOGLE_FIREBASE_APP_ID,
      GOOGLE_FIREBASE_MEASUREMENT_ID: process.env.GOOGLE_FIREBASE_MEASUREMENT_ID,
    },
  },
  ssr: false,
  telemetry: false,
  app: {
    head: {
      meta: [
        {
          property: 'description',
          content: "Jason Suttles's website describing himself and showing some stuff",
        },
      ],
    },
  },
});
