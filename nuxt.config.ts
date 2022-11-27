// https://nuxt.com/docs/api/configuration/nuxt-config

const authDomain =
  process.env.NODE_ENV === 'production'
    ? 'jasonsuttles-website.firebaseapp.com'
    : 'jason-website-local.firebaseapp.com';
const projectId =
  process.env.NODE_ENV === 'production' ? 'jasonsuttles-website' : 'jason-website-local';
const storageBucket =
  process.env.NODE_ENV === 'production'
    ? 'jasonsuttles-website.appspot.com'
    : 'jason-website-local.appspot.com';
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
      GOOGLE_FIREBASE_AUTH_DOMAIN: authDomain,
      GOOGLE_FIREBASE_PROJECT_ID: projectId,
      GOOGLE_FIREBASE_STORAGE_BUCKET: storageBucket,
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
