const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    entry: {
      app: "./public/assets/js/index.js",
      db: "./public/assets/js/db.js",
      serviceWorker: "./public/service-worker.js"
    },
  output: {
    path: __dirname + '/public/dist',
    filename: '[name].bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: "Budget App",
      short_name: "Budget",
      description: "A PWA for budgeting",
      background_color: "#01579b",
      theme_color: "#ffffff",
      start_url: "/",
      icons: [{
        src: path.resolve("public/assets/icons/icon-192x192.png"),
        sizes: [192, 512],
        destination: path.join("public", "assets", "icons")
      }]
    })
  ],
};

module.exports = config;
