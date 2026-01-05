<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\FollowUp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class MonitoringController extends Controller
{
   public function indexSales(Request $request)
{
    // Query Dasar
    $query = Invoice::with(['customer', 'followUps.salesStaff'])
        ->orderBy('created_at', 'desc');

    // 1. Filter Search
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

    // 2. Filter Aging (UPDATE: Logika Hari sesuai Dropdown)
        if ($request->filled('aging_filter') && $request->aging_filter !== 'all') {
            $today = Carbon::now()->startOfDay(); // Pastikan hitungan mulai jam 00:00
            
            $filter = $request->aging_filter;

            if ($filter === 'lancar') {
                // Belum Jatuh Tempo (Tanggal Jatuh Tempo >= Hari Ini)
                $query->whereDate('tanggal_jatuh_tempo', '>=', $today);
            } 
            elseif ($filter == '0') {
                // Lewat 0 s.d 30 Hari (Jatuh Tempo < Hari Ini AND >= 30 Hari Lalu)
                $query->whereDate('tanggal_jatuh_tempo', '<', $today)
                      ->whereDate('tanggal_jatuh_tempo', '>=', $today->copy()->subDays(30));
            } 
            elseif ($filter == '1') {
                // Lewat 30 s.d 60 Hari
                $query->whereDate('tanggal_jatuh_tempo', '<', $today->copy()->subDays(30))
                      ->whereDate('tanggal_jatuh_tempo', '>=', $today->copy()->subDays(60));
            } 
            elseif ($filter == '2') {
                // Lewat 60 s.d 90 Hari
                $query->whereDate('tanggal_jatuh_tempo', '<', $today->copy()->subDays(60))
                      ->whereDate('tanggal_jatuh_tempo', '>=', $today->copy()->subDays(90));
            } 
            elseif ($filter == '3') {
                // Lewat 90 s.d 120 Hari
                $query->whereDate('tanggal_jatuh_tempo', '<', $today->copy()->subDays(90))
                      ->whereDate('tanggal_jatuh_tempo', '>=', $today->copy()->subDays(120));
            } 
            elseif ($filter == '4') {
                // Lewat > 120 Hari
                $query->whereDate('tanggal_jatuh_tempo', '<', $today->copy()->subDays(120));
            }
        }

    // 3. Filter Tanggal - HANYA jika KEDUA terisi
    if ($request->filled('start_date') && $request->filled('end_date')) {
        $query->whereBetween('tanggal_invoice', [
            $request->start_date, 
            $request->end_date
        ]);
    }

    // Eksekusi Pagination
    $invoices = $query->paginate(10)->withQueryString();

   // Hitung Kategori Aging (UPDATE: Sesuai Definisi Septiana & Khristianto, 2022)
        $invoices->getCollection()->transform(function ($invoice) {
            $jatuhTempo = Carbon::parse($invoice->tanggal_jatuh_tempo);
            $now = Carbon::now();
            
            // Hitung selisih hari. 
            // Parameter 'false' agar jika belum jatuh tempo hasilnya negatif
            $daysOverdue = (int) $jatuhTempo->diffInDays($now, false);

            if ($daysOverdue <= 0) {
                // Belum Jatuh Tempo (Lancar)
                // Kita bisa sebut ini "Current" atau masukkan ke Aging 0 (opsional)
                // Sesuai praktik umum, ini biasanya dipisah.
                $invoice->aging_category = 'Lancar'; 
                $invoice->aging_label = 'Current';
            } elseif ($daysOverdue <= 30) {
                // Aging 0 (0–30 hari)
                $invoice->aging_category = 0;
            } elseif ($daysOverdue <= 60) {
                // Aging 1 (30–60 hari)
                $invoice->aging_category = 1;
            } elseif ($daysOverdue <= 90) {
                // Aging 2 (60–90 hari)
                $invoice->aging_category = 2;
            } elseif ($daysOverdue <= 120) {
                // Aging 3 (90–120 hari)
                $invoice->aging_category = 3;
            } else {
                // Aging 4 (lebih dari 120 hari)
                $invoice->aging_category = 4;
            }
            
            // Simpan info hari juga untuk debugging/tampilan detail
            $invoice->days_overdue = $daysOverdue;
            
            return $invoice;
        });

    return Inertia::render('Sales/Monitoring', [
        'invoices' => $invoices,
        'filters' => $request->only(['search', 'aging_filter', 'start_date', 'end_date']),
    ]);
}
}