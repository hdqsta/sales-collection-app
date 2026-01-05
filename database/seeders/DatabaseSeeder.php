<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\MasterData; // Tambahkan ini
use App\Models\Invoice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Users (Tetap sama)
        $users = [
            [
                'user_id' => 'ADM001',
                'username' => 'admin_rheina',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Rheina Sayla',
                'email' => 'rheina@iconpln.co.id',
                'role' => 'administrator',
                'status' => 'aktif'
            ],
            [
                'user_id' => 'COL001',
                'username' => 'tari_agustina',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Tari Agustina',
                'email' => 'tari@iconpln.co.id',
                'role' => 'collection_staff',
                'status' => 'aktif'
            ],
            [
                'user_id' => 'SAL001',
                'username' => 'nora_fitriyani',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Nora Fitriyani',
                'email' => 'nora@iconpln.co.id',
                'role' => 'sales_staff',
                'status' => 'aktif'
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        // 2. Seed Customer (Tetap sama)
        $customer = Customer::create([
            'customer_id' => 'CUST211090051551',
            'nama_pelanggan' => 'PT Maju Jaya',
            'alamat' => 'Jl. Jenderal Sudirman No. 10, Palembang',
            'no_telepon' => '08123456789',
            'email' => 'contact@majujaya.com',
            'pic_name' => 'Budi Santoso',
            'pic_phone' => '08129876543'
        ]);

        // 3. Seed Master Data (BARU: Jembatan Customer -> Invoice)
        // Sesuai Kamus Data Tabel 3
        $masterData = MasterData::create([
            'master_data_id' => 'MD001',
            'customer_id' => $customer->customer_id,
            'periode' => '2024',
            'tanggal_upload' => now()->subMonths(6),
            'upload_by' => 'ADM001', // Relasi ke User Administrator
            'no_kontrak' => '0228334/P1/10205/PALEMBANG/ICON+/2023',
            'tanggal_mulai_kontrak' => '2023-10-14',
            'tanggal_berakhir_kontrak' => '2025-12-18',
            'periode_pembayaran' => 'bulanan',
            'nilai_kontrak' => 50000000.00,
            'status_kontrak' => 'aktif',
            'keterangan' => 'Layanan Internet Corporate Dedicated',
            'file_source' => 'kontrak_pt_maju_jaya.pdf'
        ]);

        // 4. Seed Invoices
        // Sesuai Kamus Data Tabel 4 & Logika Aging
        $invoices = [
            [
                'invoice_id' => 'INV2500194171',
                'customer_id' => $customer->customer_id,
                'master_data_id' => $masterData->master_data_id, // Ambil dari MasterData yg baru dibuat
                'no_invoice' => '001/INV/2024',
                'tanggal_invoice' => now()->subDays(40),
                'tanggal_jatuh_tempo' => now()->subDays(10), // Aging 1 (Telat 10 hari)
                'periode_tagihan' => 'Desember 2024',
                'total_tagihan' => 2500000.00,
                'status_pembayaran' => 'unpaid'
            ],
            [
                'invoice_id' => 'INV2500194172',
                'customer_id' => $customer->customer_id,
                'master_data_id' => $masterData->master_data_id,
                'no_invoice' => '002/INV/2024',
                'tanggal_invoice' => now()->subDays(100),
                'tanggal_jatuh_tempo' => now()->subDays(70), // Aging 3 (Telat 70 hari)
                'periode_tagihan' => 'Oktober 2024',
                'total_tagihan' => 3200000.00,
                'status_pembayaran' => 'unpaid'
            ]
        ];

        foreach ($invoices as $inv) {
            Invoice::create($inv);
        }
    }
}