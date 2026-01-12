<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\FollowUp;
use App\Models\User;
use App\Models\CollectionLetter; // Pastikan Model ini ada
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class MonitoringController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // ==========================================================
        // 1. LOGIKA UNTUK ADMIN (DASHBOARD STATISTIK)
        // ==========================================================
        if ($user->role === 'administrator') {
            
            // A. Data Cards (Statistik Atas)
            $totalUsers = User::count();
            $totalCustomers = Customer::count();
            
            // Hitung Surat Collection
            $collectionLetters = FollowUp::whereIn('status_progress', [
                'surat_peringatan', 'surat_hutang', 'sko', 'surat_isolir', 'surat_pencabutan'
            ])->count();
            
            // Total Cash In (Bulan Ini)
            $totalCashIn = Invoice::where('status_pembayaran', 'paid')
                ->whereMonth('updated_at', Carbon::now()->month)
                ->whereYear('updated_at', Carbon::now()->year)
                ->sum('total_tagihan');

            // B. Data Pie Chart (Distribusi Aging)
            $unpaidInvoices = Invoice::where('status_pembayaran', 'unpaid')->get();
            
            $agingStats = [
                'Lancar' => 0, 'Aging 0' => 0, 'Aging 1' => 0,
                'Aging 2' => 0, 'Aging 3' => 0, 'Aging 4' => 0,
            ];

            foreach ($unpaidInvoices as $inv) {
                // Pastikan Accessor 'aging_category' ada di Model Invoice
                $cat = $inv->aging_category; 
                
                if ($cat === 'Lancar') {
                    $agingStats['Lancar']++;
                } else {
                    $key = "Aging $cat";
                    // Pastikan key ada sebelum increment untuk menghindari error
                    if (isset($agingStats[$key])) {
                        $agingStats[$key]++;
                    }
                }
            }

            // C. Data Status Follow Up
            $totalUnpaidCount = Invoice::where('status_pembayaran', 'unpaid')->count();
            $alreadyFollowedUpCount = Invoice::where('status_pembayaran', 'unpaid')
                ->has('followUps')
                ->count();

            // RETURN UNTUK ADMIN (Data Lengkap)
            return Inertia::render('Admin/Monitoring', [
                'stats' => [
                    'total_users' => $totalUsers,
                    'total_customers' => $totalCustomers,
                    'collection_letters' => $collectionLetters,
                    'total_cash_in' => $totalCashIn,
                    'aging_distribution' => $agingStats, // <--- INI YANG HILANG SEBELUMNYA
                    'follow_up_status' => [
                        'sudah' => $alreadyFollowedUpCount,
                        'belum' => max(0, $totalUnpaidCount - $alreadyFollowedUpCount),
                        'total' => $totalUnpaidCount
                    ]
                ]
            ]);
        }

        // ==========================================================
        // 2. QUERY DATA (COMMON UNTUK SALES & COLLECTION)
        // ==========================================================
        
        $query = Invoice::with(['customer', 'followUps.salesStaff'])
            ->orderBy('created_at', 'desc');

        // Filter Search
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

        // Filter Aging
        if ($request->filled('aging_filter') && $request->aging_filter !== 'all') {
            $today = Carbon::now()->startOfDay(); 
            $filter = $request->aging_filter;

            if ($filter === 'lancar') {
                $query->whereDate('tanggal_jatuh_tempo', '>=', $today);
            } elseif (is_numeric($filter)) {
                // Logika aging 0-4 (Sederhana: Lewat jatuh tempo)
                // Sesuaikan logika date range jika perlu presisi bulan
                $query->whereDate('tanggal_jatuh_tempo', '<', $today); 
            }
        }

        // Filter Tanggal
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_invoice', [$request->start_date, $request->end_date]);
        }

        // Eksekusi Pagination
        $invoices = $query->paginate(10)->withQueryString();


        // ==========================================================
        // 3. PEMISAHAN TAMPILAN (SALES vs COLLECTION)
        // ==========================================================

        // A. JIKA COLLECTION STAFF
        if ($user->role === 'collection_staff') {
            return Inertia::render('Collection/Monitoring', [
                'invoices' => $invoices,
                'filters' => $request->only(['search', 'aging_filter', 'start_date', 'end_date']),
            ]);
        }

        // B. DEFAULT (SALES STAFF)
        return Inertia::render('Sales/Monitoring', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'aging_filter', 'start_date', 'end_date']),
        ]);
    }

    // --- METHOD STORE FOLLOW UP (SALES) ---
    public function storeFollowUp(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required',
            'status_progress' => 'required',
            'catatan' => 'nullable',
        ]);

        $invoice = Invoice::where('invoice_id', $validated['invoice_id'])->firstOrFail();

        FollowUp::create([
            'follow_up_id' => 'FU-' . time() . rand(100, 999),
            'invoice_id' => $validated['invoice_id'],
            'customer_id' => $invoice->customer_id, 
            'sales_staff_id' => Auth::user()->user_id, 
            'status_progress' => $validated['status_progress'],
            'catatan' => $validated['catatan'] ?? '-',
            'status_follow_up' => 'sudah',
        ]);

        return redirect()->back()->with('success', 'Follow up berhasil disimpan.');
    }

    // --- METHOD STORE LETTER (COLLECTION) ---
    public function storeLetter(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required',
            'tipe_surat' => 'required',
            'periode_mulai' => 'required',
            'periode_akhir' => 'required',
            'jatuh_tempo_surat' => 'required|date',
        ]);

        $invoice = Invoice::where('invoice_id', $validated['invoice_id'])->firstOrFail();

        // Mapping Tipe Surat
        $tipeSuratDB = $this->mapTipeSurat($validated['tipe_surat']);

        // Generate No Surat (Contoh Sederhana)
        $noSurat = rand(100,999) . '/COLL/PLN/' . $this->getRomawi(date('n')) . '/' . date('Y');

        CollectionLetter::create([
            'letter_id' => 'LET-' . time() . rand(100, 999),
            'no_surat' => $noSurat,
            'invoice_id' => $invoice->invoice_id,
            'tipe_surat' => $tipeSuratDB, 
            'tanggal_surat' => now(),
            'periode_tagihan' => $validated['periode_mulai'] . ' s/d ' . $validated['periode_akhir'],
            'nilai_tagihan' => $invoice->total_tagihan,
            'tanggal_jatuh_tempo' => $validated['jatuh_tempo_surat'],
            'aging_category' => is_numeric($invoice->aging_category) ? $invoice->aging_category : 0,
            'created_by' => Auth::user()->user_id,
        ]);

        // Simpan History ke FollowUp juga agar terlacak
        FollowUp::create([
            'follow_up_id' => 'FU-LET-' . time(),
            'invoice_id' => $invoice->invoice_id,
            'customer_id' => $invoice->customer_id,
            'sales_staff_id' => Auth::user()->user_id,
            'status_progress' => $tipeSuratDB,
            'catatan' => "Membuat Surat " . $validated['tipe_surat'] . " (No: $noSurat)",
            'status_follow_up' => 'sudah',
        ]);

        return redirect()->back()->with('success', 'Surat berhasil dibuat.');
    }

    // --- HELPERS ---
    private function getRomawi($bulan) {
        $map = [1=>'I', 2=>'II', 3=>'III', 4=>'IV', 5=>'V', 6=>'VI', 7=>'VII', 8=>'VIII', 9=>'IX', 10=>'X', 11=>'XI', 12=>'XII'];
        return $map[$bulan] ?? 'I';
    }

    private function mapTipeSurat($input) {
        $input = strtolower($input);
        if (str_contains($input, 'hutang')) return 'surat_hutang';
        if (str_contains($input, 'konfirmasi') || str_contains($input, 'verifikasi')) return 'konfirmasi_outstanding';
        if (str_contains($input, 'isolir')) return 'surat_isolir';
        if (str_contains($input, 'pencabutan')) return 'surat_pencabutan';
        return 'peringatan'; 
    }
}