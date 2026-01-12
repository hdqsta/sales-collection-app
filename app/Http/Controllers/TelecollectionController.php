<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TelecollectionController extends Controller
{
    /**
     * Menampilkan halaman riwayat telecollection/follow-up.
     */
    public function index(Request $request)
    {
        // Ambil data Follow Up dengan relasi Invoice, Customer, dan User (Sales)
        $query = FollowUp::with(['invoice.customer', 'salesStaff'])
            ->orderBy('created_at', 'desc');

        // 1. Filter Search (Invoice ID / Nama Pelanggan)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_id', 'like', "%{$search}%")
                  ->orWhereHas('invoice.customer', function ($c) use ($search) {
                      $c->where('nama_pelanggan', 'like', "%{$search}%")
                        ->orWhere('customer_id', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter Tipe Surat / Status Progress
        if ($request->filled('tipe_surat') && $request->tipe_surat !== 'all') {
            $query->where('status_progress', $request->tipe_surat);
        }

        // 3. Filter Periode Tanggal
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00', 
                $request->end_date . ' 23:59:59'
            ]);
        }

        // Pagination - Menggunakan withQueryString agar filter tidak hilang saat ganti halaman
        $telecollections = $query->paginate(10)->withQueryString();

        return Inertia::render('Sales/Telecollection', [
            'telecollections' => $telecollections,
            'filters' => $request->only(['search', 'tipe_surat', 'start_date', 'end_date']),
        ]);
    }
}