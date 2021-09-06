module.exports = (prodMode) => {
  return [
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader'] // 从右向左解析原则
    },
    {
      test: /\.vue$/,
      use: ['vue-loader']
    }
  ]
}
