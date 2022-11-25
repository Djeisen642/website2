import { defineNuxtPlugin } from 'nuxt/app';
import { createVuetify, VuetifyOptions } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md3 } from 'vuetify/blueprints';

export default defineNuxtPlugin(nuxtApp => {
  const vuetifyOptions: VuetifyOptions = {
    components,
    directives,
    blueprint: md3,
  };
  const vuetify = createVuetify(vuetifyOptions);
  nuxtApp.vueApp.use(vuetify);
});
