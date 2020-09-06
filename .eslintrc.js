module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended'],
  env: {
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
};
