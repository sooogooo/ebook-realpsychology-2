const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  entry: {
    main: './website/assets/js/main.js',
    'psychological-assessment': './website/assets/js/psychological-assessment.js',
    'technology-timeline': './website/assets/js/technology-timeline.js',
    'cultural-comparison': './website/assets/js/cultural-comparison.js',
    'decision-tree': './website/assets/js/decision-tree.js',
    'emotional-flow': './website/assets/js/emotional-flow.js',
    'svg-illustration-manager': './website/assets/js/svg-illustration-manager.js',
    'data-visualization': './website/assets/js/data-visualization.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'assets/js/[name].[contenthash].min.js' : 'assets/js/[name].js',
    chunkFilename: isProduction ? 'assets/js/[name].[contenthash].chunk.js' : 'assets/js/[name].chunk.js',
    clean: true,
    publicPath: '/',
    assetModuleFilename: 'assets/images/[name].[contenthash][ext]'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'website/assets'),
      '@js': path.resolve(__dirname, 'website/assets/js'),
      '@css': path.resolve(__dirname, 'website/assets/css'),
      '@svg': path.resolve(__dirname, 'website/assets/svg')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer',
                  'cssnano'
                ]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/svg/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.woff2?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['dist']
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? 'assets/css/[name].[contenthash].min.css' : 'assets/css/[name].css',
      chunkFilename: isProduction ? 'assets/css/[name].[contenthash].chunk.css' : 'assets/css/[name].chunk.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'website/**/*.html',
          to: '[path][name].html',
          transform(content, path) {
            if (isProduction) {
              return require('html-minifier-terser').minify(content.toString(), {
                collapseWhitespace: true,
                removeComments: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeTagWhitespace: true,
                useShortDoctype: true,
                minifyCSS: true,
                minifyJS: true
              });
            }
            return content;
          }
        },
        {
          from: 'website/assets/svg',
          to: 'assets/svg',
          noErrorOnMissing: true
        },
        {
          from: 'website/assets/fonts',
          to: 'assets/fonts',
          noErrorOnMissing: true
        }
      ]
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
      filename: '[path][base].br'
    }),
    ...(isProduction ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    ] : [])
  ],
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    assetFilter: assetFilename => {
      return !assetFilename.endsWith('.map');
    }
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
};