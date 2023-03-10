// https://nuxt.com/docs/api/configuration/nuxt-config

const isProduction = process.env.NODE_ENV === 'production';
const envVars = isProduction
  ? {
      domain: 'jasonsuttles-website.firebaseapp.com',
      projectId: 'jasonsuttles-website',
      bucket: 'jasonsuttles-website.appspot.com',
      url: 'https://jasonsuttles.dev',
    }
  : {
      domain: 'jason-website-local.firebaseapp.com',
      projectId: 'jason-website-local',
      bucket: 'jason-website-local.appspot.com',
      url: 'http://localhost:3000',
    };
const authDomain = envVars.domain;
const projectId = envVars.projectId;
const storageBucket = envVars.bucket;
export default defineNuxtConfig({
  css: ['@/assets/styles/index.scss'],
  debug: !isProduction,
  typescript: {
    strict: true,
  },
  modules: ['@pinia/nuxt', '@nuxtjs/robots', 'nuxt-simple-sitemap'],
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
      GOOGLE_FIREBASE_APP_CHECK_SITE_KEY: process.env.GOOGLE_FIREBASE_APP_CHECK_SITE_KEY,
      GOOGLE_FIREBASE_AUTH_DOMAIN: authDomain,
      GOOGLE_FIREBASE_PROJECT_ID: projectId,
      GOOGLE_FIREBASE_STORAGE_BUCKET: storageBucket,
      siteUrl: envVars.url,
    },
  },
  ssr: false,
  telemetry: false,
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Home',
      titleTemplate: 'A Website - %s',
      meta: [
        {
          property: 'description',
          content: "Jason Suttles' website describing himself and showing some stuff",
        },
      ],
    },
  },
});
