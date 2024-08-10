// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default withNuxt(
  ...pluginVueA11y.configs['flat/recommended'],
  {
    rules: {
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'any', // <slot> is considered a normal component...
            component: 'always',
          },
        },
      ],
    },
  },
  // Your custom configs here
);
