const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
//const HtmlWebpackInjector = require("html-webpack-injector");
//const HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = {
  // Define the entry points of our application (can be multiple for different sections of a website)
  entry: {
    main: "src/assets/javascripts/main.js",
    style: "src/assets/javascripts/style.js"
  },

  // Define loaders
  module: {
    rules: [
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

      //  images
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]?[query]"
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

  // Define used plugins
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: path.resolve(__dirname, "public/index.html")
    }),

    // new HandlebarsPlugin({
    //   htmlWebpackPlugin: {
    //     enabled: true, // register all partials from html-webpack-plugin, defaults to `false`
    //     prefix: "html", // where to look for htmlWebpackPlugin output. default is "html"
    //     HTMLWebpackPlugin // optionally: pass in HtmlWebpackPlugin if it cannot be resolved
    //   },
    //   entry: path.join(process.cwd(), "src/pages"),
    //   output: path.join(process.cwd(), "public", "index.html"),
    //   // globbed path to partials, where folder/filename is unique
    //   partials: [path.join(process.cwd(), "src/partials")]
    // }),
    //  HTML partial including
    // new FileIncludeWebpackPlugin({
    //   source: "./src/pages", // relative path to your pages
    //   destination: "./pages"
    // }),

    // Load .env file for environment variables in JS
    new Dotenv({
      path: "./.env"
    }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()

    //new HtmlWebpackInjector()
  ]
};
