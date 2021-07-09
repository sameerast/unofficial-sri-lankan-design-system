const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const semver = require('semver');
const fs = require('fs');
require("dotenv").config();

moment = require('moment');
const Highcharts = require('highcharts');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

var packageJSON = {};
packageJSON = require('./package.json');
const currentBSVersion = fs.readFileSync('.bsv', { encoding: 'utf8', flag: 'r' });
if (packageJSON.devDependencies.bootstrap != currentBSVersion) {
  fs.writeFileSync('.bsv', packageJSON.devDependencies.bootstrap);

  console.log(`Bootstrap new version ${packageJSON.devDependencies.bootstrap} updated to local .BSV`);
  mix.copy(['./node_modules/bootstrap/dist/js/bootstrap.js'], 'resources/bootstrap/js');
  mix.copy(['./node_modules/bootstrap/scss'], 'resources/bootstrap/scss');

  console.log(`Bootstrap new version ${packageJSON.devDependencies.bootstrap} copied to resources location`);
}

mix.browserSync({
  proxy: process.env.APP_URL //php artisan serve --host=slds.localhost --port=8080
});
//"serve": "php artisan serve --host=domain.test --port=8080 & npm run watch"
mix.webpackConfig({
  plugins: [new LiveReloadPlugin()],
  stats: {
    children: true
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      //Chart: "chart.js/dist/chart.min.js"
    }
  }
});

mix
  .js(['resources/js/app.js'], 'public/js/app.js')
  .sass('resources/vendor/bootstrap/scss/bootstrap.scss', 'public/css/bootstrap.css')
  .postCss('resources/css/app.css', 'public/css/app.css', [
    require('postcss-import'),
    require('postcss-extend'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-custom-properties')
  ])
  .version();
mix.extract(['lodash', 'jQuery', 'Popper', 'bootstrap', 'axios', 'moment', 'Highcharts'], 'public/js/vendor.js').version();
mix.copy(['resources/assets/images'], 'public/images');
mix.autoload({
  jquery: ['$', 'window.jQuery', 'jQuery'],
  moment: ['moment', 'window.moment']
});
