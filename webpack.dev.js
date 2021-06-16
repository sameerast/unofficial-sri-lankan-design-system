const { merge } = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common");
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

var Handlebars = require("handlebars");
const mergeJSON = require("handlebars-webpack-plugin/utils/mergeJSON");
const projectData = mergeJSON(path.join(__dirname, "src/data/*.json"));

/* defining the source and distribution paths */
const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

const protocol = "http://";
const host = "127.0.0.1";
const port = 8321;
const webPort = ":8321/";
// get env information
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PRODUCTION = process.env.NODE_ENV === "production";

// Temporary workaround for 'browserslist' bug that is being patched in the near future
const target = process.env.NODE_ENV === "production" ? "browserslist" : "web";

const subPages = glob.sync("src/pages/**/*.hbs*");
let SubPagesHtmlWebpackPlugins = [];
let plugins = [];

subPages.map(subPageName => {
  justFileName = subPageName.split(".hbs")[0];

  SubPagesHtmlWebpackPlugins.push(
    new HTMLWebpackPlugin({
      template: subPageName,
      //mViewPort: `width=device-width, initial-scale=1.0`,
      favicon: `./src/${subPageName}/favicon.uco`,
      //filename: `${justFileName}.html`,
      inject: false
      //chunks: [`${event}`]
    })
  );
});

const otherPlugins = [
  //  clean public folder
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [
      path.join("public/assets", "public/pages", "public/*.js", "public/*-update.json", "!public/manifest.json")
    ]
  }),

  new CopyPlugin({
    patterns: [
      { from: "src/assets/images", to: "assets/images" },
      { from: "src/data", to: "data" }
    ]
  }),

  new MiniCssExtractPlugin({
    filename: "assets/css/app.css",
    chunkFilename: "[id].css",
    ignoreOrder: false // Enable to remove warnings about conflicting order
  }),

  new HTMLWebpackPlugin({
    favicon: "./src/favicon.ico",
    title: "Generic Head Title",
    // the template you want to use
    template: path.join(__dirname, "src", "partials", "header.hbs"),
    // the output file name
    filename: path.join(__dirname, "public", "partials", "header.hbs"),
    inject: "head"
  }),

  //  handle partials
  new HandlebarsPlugin({
    htmlWebpackPlugin: {
      enabled: true, // register all partials from html-webpack-plugin, defaults to `false`
      prefix: "html", // (???) where to look for htmlWebpackPlugin output. default is "html"
      HTMLWebpackPlugin
    },
    data: projectData,
    //data: path.join(__dirname, "public/data/index.json"),
    entry: path.join(process.cwd(), "src", "**", "*.hbs"),
    output: path.join(process.cwd(), "public", "[path]", "[name].html"),
    partials: [
      path.join(process.cwd(), "html"),
      path.join(process.cwd(), "src", "partials", "*.hbs"),
      path.join(process.cwd(), "src", "partials", "*", "*.hbs"),
      path.join(process.cwd(), "src", "layouts", "*.hbs")
    ],
    helpers: {
      assetsManifest: function (value, key) {
        var manifestPath = path.resolve(__dirname, "public/manifest.json");
        manifest = require(manifestPath);
        if (value == "/assets/css/app.css") {
          return manifest["main.css"];
        }
        if (value == "/assets/js/app.js") {
          return manifest["main.js"];
        }
      },
      nameOfHbsHelper: function (name) {
        console.log("namenamenamename", name);
      },
      getPartialId: function (filePath) {
        console.log("filePathfilePathfilePath", filePath);
      }
    },
    onBeforeSetup: function (Handlebars) {
      var layouts = require("handlebars-layouts");
      Handlebars.registerHelper(layouts(Handlebars));
    }
  }),

  // Only update what has changed on hot reload
  new webpack.HotModuleReplacementPlugin(),

  new WebpackManifestPlugin({
    fileName: path.resolve(__dirname, "public/manifest.json"),
    isInitial: true,
    publicPath: protocol + host + webPort, //process.env.HOST, // Defaults to `localhost`
    isChunk: true,
    filter: file => file.isInitial
  })
];

plugins.splice(SubPagesHtmlWebpackPlugins.length, 0, ...otherPlugins);

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
    filename: "assets/js/app.js",
    path: path.resolve(__dirname, "public"),
    publicPath: protocol + host + webPort
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
        use: [
          { loader: "handlebars-loader" },
          {
            loader: "extract-loader"
          },
          {
            loader: "html-loader",
            options: {
              sources: {
                list: [
                  // All default supported tags and attributes
                  "...",
                  {
                    tag: "img",
                    attribute: "data-src",
                    type: "src"
                  },
                  {
                    tag: "img",
                    attribute: "data-srcset",
                    type: "srcset"
                  },
                  {
                    // Tag name
                    tag: "link",
                    // Attribute name
                    attribute: "href",
                    // Type of processing, can be `src` or `scrset`
                    type: "src"
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    open: true,
    host: host,
    port: port,
    index: "index.html",
    stats: "normal",
    writeToDisk: true,
    open: "chrome", //open in chrome
    clientLogLevel: "info",
    hot: true,
    liveReload: true
  },

  plugins
});
