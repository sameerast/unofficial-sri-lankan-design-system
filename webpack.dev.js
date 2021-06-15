const { merge } = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common");
const path = require("path");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

var Handlebars = require("handlebars");
const mergeJSON = require("handlebars-webpack-plugin/utils/mergeJSON");
const projectData = mergeJSON(path.join(__dirname, "src/data/*.json"));

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
    filename: "js/main.bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/"
    // assetModuleFilename: "assets/images/[name][ext]"
  },

  module: {
    rules: [
      //  images
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: "warning", // Ignore errors on corrupted images
              minimizerOptions: {
                plugins: ["gifsicle"]
              }
            }
          }
        ]
      },
      //handlebars loader
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    open: true,
    port: 8321,
    index: "index.html",
    stats: "normal",
    writeToDisk: true,
    open: "chrome", //open in chrome
    clientLogLevel: "info",
    hot: true,
    liveReload: true
  },

  plugins: [
    //  clean public folder
    new CleanWebpackPlugin({
      template: "src/index.html",
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "public/**/*")]
    }),

    new CopyPlugin({
      patterns: [{ from: "src/assets/images", to: "assets/images" }]
    }),

    new MiniCssExtractPlugin({
      filename: "./css/main.bundle.css",
      chunkFilename: "[id].css",
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),

    //  handle partials
    new HandlebarsPlugin({
      HtmlWebpackPlugin: {
        enabled: true, // register all partials from html-webpack-plugin, defaults to `false`
        prefix: "html" // (???) where to look for htmlWebpackPlugin output. default is "html"
      },
      entry: path.join(process.cwd(), "src", "**", "*.hbs"),
      output: path.join(process.cwd(), "public", "[path]", "index.html"),
      partials: [
        path.join(process.cwd(), "src", "partials", "*.hbs"),
        path.join(process.cwd(), "src", "partials", "*", "*.hbs"),
        path.join(process.cwd(), "src", "layouts", "*.hbs")
      ],
      helpers: {
        assetsManifest: function (value) {
          var manifestPath = path.join(process.cwd(), "public", "mix-manifest.json");
          manifest = require(manifestPath);
          return manifest[value];
        }
      },
      onBeforeSetup: function (Handlebars) {
        var layouts = require("handlebars-layouts");
        Handlebars.registerHelper(layouts(Handlebars));
      }
    }),

    new HTMLWebpackPlugin({
      template: path.join(__dirname, "src", "pages", "index.hbs"),
      favicon: "./src/favicon.ico",
      filename: "index.html"
    }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
});
