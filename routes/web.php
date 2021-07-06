<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('blog', function(){
  return view('/pages/blog/index');
})->name('pages.blog');

Route::get('album', function(){
  return view('/pages/album/index');
})->name('pages.album');

Route::get('carousel', function(){
  return view('/pages/carousel/index');
})->name('pages.carousel');

Route::get('features', function(){
  return view('/pages/features/index');
})->name('pages.features');

Route::get('jumbotron', function(){
  return view('/pages/jumbotron/index');
})->name('pages.jumbotron');

Route::get('checkout-form', function(){
  return view('/pages/checkout-form/index');
})->name('pages.checkout-form');

Route::get('pricing', function(){
  return view('/pages/pricing/index');
})->name('pages.pricing');

Route::get('ds-minimal', function(){
  return view('/pages/dashboard/minimal/index');
})->name('pages.dashboard.minimal');