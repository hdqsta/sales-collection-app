<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Tagihan Aktif (Status 'unpaid')
        $tagihanAktif = Invoice::where('status_pembayaran', 'unpaid')->count();

        // 2. Perlu Follow Up (Status 'unpaid' DAN belum pernah ada record di tabel follow_ups)
        $perluFollowUp = Invoice::where('status_pembayaran', 'unpaid')
            ->doesntHave('followUps')
            ->count();

        // 3. Target Tercapai (Persentase nominal 'paid' dibanding total semua tagihan)
        $totalNominal = Invoice::sum('total_tagihan');
        $totalLunas = Invoice::where('status_pembayaran', 'paid')->sum('total_tagihan');
        
        $persentase = $totalNominal > 0 
            ? round(($totalLunas / $totalNominal) * 100) 
            : 0;

        return Inertia::render('Dashboard', [
            'statistik' => [
                'tagihan_aktif' => $tagihanAktif,
                'perlu_follow_up' => $perluFollowUp,
                'persentase_tercapai' => $persentase
            ]
        ]);
    }
}