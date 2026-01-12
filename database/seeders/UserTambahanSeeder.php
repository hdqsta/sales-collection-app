<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserTambahanSeeder extends Seeder
{
    public function run(): void
    {
        $newUsers = [
            // --- Administrator Tambahan ---
            [
                'user_id' => 'ADM002',
                'username' => 'admin_rudi',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Rudi Hartono',
                'email' => 'rudi@iconpln.co.id',
                'role' => 'administrator',
                'status' => 'aktif'
            ],

            // --- Collection Staff Tambahan ---
            [
                'user_id' => 'COL002',
                'username' => 'siti_rahma',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Siti Rahmawati',
                'email' => 'siti@iconpln.co.id',
                'role' => 'collection_staff',
                'status' => 'aktif'
            ],
            [
                'user_id' => 'COL003',
                'username' => 'dedi_kurniawan',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Dedi Kurniawan',
                'email' => 'dedi@iconpln.co.id',
                'role' => 'collection_staff',
                'status' => 'aktif'
            ],

            // --- Sales Staff Tambahan ---
            [
                'user_id' => 'SAL002',
                'username' => 'bambang_supriyadi',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Bambang Supriyadi',
                'email' => 'bambang@iconpln.co.id',
                'role' => 'sales_staff',
                'status' => 'aktif'
            ],
            [
                'user_id' => 'SAL003',
                'username' => 'indah_permata',
                'password' => Hash::make('password123'),
                'nama_lengkap' => 'Indah Permata Sari',
                'email' => 'indah@iconpln.co.id',
                'role' => 'sales_staff',
                'status' => 'aktif'
            ],
        ];

        foreach ($newUsers as $user) {
            // Gunakan firstOrCreate untuk mencegah error jika tidak sengaja dijalankan 2x
            User::firstOrCreate(
                ['user_id' => $user['user_id']], // Cek berdasarkan ID
                $user // Data yang dimasukkan jika ID belum ada
            );
        }
    }
}