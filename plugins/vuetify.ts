import { defineNuxtPlugin } from 'nuxt/app';
import { createVuetify, ThemeDefinition, VuetifyOptions } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md3 } from 'vuetify/blueprints';
import colors from 'vuetify/lib/util/colors';

export default defineNuxtPlugin(nuxtApp => {
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
    components,
    directives,
    blueprint: md3,
    theme: {
      defaultTheme: 'light',
      themes: {
        light,
        dark,
      },
    },
  };
  const vuetify = createVuetify(vuetifyOptions);
  nuxtApp.vueApp.use(vuetify);
});
