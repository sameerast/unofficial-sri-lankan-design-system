const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
// Temporary workaround for 'browserslist' bug that is being patched in the near future
const target = process.env.NODE_ENV === "production" ? "browserslist" : "web";

//https://www.youtube.com/watch?v=JlBDfj75T3Y&list=PLblA84xge2_zwxh3XJqy6UVxS60YdusY8&index=10
module.exports = {
  // mode defaults to 'production' if not set
  mode: mode,

  // defaults to "web", so only required for webpack-dev-server bug
  target: target,

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "./public"),
    open: true,
    compress: true,
    hot: true,
    port: 8080
  },

  // Define the entry points of our application (can be multiple for different sections of a website)
  entry: {
    index: path.resolve(__dirname, "./src/assets/javascripts/main.js")
  },

  // Define the destination directory and filenames of compiled resources
  output: {
    filename: "./js/main.[contenthash].js",
    path: path.resolve(__dirname, "./public")
  },

  // Define development options
  devtool: "source-map",
  devServer: {
    index: "index.html",
    contentBase: path.join(__dirname, "public"),
    writeToDisk: true,
    hot: true, //Hot module replacement
    open: "chrome" //open in chrome
  },

  // Define loaders
  module: {
    rules: [
      // HTML loader
      {
        test: /\.html$/,
        use: ["html-loader"]
      },

      // Use babel for JS files
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          // without additional settings, this will reference .babelrc
          loader: "babel-loader"
        }
      },

      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/, //(s[ac]|c)ss$/i
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
      },
      //  images
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name]-[hash][ext]?[query]"
        }
      },

      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/fonts"
      },

      // SVGs
      {
        test: /\.svg$/,
        type: "asset/inline"
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i
      })
    ]
  },

  // Define used plugins
  plugins: [
    //  clean public folder
    new CleanWebpackPlugin({
      template: "./src/index.html",
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "public/**/*")]
    }),

    // Load .env file for environment variables in JS
    new Dotenv({
      path: "./.env"
    }),

    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: "./css/main.[contenthash].css"
      //chunkFilename: "[id].css"
    }),

    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "./index.html" // output file
      //inject: false
    }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
};
