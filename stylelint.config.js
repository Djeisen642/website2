module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-prettier',
  ],
  rules: {
    'string-quotes': 'single',
    'import-notation': 'url', // intellij doesn't understand it otherwise
  },
};
