const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

const copyAllOtherDistFiles = () =>
  new CopyPlugin({
    patterns: [{ from: "src/assets/images", to: "assets" }]
  });

module.exports = merge(common, {
  mode: process.env.NODE_ENV, //  development,

  // Define the destination directory and filenames of compiled resources
  output: {
    filename: "js/[name].bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname, "public")
  },

  devServer: {
    historyApiFallback: true,
    contentBase: "public",
    compress: true,
    hot: true,
    port: 8080,
    index: "index.html",
    stats: "errors-only"
  },

  plugins: [
    copyAllOtherDistFiles(),
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].bundle.css",
      chunkFilename: "[id].css",
      ignoreOrder: true
    })
  ],

  optimization: {
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
          {
            loader: ExtractCssChunks.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV === "development",
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
              outputPath: "css",
              name: "[name].css"
            }
          },
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
