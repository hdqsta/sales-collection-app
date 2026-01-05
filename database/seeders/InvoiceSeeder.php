<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Data Pelanggan (ID Angka 12 Digit)
        $customers = [
            ['id' => '211090051551', 'name' => 'PT Maju Jaya', 'kontrak' => '022/P1/ICON/2023'],
            ['id' => '211090051552', 'name' => 'CV Berkah Sentosa', 'kontrak' => '023/P1/ICON/2023'],
            ['id' => '211090051553', 'name' => 'Dinas Pendidikan Sumsel', 'kontrak' => '024/P1/ICON/2023'],
            ['id' => '211090051554', 'name' => 'RSUD Palembang', 'kontrak' => '025/P1/ICON/2023'],
            ['id' => '211090051555', 'name' => 'PT Semen Baturaja', 'kontrak' => '026/P1/ICON/2023'],
        ];

        foreach ($customers as $c) {
            DB::table('customers')->updateOrInsert(
                ['customer_id' => $c['id']],
                [
                    'nama_pelanggan' => $c['name'],
                    'nomor_kontrak' => $c['kontrak'],
                    'alamat' => 'Jalan Dummy No. ' . rand(1, 100),
                    'no_telepon' => '0812' . rand(10000000, 99999999),
                    'email' => strtolower(str_replace(' ', '', $c['name'])) . '@example.com',
                    'pic_name' => 'Bpk. Manager ' . explode(' ', $c['name'])[1],
                    'pic_phone' => '0813' . rand(10000000, 99999999),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // 2. Data Invoice
        $invoices = [];
        
        for ($i = 1; $i <= 20; $i++) {
            $cust = $customers[array_rand($customers)];
            
            // Random Tanggal
            $monthsAgo = rand(0, 4); 
            $tglInvoice = Carbon::now()->subMonths($monthsAgo)->subDays(rand(1, 28));
            $jatuhTempo = (clone $tglInvoice)->addDays(30);

            $isPaid = rand(1, 10) > 8; 
            
            // --- UPDATE: ID INVOICE 10 DIGIT BERURUTAN ---
            // Start dari 2500194171, 2500194172, dst.
            $invoiceId = 2500194173 + $i; 
            // ---------------------------------------------

            $invoices[] = [
                'invoice_id' => (string)$invoiceId, // Pastikan jadi string
                'customer_id' => $cust['id'],
                'master_data_id' => 'MD-' . rand(1000, 9999),
                
                // No Invoice mengikuti format ID baru
                'no_invoice' => $invoiceId . '/PLN/ICON/' . date('Y'),
                
                'periode_tagihan' => $tglInvoice->format('F Y'),
                'total_tagihan' => rand(1, 50) * 500000,
                'status_pembayaran' => $isPaid ? 'paid' : 'unpaid', 
                'tanggal_invoice' => $tglInvoice,
                'tanggal_terbit' => $tglInvoice,
                'tanggal_jatuh_tempo' => $jatuhTempo,
                'created_at' => $tglInvoice,
                'updated_at' => now(),
            ];

            // 3. History Follow Up
            if (!$isPaid && rand(0, 1)) {
                DB::table('follow_ups')->insert([
                    'follow_up_id' => 'FU-' . time() . $i,
                    'invoice_id' => (string)$invoiceId,
                    'customer_id' => $cust['id'],
                    'sales_staff_id' => 2,
                    'status_progress' => ['verifikasi_user', 'surat_peringatan', 'isolir'][rand(0, 2)],
                    'catatan' => 'Follow up dummy otomatis oleh sistem.',
                    'status_follow_up' => 'sudah',
                    'created_at' => now()->subDays(rand(1, 5)),
                    'updated_at' => now(),
                ]);
            }
        }

        DB::table('invoices')->insert($invoices);
    }
}