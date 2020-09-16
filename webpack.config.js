const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // webpack will take the files from ./src/index
  entry: './src/index.jsx',
  // and output it into /dist as bundle.js
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
  },
  // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      // we use babel-loader to load our jsx and tsx files
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /.(png|jpg|woff|woff2|eot|ttf|svg|gif)$/,
        loader: 'url-loader?limit=1024000',
      },
    ],
  },
  devServer: {
    publicPath: '/build',
    proxy: {
      '/': 'http://localhost:3030',
    },
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
