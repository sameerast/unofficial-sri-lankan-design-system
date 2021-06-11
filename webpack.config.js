const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackInjector = require("html-webpack-injector");

module.exports = {
  mode: "development", //  development,

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "./public"),
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
    filename: "js/[name].[contenthash].js",
    path: path.resolve(__dirname, "./public")
  },

  // Define development options
  devtool: "inline-source-map",
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
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },

      // CSS, PostCSS, and Sass
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true,
              url: false
            }
          },
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
      filename: "./css/[name].[contenthash].css"
    }),

    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: path.resolve(__dirname, "./public/index.html")
    }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackInjector()
  ]
};
