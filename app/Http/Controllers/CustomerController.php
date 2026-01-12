<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        // Ambil data customer + data Sales yang menanganinya
        $query = Customer::with('salesStaff')
            ->orderBy('nama_pelanggan', 'asc');

        // Filter Pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_pelanggan', 'like', "%{$search}%")
                  ->orWhere('customer_id', 'like', "%{$search}%")
                  ->orWhere('nomor_kontrak', 'like', "%{$search}%")
                  ->orWhere('id_perusahaan', 'like', "%{$search}%");
            });
        }

        // Pagination 10 per halaman
        $customers = $query->paginate(10)->withQueryString();

        return Inertia::render('Customer/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }
}