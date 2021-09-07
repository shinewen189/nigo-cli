module.exports = prodMode => {
  return [
    {
      test: /.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    },
    {
      test: /\.vue$/,
      use: ['vue-loader']
    }
  ]
}
