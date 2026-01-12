Sistem Informasi Sales & Collection (SISC) ⚡
Sistem berbasis web untuk memantau tagihan (invoicing), menghitung aging piutang, mencatat aktivitas follow-up sales, dan mengelola penerbitan surat peringatan (Collection Letter) secara otomatis.

Proyek ini dibangun menggunakan arsitektur Monolith Modern dengan Laravel sebagai backend dan React sebagai frontend, disatukan oleh Inertia.js.

🚀 Teknologi yang Digunakan
Backend: Laravel 11 / 12 (PHP)

Frontend: React.js

Bridge (Penghubung): Inertia.js (Server-side Routing, Client-side Rendering)

Styling: Tailwind CSS

Database: MySQL

Build Tool: Vite

📋 Fitur Utama

1. Administrator
   Dashboard Statistik: Melihat total user, total pelanggan, cash-in bulan ini, dan grafik distribusi aging.

User Management: CRUD (Create, Read, Update, Delete) pengguna aplikasi.

Monitoring Global: Memantau seluruh aktivitas sales dan collection.

2. Sales Staff
   Monitoring Invoice: Melihat daftar tagihan pelanggan.

Filter Canggih: Filter berdasarkan Aging (Lancar, 0-4), Tanggal, dan Pencarian.

Follow Up: Mencatat riwayat penagihan non-formal (telepon, kunjungan).

3. Collection Staff
   Create Collection Letter: Membuat surat formal berdasarkan tingkat keterlambatan.

Support: Verifikasi, Surat Peringatan (SP1, SP2, SP3), Surat Isolir, Surat Pencabutan.

Letter History: Melihat riwayat surat yang pernah diterbitkan.

Logic Mapping: Sistem otomatis memetakan input user ke kategori database yang standar.
