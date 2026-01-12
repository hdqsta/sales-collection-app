<?php

namespace App\Http\Controllers;

use App\Models\CollectionLetter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CollectionLetterController extends Controller
{
    public function index(Request $request)
    {
        $query = CollectionLetter::with(['invoice.customer']) // Ambil relasi ke invoice & customer
            ->orderBy('created_at', 'desc');

        // 1. Filter Search (No Surat, Nama Pelanggan, ID Pelanggan)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('no_surat', 'like', "%{$search}%")
                  ->orWhereHas('invoice.customer', function($c) use ($search) {
                      $c->where('nama_pelanggan', 'like', "%{$search}%")
                        ->orWhere('customer_id', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter Tipe Surat
        if ($request->filled('tipe_surat') && $request->tipe_surat !== 'all') {
            $query->where('tipe_surat', $request->tipe_surat);
        }

        // 3. Filter Tanggal (Berdasarkan Tanggal Pembuatan Surat)
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_surat', [$request->start_date, $request->end_date]);
        }

        return Inertia::render('Collection/Letter/Index', [
            'letters' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'tipe_surat', 'start_date', 'end_date']),
        ]);
    }
}