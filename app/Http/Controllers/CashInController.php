<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\CashIn; // Pastikan Model CashIn sudah ada
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str; // Untuk generate ID random

class CashInController extends Controller
{
    // --- HALAMAN UTAMA (INDEX) ---
    public function index(Request $request)
    {
        $user = Auth::user();

        // 1. HITUNG STATISTIK GLOBAL
        $pending = Invoice::where('status_pembayaran', 'unpaid')->sum('total_tagihan');
        $confirmed = Invoice::where('status_pembayaran', 'paid')->sum('total_tagihan');
        $total_tagihan_global = $pending + $confirmed;

        $stats = [
            'total_cash_in' => $total_tagihan_global,
            'pending_amount' => $pending,
            'pending_count' => Invoice::where('status_pembayaran', 'unpaid')->count(),
            'confirmed_amount' => $confirmed,
            'confirmed_count' => Invoice::where('status_pembayaran', 'paid')->count(),
        ];

        // 2. QUERY DASAR
        $query = Invoice::with('customer')->orderBy('created_at', 'desc');

        // Filter Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($c) use ($search) {
                      $c->where('nama_pelanggan', 'like', "%{$search}%");
                  });
            });
        }

        // --- PEMBAGIAN TAMPILAN ---
        
        // JIKA ADMIN
        if ($user->role === 'administrator') {
            // Filter Status
            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status_pembayaran', $request->status);
            }

            return Inertia::render('Admin/CashIn', [
                'invoices' => $query->paginate(10)->withQueryString(),
                'stats' => $stats,
                'filters' => $request->only(['search', 'status']),
                'auth_user' => $user,
            ]);
        }

        // JIKA SALES
        return Inertia::render('Sales/CashIn', [
            'invoices' => $query->paginate(10)->withQueryString(),
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    // --- LOGIKA KONFIRMASI PEMBAYARAN (STORE) ---
    public function store(Request $request, $id)
    {
        // 1. Cek Hak Akses
        if (Auth::user()->role !== 'administrator') {
            abort(403, 'Anda tidak memiliki akses untuk konfirmasi pembayaran.');
        }

        // 2. Ambil Data Invoice
        $invoice = Invoice::where('invoice_id', $id)->firstOrFail();

        // Cek jika sudah dibayar agar tidak duplikasi cash_in
        if ($invoice->status_pembayaran === 'paid') {
            return redirect()->back()->with('error', 'Invoice ini sudah lunas sebelumnya.');
        }

        // 3. Update Status Invoice Jadi Paid
        $invoice->update([
            'status_pembayaran' => 'paid',
        ]);

        // 4. Simpan Riwayat ke Tabel cash_ins
        // Generate ID unik untuk Cash In (Format: CI-RANDOM)
        $cashInId = 'CI-' . strtoupper(Str::random(8)); 

        CashIn::create([
            'cash_in_id'        => $cashInId,
            'customer_id'       => $invoice->customer_id,
            'invoice_id'        => $invoice->invoice_id,
            'tanggal_cash_in'   => now(), // Waktu saat ini
            'nama_bank'         => 'Bank Transfer', // Default (bisa diubah nanti)
            'jumlah_pembayaran' => $invoice->total_tagihan,
            'no_referensi'      => 'REF-' . $invoice->invoice_id,
            'metode_pembayaran' => 'Transfer',
            'bukti_pembayaran'  => null,
            'input_by'          => Auth::user()->user_id,
            'status'            => 'confirmed'
        ]);

        return redirect()->back()->with('success', "Pembayaran Invoice #$id dikonfirmasi dan tercatat.");
    }

    // --- LOGIKA TOLAK PEMBAYARAN (REJECT) ---
    public function reject(Request $request, $id)
    {
        if (Auth::user()->role !== 'administrator') {
            abort(403, 'Anda tidak memiliki akses.');
        }

        $invoice = Invoice::where('invoice_id', $id)->firstOrFail();

        $invoice->update([
            'status_pembayaran' => 'rejected',
        ]);

        return redirect()->back()->with('success', "Pembayaran Invoice #$id berhasil ditolak.");
    }
}