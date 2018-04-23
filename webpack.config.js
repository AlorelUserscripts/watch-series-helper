const {join} = require('path');

const isProd = process.env.NODE_ENV === 'production';
const {CheckerPlugin} = require('awesome-typescript-loader');

module.exports = {
  cache: true,
  mode: isProd ? 'production' : 'development',
  entry: {
    userscript: join(__dirname, 'index.ts')
  },
  externals: {},
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'raw-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')({
                browsers: 'last 1000 versions',
                grid: true
              })]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed'
            }
          }
        ]
      },
      {
        test: /\.ts$/i,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            cacheDirectory: join(__dirname, 'node_modules', '.cache', 'awesome-typescript-loader'),
            configFileName: './tsconfig.json',
            useCache: true
          }
        }
      }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ],
  resolve: {
    extensions: [
      '.ts',
      '.js',
      '.scss'
    ],
    mainFields: ['module', 'browser', 'main']
  },
  target: 'web',
  parallelism: require('os').cpus().length,
  output: {
    path: __dirname,
    filename: 'watch-series-helper.raw.js',
    libraryTarget: 'umd',
    library: 'wsh'
  }
};