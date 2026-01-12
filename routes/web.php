<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\CashInController;
use App\Http\Controllers\TelecollectionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CollectionLetterController;
use Inertia\Inertia; 

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Halaman Login
Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

// 2. Proses Login & Logout
Route::post('/login', [LoginController::class, 'login']); 
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// 3. Middleware Group (Wajib Login)
Route::middleware(['auth', 'verified'])->group(function () {

    // A. Dashboard (Semua Role)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // =================================================================
    // B. MONITORING (Admin, Sales, Collection) - PERBAIKAN UTAMA DISINI
    // =================================================================
    // Kita izinkan 3 role ini mengakses URL yang sama. 
    // Controller yang akan membedakan tampilannya.
    Route::get('/sales/monitoring', [MonitoringController::class, 'index'])
        ->middleware('role:administrator,sales_staff,collection_staff') 
        ->name('sales.monitoring');

    // Aksi Follow Up (Sales & Collection)
    Route::post('/sales/follow-up', [MonitoringController::class, 'storeFollowUp'])
        ->middleware('role:sales_staff,collection_staff,administrator');

        Route::post('/collection/letter', [MonitoringController::class, 'storeLetter'])
    ->middleware('role:collection_staff,administrator') // Sesuaikan hak akses
    ->name('collection.letter.store');

// Route Halaman List Surat
Route::get('/collection/letters', [CollectionLetterController::class, 'index'])
    ->middleware('role:collection_staff,administrator')
    ->name('collection.letters.index');
    // =================================================================
    // C. USER MANAGEMENT (KHUSUS ADMIN)
    // =================================================================
    Route::middleware(['role:administrator'])->group(function () {
        // Resource otomatis membuat route index, create, store, edit, update, destroy
        // Jadi tidak perlu mendefinisikan route delete/get manual lagi di bawah
        Route::resource('users', UserController::class);
    });


    // =================================================================
    // D. FITUR LAINNYA
    // =================================================================

    // 1. Customer Information (Semua Role)
    Route::get('/customer-info', [CustomerController::class, 'index'])->name('customer.index');

    // 2. Invoice (Sales & Collection & Admin)
    Route::get('/sales/invoice', [InvoiceController::class, 'index'])->name('sales.invoice');

    // 3. Telecollection (Sales & Admin)
    Route::get('/sales/telecollection', [TelecollectionController::class, 'index'])
        ->name('sales.telecollection');

    // 4. Cash In (Admin & Sales & Collection)
    // Halaman Cash In
    Route::get('/cash-in', [CashInController::class, 'index'])->name('cashin.index');
    
    // Aksi Konfirmasi & Reject (Hanya Admin)
    Route::post('/cash-in/{id}/confirm', [CashInController::class, 'store'])
        ->name('cashin.confirm')
        ->middleware('role:administrator'); 

    Route::post('/cash-in/{id}/reject', [CashInController::class, 'reject'])
        ->name('cashin.reject')
        ->middleware('role:administrator');

});