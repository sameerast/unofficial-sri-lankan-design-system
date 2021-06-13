const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // Define the entry points of our application (can be multiple for different sections of a website)
  entry: {
    main: "./src/assets/javascripts/scripts.js",
    styles: "./src/assets/stylesheets/main.scss"
  },

  externals: {
    jquery: "jQuery"
  },
  resolve: {
    extensions: [".js", ".css", ".scss"]
  },

  // Define loaders
  module: {
    rules: [
      // CSS, PostCSS, and Sass
      {
        test: /\.s(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
      },

      //  html loader
      {
        test: /\.html$/i,
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

      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/fonts"
      },

      // SVGs
      {
        test: /\.svg$/,
        type: "asset/inline"
      },
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"]
        }
      }
    ]
  },

  // Define used plugins
  plugins: [
    // Load .env file for environment variables in JS
    new Dotenv({
      path: "./.env"
    })
  ]
};
