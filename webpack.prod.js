const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

const copyAllOtherDistFiles = () =>
  new CopyPlugin({
    patterns: [{ from: "src/assets/images", to: "assets" }]
  });

module.exports = merge(common, {
  mode: process.env.NODE_ENV, //  production,

  // Define the destination directory and filenames of compiled resources
  output: {
    filename: "js/[name].[contenthash].bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname, "public")
  },

  // Define used plugins
  plugins: [
    copyAllOtherDistFiles(),
    new CleanWebpackPlugin(),
    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: "/css/[name].[contenthash].css",
      chunkFilename: "[id].[hash].css",
      ignoreOrder: true
    }),

    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    })
  ],

  optimization: {
    minimizer: [new TerserJSPlugin({})],
    splitChunks: {
      cacheGroups: {
        style: {
          name: "style",
          test: /components\.s?css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      // CSS, PostCSS, and Sass
      {
        test: /\.s(a|c)ss$/,
        use: [
          ExtractCssChunks.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"]
              }
            }
          },
          "sass-loader"
        ]
      }
    ]
  }
});
