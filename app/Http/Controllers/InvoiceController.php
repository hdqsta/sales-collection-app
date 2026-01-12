<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with('customer')
            ->orderBy('created_at', 'desc');

        // 1. Filter Search (Invoice ID / Nama Pelanggan)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($c) use ($search) {
                      $c->where('nama_pelanggan', 'like', "%{$search}%")
                        ->orWhere('customer_id', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter Tanggal
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_invoice', [
                $request->start_date, 
                $request->end_date
            ]);
        }

        // 3. Filter Status (Paid/Unpaid)
        // Mapping: 'paid' -> Confirmed, 'unpaid' -> Pending
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status_pembayaran', $request->status);
        }

        $invoices = $query->paginate(10)->withQueryString();

        return Inertia::render('Sales/Invoice', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date']),
        ]);
    }
}