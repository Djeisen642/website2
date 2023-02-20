module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
  rules: {
    'color-function-notation': null, // variables in vuetify come with commas making the new rgb syntax difficult to work with
    'import-notation': 'url', // intellij doesn't understand it otherwise
  },
};
