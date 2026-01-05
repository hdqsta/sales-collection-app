<?php

namespace App\Http\Controllers;

use App\Models\CashIn;
use App\Models\Invoice;
use App\Models\User; // Import User ditambahkan
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import Auth Facade

class CashInController extends Controller
{
    public function confirm($id)
    {
        $cashIn = CashIn::findOrFail($id);
        
        // 1. Update Status Cash In
        $cashIn->update([
            'status' => 'confirmed',
            'input_by' => Auth::user()->user_id // Menggunakan Auth Facade
        ]);

        // 2. Update Status Invoice menjadi 'paid' otomatis
        $invoice = Invoice::findOrFail($cashIn->invoice_id);
        $invoice->update(['status_pembayaran' => 'paid']);

        return back()->with('success', 'Pembayaran Dikonfirmasi & Invoice Lunas');
    }

    public function reject($id)
    {
        $cashIn = CashIn::findOrFail($id);
        
        $cashIn->update([
            'status' => 'rejected',
            'input_by' => Auth::user()->user_id
        ]);

        return back()->with('error', 'Pembayaran Ditolak');
    }
}