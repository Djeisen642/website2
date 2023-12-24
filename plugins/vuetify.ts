import {
  mdiBrightness4,
  mdiCat,
  mdiGithub,
  mdiLinkedin,
  mdiLogin,
  mdiMouseVariant,
  mdiSkull,
  mdiWrench,
} from '@mdi/js';
import { defineNuxtPlugin } from 'nuxt/app';
import { type ThemeDefinition, type VuetifyOptions, createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import colors from 'vuetify/lib/util/colors';

export default defineNuxtPlugin({
  parallel: true,
  setup: nuxtApp => {
    const light: ThemeDefinition = {
      dark: false,
      colors: {
        primary: colors.deepPurple.base, // deep purple
        secondary: colors.blue.base, // blue
      },
    };

    const dark: ThemeDefinition = {
      dark: true,
      colors: {
        primary: colors.deepPurple.darken2, // dark deep purple
        secondary: colors.blue.base, // blue
      },
    };

    const vuetifyOptions: VuetifyOptions = {
      blueprint: md3,
      icons: {
        defaultSet: 'mdi',
        aliases: {
          ...aliases,
          github: mdiGithub,
          login: mdiLogin,
          brightness: mdiBrightness4,
          wrench: mdiWrench,
          linkedin: mdiLinkedin,
          mouse: mdiMouseVariant,
          cat: mdiCat,
          skull: mdiSkull,
        },
        sets: {
          mdi,
        },
      },
      theme: {
        defaultTheme: 'light',
        variations: {
          colors: ['primary', 'secondary'],
          lighten: 3,
          darken: 0,
        },
        themes: {
          light,
          dark,
        },
      },
    };
    const vuetify = createVuetify(vuetifyOptions);
    // @ts-ignore - not sure why this isn't good. but it should work
    nuxtApp.vueApp.use(vuetify);
  },
});
