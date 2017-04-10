const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/netric.js',
    publicPath: '/build/',
    library: "netric"
  },
  resolve: {
    extensions: ['', '.scss', '.js', '.jsx'],
    packageMains: ['browser', 'web', 'main', 'style'],
    alias: [
      {
          netric: path.resolve(__dirname + './src')
      }
    ],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules)/
      },
      {
        test: /\.(scss)$/,
        //loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap')
        //loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[local]&sourceMap&importLoaders=1&!sass?sourceMap')
        loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[path][name]-[local]-[hash:base64:5]&sourceMap&importLoaders=1&!sass?sourceMap')
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[local]&sourceMap&importLoaders=1&!sass?sourceMap')
      },
      {
        test: /\.jsx$/,
        loader: 'babel',
        exclude: /(node_modules)/
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/netric.css', {allChunks: true}),
    new TransferWebpackPlugin([{
        from: 'img',
        to: 'img'
      },
      {
        from: 'fonts',
        to: 'fonts'
      }
    ])/*,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })*/
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    publicPath: "/build/",
    stats: { colors: true }
  }
};