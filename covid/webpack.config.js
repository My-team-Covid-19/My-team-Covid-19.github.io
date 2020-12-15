const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
      ],
    },
  }];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js'],
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : false,
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src/assets/img'),
    //       to: path.resolve(__dirname, 'dist/img'),
    //     },
    //     {
    //       from: path.resolve(__dirname, 'src/assets/audio'),
    //       to: path.resolve(__dirname, 'dist/audio'),
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jpg$/,
        type: 'asset/resource',
      },
      {
        test: /\.wav$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
