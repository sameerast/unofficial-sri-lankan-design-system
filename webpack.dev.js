const { merge } = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

/* defining the source and distribution paths */
const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

// get env information
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PRODUCTION = process.env.NODE_ENV === "production";

// Temporary workaround for 'browserslist' bug that is being patched in the near future
const target = process.env.NODE_ENV === "production" ? "browserslist" : "web";

module.exports = merge(common, {
  mode: process.env.NODE_ENV, //  development,

  // defaults to "web", so only required for webpack-dev-server bug
  target: target,

  //  enable webpack issue debug
  stats: {
    errorDetails: true,
    errorStack: true
  },

  // Define development options
  devtool: "inline-source-map",

  // Define the destination directory and filenames of compiled resources
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/"
  },

  module: {
    rules: [
      //  images
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name]-[hash][ext]?[query]"
        }
      }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    open: true,
    port: 8321,
    index: "index.html",
    stats: "errors-only",
    writeToDisk: true,
    open: "chrome" //open in chrome
  },

  plugins: [
    //  clean public folder
    new CleanWebpackPlugin({
      template: "src/index.html",
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "public/**/*")]
    }),

    new MiniCssExtractPlugin({
      filename: "./css/[name].bundle.css",
      chunkFilename: "[id].css",
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),

    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: path.resolve(__dirname, "public/index.html"),
      inject: true
    }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
});
