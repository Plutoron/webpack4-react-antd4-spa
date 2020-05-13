const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // html模版
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 压缩 css 并合并成 文件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css & 去除注释  
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 删除 旧的文件 
const safeParser = require('postcss-safe-parser') // 添加前缀的规则

const HOST = '127.0.0.1'
const PORT = '8081'

module.exports = (env, argv) => {
  const { 
    mode,  // 通过 mode 判断 开发 和 生产
  } = argv

  const resolve = dir => path.join(__dirname, dir)

  const theme = resolve('theme.js')
  
  const isDEV = mode === 'development'

  return {
    devServer: {
      contentBase: [resolve('node_modules'), __dirname],
      compress: true,
      inline: true,
      hot: true,
      port: PORT,
      host: HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      noInfo: true,
      historyApiFallback: {
        disableDotRule: true
      },
      open: false,
      quiet: false,
      overlay: {
        errors: true
      },
    },
    entry: './src/index.js',
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      chunkFilename: isDEV ? '[name].chunk.js' : '[name].[contenthash].js',
      publicPath: '/',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/] || src\//,
            chunks: 'all',
            name: 'common',
            minSize: 0,
            minChunks: 2,
            priority: 10, //优先级
            enforce: true,
          },
        },
      },
      minimizer: [
        ...(isDEV ? [] : [
          new TenserPlugin()
				]),
        new OptimizeCSSAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessorOptions: {
            parser: safeParser,
            discardComments: {
              removeAll: true,
            },
          },
        }),
      ],
    },
    resolve: {
      alias: {
        '@src': resolve('src'),
        '@common': resolve('src/common'),
        '@images': resolve('src/images'),
        '@comps': resolve('src/components'),
      },
      extensions: ['.js', '.jsx', 'css']
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-router-dom': 'ReactRouterDOM',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: resolve('src'),
          exclude: /node_modules/,
          use: ['babel-loader?cacheDirectory'],
        },
        {
          test: /\.(le|c)ss$/,
          use: [
            isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader', 
            { 
              loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  require('autoprefixer')(), // CSS浏览器兼容 需要package.json 添加 对应的 browserslist,也有其他方式，自行搜索
                ]
              }
            },
            `less-loader?{"sourceMap":true, "modifyVars":${JSON.stringify(theme)}, "javascriptEnabled": true}`,
          ], // 注意排列顺序，执行顺序与排列顺序相反
        },
        {
          test: /\.styl$/,
          use: [
            isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            { 
              loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  require('autoprefixer')(), // CSS浏览器兼容 需要package.json 添加 对应的 browserslist,也有其他方式，自行搜索
                ]  
              },
            },
            'stylus-loader',
          ],
          include: [path.resolve(__dirname, 'src')],
          exclude: /node_modules/,
        }, 
        {
          test: /\.(jpg|jpeg|png|gif|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8, // 8k以下的base64内联，不产生图片文件
              fallback: 'file-loader', // 8k以上，用file-loader抽离（非必须，默认就是file-loader）
              name: '[name].[ext]?[hash]', // 文件名规则，默认是[hash].[ext]
              outputPath: 'images/', // 输出路径
              publicPath: ''  // 可访问到图片的引用路径(相对/绝对)
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        jsCdns: [
          './public/react/16.13.1/react.production.min.js',
          './public/react-dom/16.13.1/react-dom.production.min.js',
          './public/react-router-dom/5.1.2/react-router-dom.min.js',
          // 项目变大后 这种资源 走 cdn 最佳
          // './public/antd/4.1.1/antd.min.js',
        ],
        template: './template/index.html',
        minify: {
          collapseWhitespace: true, // 折叠空白
          removeComments: true, // 移除注释
          removeAttributeQuotes: true // 移除属性的引号
        }
      }),
      ...(isDEV ? 
        []
        : [
          new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist')]
          }),
          new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].[contenthash].css'
          }),
        ]
      ),
    ],
  }
}
