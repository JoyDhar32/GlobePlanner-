<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Auth routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Trip routes
Route::get('/planner', [TripController::class, 'index'])->name('planner');
Route::post('/planner/generate', [TripController::class, 'generate'])->name('trip.generate');
Route::get('/api/places/autocomplete', [TripController::class, 'autocomplete'])->name('places.autocomplete');

// Shared trip (public)
Route::get('/shared/{token}', [TripController::class, 'showShared'])->name('trip.shared');

// Dashboard (auth required)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [TripController::class, 'dashboard'])->name('dashboard');
    Route::get('/trips/{trip}', [TripController::class, 'show'])->name('trip.show');
    Route::post('/trips/{trip}/wishlist', [TripController::class, 'toggleWishlist'])->name('trip.wishlist');
    Route::post('/trips/{trip}/share', [TripController::class, 'generateShareLink'])->name('trip.share');
    Route::delete('/trips/{trip}', [TripController::class, 'destroy'])->name('trip.destroy');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
});
