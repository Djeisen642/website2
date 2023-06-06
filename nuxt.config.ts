// https://nuxt.com/docs/api/configuration/nuxt-config
import fetch from 'node-fetch';
import vuetify from 'vite-plugin-vuetify';

async function getFontStyles(): Promise<string[]> {
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap',
  ];
  const userAgentsResponse = await fetch('https://jnrbsn.github.io/user-agents/user-agents.json');
  const userAgentsJson = await userAgentsResponse.json();
  if (!Array.isArray(userAgentsJson)) throw new Error('User agents in new format!');
  const userAgent = userAgentsJson.find(userAgent => userAgent.toLowerCase().includes('chrome'));
  if (!userAgent) throw new Error('No Chrome User agent!');
  return Promise.all(
    fontUrls.map(async url => {
      const response = await fetch(url, { headers: { 'user-agent': userAgent } });
      return response.text();
    }),
  );
}

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
  hooks: {
    async ready(nuxt) {
      const styles = await getFontStyles();
      if (!Array.isArray(nuxt.options.app.head.style)) throw new Error('What happened here?');
      nuxt.options.app.head.style.push(...styles);
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/robots',
    (_, nuxt) => {
      // @ts-ignore - no idea why this is erroring
      nuxt.hooks.hook('vite:extendConfig', config => config.plugins?.push(vuetify()));
    },
  ],
  runtimeConfig: {
    public: {
      IS_PRODUCTION: isProduction,
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
      style: [],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
      ],
      title: 'Home',
      titleTemplate: 'A Website - %s',
      meta: [
        {
          name: 'description',
          content: "Jason Suttles' website describing himself and showing some stuff",
        },
      ],
    },
  },
});
