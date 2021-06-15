const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
require("dotenv").config({ path: ".env" });

/* defining the source and distribution paths */
const PUB_DIR = path.resolve(__dirname, "public");
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

  // Define the destination directory and filenames of compiled resources
  output: {
    filename: "js/[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "static"),
    publicPath: "/",
    clean: true
  },

  module: {
    rules: [
      //  images
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        loader: "file-loader",
        options: {
          name: "assets/images/[name]-[hash][ext]?[query]"
        }
      }
    ]
  },

  // Define used plugins
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PRODUCTION": JSON.stringify(PRODUCTION),
      "process.env.DEVELOPMENT": JSON.stringify(DEVELOPMENT)
    }),

    //  clean public folder
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "static/**/*")]
    }),
    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: "/css/[name].[contenthash].css",
      chunkFilename: "[id].[hash].css",
      ignoreOrder: true
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }]
                  }
                }
              ])
            }
          ]
        ]
      }
    })
  ],

  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin()]
  }
});
