<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\CashInController;
use Inertia\Inertia; // <--- WAJIB ADA: Tanpa ini, Error 500 muncul

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Halaman Login (Inertia React)
Route::get('/', function () {
    return Inertia::render('Auth/Login'); // Mengarah ke resources/js/Pages/Auth/Login.jsx
})->name('login');

// 2. Proses Login
// Pastikan method di LoginController adalah 'login', bukan 'authenticate'
Route::post('/login', [LoginController::class, 'login']); 
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// 3. Middleware Group (Hanya user login yang bisa akses)
Route::middleware(['auth', 'verified'])->group(function () {

    // A. Dashboard Redirector
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // B. Route Khusus Administrator
    Route::middleware(['role:administrator'])->group(function () {
        // Tambahkan route admin di sini
    });

    // C. Route Khusus Sales Staff
    Route::middleware(['role:sales_staff'])->group(function () {
        Route::get('/sales/monitoring', [MonitoringController::class, 'indexSales'])->name('sales.monitoring');
        Route::post('/sales/follow-up', [MonitoringController::class, 'storeFollowUp']);
    });

    // D. Route Khusus Collection Staff
    Route::middleware(['role:collection_staff'])->group(function () {
        Route::get('/collection/monitoring', [MonitoringController::class, 'indexCollection'])->name('collection.monitoring');
    });

    // E. Route Global (Cash In)
    Route::post('/cash-in/{id}/confirm', [CashInController::class, 'confirm']);
    Route::post('/cash-in/{id}/reject', [CashInController::class, 'reject']);
});