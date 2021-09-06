const path = require('path')
const { merge } = require('webpack-merge')

// js压缩
const TerserPlugin = require('terser-webpack-plugin')
const webpackConfigBase = require('./webpack.common.config')

module.exports = merge(webpackConfigBase(true), {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].[chunkhash].js',
    publicPath: './',
    clean: true
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  plugins: [],
  module: {
    rules: []
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 多进程
        parallel: true,
        //删除注释
        extractComments: false,
        terserOptions: {
          compress: {
            // 生产环境去除console
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
})
