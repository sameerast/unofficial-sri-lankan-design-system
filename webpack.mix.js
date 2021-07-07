const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');
require('laravel-mix-imagemin');
const semver = require('semver');
const fs = require('fs');

moment = require('moment');
require('chartjs-adapter-moment');

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
  proxy: 'slds.localhost:8080' //php artisan serve --host=slds.localhost --port=8080
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
  .scripts(['resources/js/charts.js'], 'public/js/components.js')
  .sass('resources/vendor/bootstrap/scss/bootstrap.scss', 'public/css/bootstrap.css')
  .postCss('resources/css/app.css', 'public/css/app.css', [
    require('postcss-import'),
    require('postcss-extend'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-custom-properties')
  ]);
mix.extract(['lodash', 'jQuery', 'Popper', 'bootstrap', 'axios', 'moment'], 'public/js/vendor.js');
mix.copy(['resources/assets/images'], 'public/images');
mix.copy(['./node_modules/chart.js/dist/chart.min.js'], 'public/js/chart.js');
mix.autoload({
  jquery: ['$', 'window.jQuery', 'jQuery'],
  moment: ['moment', 'window.moment']
});
// mix.imagemin(
//   "resources/assets/images",
//   {
//     context: "resources"
//   },
//   {
//     optipng: {
//       optimizationLevel: 5
//     },
//     jpegtran: null,
//     plugins: [
//       require("imagemin-mozjpeg")({
//         quality: 100,
//         progressive: true
//       })
//     ]
//   }
// );

/*
  mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps(true, 'source-map')
    .version();



    let mix = require('laravel-mix');

mix.autoload({
    jquery: ['$', 'window.jQuery', 'jQuery'],
    'popper.js/dist/umd/popper.js': ['Popper']
});



mix.js('node_modules/popper.js/dist/popper.js', 'public/js').sourceMaps();
mix.js('resources/assets/js/app.js', 'public/js').sourceMaps();

mix.sass('resources/assets/sass/app.scss', 'public/css')
.sass('resources/assets/sass/com.scss', 'public/css');

mix.styles([
    'resources/assets/css/com-landing-page.css',
    'resources/assets/css/com-badge-animation.css'
], 'public/css/com.css');


mix.copy('resources/assets/js/thirdparty/gauge.min.js', 'public/js/gauge.min.js');

mix.js('resources/assets/js/com.js', 'public/js').version();

mix.copyDirectory('resources/assets/images', 'public/img/');








The top of my Bootstrap.js file looks like this...


window._ = require('lodash');


import Popper from 'popper.js/dist/umd/popper.js';


try {
    window.Popper = Popper;    
    window.$ = window.jQuery = require('jquery');    
    require('bootstrap');
  } catch (e) {}



  <script src="{{ asset('js/popper.js') }}"></script>








  resources/js/bootstrap.js:

window._ = require('lodash');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.Vue = require('vue');

window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js').default;
require('bootstrap');











webpack.mix.js:

const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
  .extract(['lodash', 'axios', 'vue', 'jquery', 'popper.js', 'bootstrap'])
  .sourceMaps()
  .version()
  .sass('resources/sass/app.scss', 'public/css').version();








  
    */
