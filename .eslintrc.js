module.exports = {
  root: true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/essential', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue', 'prettier'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.dev.config.js'
      }
    }
  },
  rules: {
    'no-console' : 'off',
    'prettier/prettier': 'error'
  }
}
