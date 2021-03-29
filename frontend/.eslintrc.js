module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    //'plugin:vue/vue3-essential',
    //'@vue/standard',
    //'@vue/typescript/recommended'
    
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
    'parser': '@typescript-eslint/parser'
  },
  rules: {
    //'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['error', 'always']
  }
};
