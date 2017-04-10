const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = function (config) {
  config.set({

    basePath: '../',

    browserNoActivityTimeout: 100000,

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'vendor/aereus/alib_full.js',
      'test/unit/**/*.js',
      //'test/integration/**/*.js',

      // fixtures
      {pattern: 'svr/**/*', watched: true, served: true, included: false}
    ],

    // add preprocessor to the files that should be preprocessed
    preprocessors: {
      'test/unit/*Spec.js': ['webpack', 'sourcemap'],
      'test/unit/**/*Spec.js': ['webpack', 'sourcemap'],
      //'test/integration/*Spec.js': ['webpack', 'sourcemap'],
      //'test/integration/**/*Spec.js': ['webpack', 'sourcemap']
    },

    // junit was causing the hot reload to fail over and over
    //reporters: ['progress', 'junit'],
    reporters: ['progress'],

    // see what is going on
    //logLevel: 'LOG_DEBUG',

    autoWatch: true,
    frameworks: ['jasmine'],
    // 'Chrome_Incog', commented out because it was failing
    browsers: ['PhantomJS'],

    // Set chrome to launch in incognito for clearning local storage
    customLaunchers: {
      Chrome_Incog: {
        base: 'Chrome',
        flags: ['--incognito']
      },
      // Use the debug below if we have any problems
      PhantomJS_Debug: {
        base: 'PhantomJS',
        debug: true
      }
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-junit-reporter',
      'karma-jasmine'
    ],

    // karma watches the test entry points
    // (you don't need to specify the entry option)
    // webpack watches dependencies
    webpack: {
      context: path.resolve(__dirname, './../'),
      //entry: "./test/unit/baseSpec.js",
      resolve: {
        extensions: ['', '.scss', '.js', '.jsx'],
        packageMains: ['browser', 'web', 'main', 'style', 'netric'],
        alias: {
          'netric': path.resolve(__dirname, './../src'),
          // To make mocking fetch work
          'isomorphic-fetch': 'fetch-mock-forwarder',
          // To make enzyme work
          'sinon': 'sinon/pkg/sinon'
        },
        modulesDirectories: [
          'node_modules',
          path.resolve(__dirname, './../node_modules')
        ]
      },
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /(node_modules)/
          },
          {
            test: /\.(scss|css)$/,
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap')
          },
          {
            test: /\.jsx$/,
            loader: 'babel',
            exclude: /(node_modules)/
          },
          {
            test: /\.ttf$|\.eot$/,
            loader: 'file',
            query: {
              name: 'fonts/[name].[ext]'
            }
          },
          /*
           * Enzyme (a JavaScript Testing utility) requires JSON files to decode the result.
           * So we need to set a loader here on how it will handle the json
           */
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin('css/netric.css', {allChunks: true}),
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('test')
          }
        })
      ],
      devtool: 'inline-source-map',
      // The below externals are required for enzyme to work
      // https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
    },

    webpackMiddleware: {
      stats: {
        colors: true
      }
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Used in jenkins to report on tests
    junitReporter: {
      outputDir: 'test/reports',
      outputFile: 'unit.xml',
      suite: 'unit'
    },

  });
};
