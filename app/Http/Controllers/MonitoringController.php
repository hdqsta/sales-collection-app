<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\FollowUp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MonitoringController extends Controller
{
   public function indexSales(Request $request)
    {
        if (Auth::user()->role !== 'sales_staff') {
            abort(403, 'Akses Ditolak');
        }
        
        // 1. Load Data + Relasi 'salesStaff' (PENTING untuk fitur "Mata")
        $query = Invoice::with(['customer', 'followUps.salesStaff']);

        // 2. Filter Search (Nama Pelanggan / ID Pelanggan)
        if ($request->has('search')) {
            $query->whereHas('customer', function($q) use ($request) {
                $q->where('nama_pelanggan', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_id', 'like', '%' . $request->search . '%');
            });
        }

        // 3. Filter Periode Tanggal (Sesuai Desain)
        // Asumsi: Filter berdasarkan tanggal invoice dibuat (created_at)
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        // 4. Ambil Data
        $invoices = $query->orderBy('created_at', 'desc')->get();

        // 5. Filter Aging (PHP Level)
        if ($request->has('aging_filter') && $request->aging_filter != 'all') {
            $invoices = $invoices->where('aging_category', (int)$request->aging_filter);
        }

        return Inertia::render('Sales/Monitoring', [
            'invoices' => $invoices->values(),
            // Kirim balik parameter filter agar input tidak reset saat reload
            'filters' => $request->only(['search', 'aging_filter', 'start_date', 'end_date'])
        ]);
    }

    public function storeFollowUp(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required',
            'status_progress' => 'required',
            'catatan' => 'required'
        ]);

        $invoice = Invoice::findOrFail($request->invoice_id);

        FollowUp::create([
            'follow_up_id' => 'FU-' . time(),
            'invoice_id' => $request->invoice_id,
            'customer_id' => $invoice->customer_id,
            'sales_staff_id' => Auth::user()->user_id,
            'status_progress' => $request->status_progress,
            'catatan' => $request->catatan,
            'status_follow_up' => 'sudah'
        ]);

        return redirect()->back()->with('success', 'Follow Up Berhasil Disimpan!');
    }
}