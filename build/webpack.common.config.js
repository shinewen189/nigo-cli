const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const rules = require('./webpack.loader.config')

const chalk = require('chalk')

require('dotenv').config({ path: `.env.${process.env.envMode}` })
let env = {}
// 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
for (const key in process.env) {
  if (key === 'NODE_ENV' || key === 'BASE_URL' || /^VUE_/.test(key)) {
    env[key] = JSON.stringify(process.env[key])
  }
}

module.exports = (proMode) => {
  return {
    stats: 'errors-only',
    entry: resolve(__dirname, '../src/main.js'),
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    module: {
      rules: rules(proMode)
    },
    plugins: [
      new webpack.DefinePlugin({
        // 定义环境和变量
        'process.env': {
          ...env
        }
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, '../index.html'),
        filename: 'index.html',
        title: 'nigo',
        minify: {
          html5: true, // 根据HTML5规范解析输入
          collapseWhitespace: true, // 折叠空白区域
          preserveLineBreaks: false,
          minifyCSS: true, // 压缩文内css
          minifyJS: true, // 压缩文内js
          removeComments: false // 移除注释
        }
      }),
      new ProgressBarPlugin({
        format: `:msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
      }),
      new VueLoaderPlugin()
    ]
  }
}
