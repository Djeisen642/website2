require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    es2023: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vuejs-accessibility/recommended',
    'prettier',
  ],
  plugins: ['vuejs-accessibility'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
