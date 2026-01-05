import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Head title="Dashboard - PLN Icon Plus" />

            {/* Navbar Atas */}
            <nav className="bg-blue-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl tracking-wider">
                                PLN Icon Plus
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">
                                Halo, {auth.user.nama_lengkap}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Konten Utama */}
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Selamat Datang di Sistem Sales & Collection
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Anda login sebagai:{" "}
                            <span className="font-bold uppercase text-blue-900">
                                {auth.user.role}
                            </span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* MENU SALES: Perbaikan di sini (Ganti route() jadi string URL) */}
                            {auth.user.role === "sales_staff" && (
                                <Link
                                    href="/sales/monitoring"
                                    className="block group"
                                >
                                    <div className="border rounded-lg p-6 hover:shadow-lg transition bg-blue-50 border-blue-200 cursor-pointer h-full">
                                        <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-700">
                                            📊 Monitoring Piutang
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Pantau invoice pelanggan dan update
                                            status follow-up.
                                        </p>
                                    </div>
                                </Link>
                            )}

                            {/* MENU COLLECTION: Perbaikan di sini (Ganti route() jadi string URL) */}
                            {auth.user.role === "collection_staff" && (
                                <Link
                                    href="/collection/monitoring"
                                    className="block group"
                                >
                                    <div className="border rounded-lg p-6 hover:shadow-lg transition bg-green-50 border-green-200 cursor-pointer h-full">
                                        <h3 className="text-lg font-bold text-green-900 group-hover:text-green-700">
                                            📑 Kelola Penagihan
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Cetak surat peringatan dan
                                            konfirmasi pembayaran.
                                        </p>
                                    </div>
                                </Link>
                            )}

                            <div className="border rounded-lg p-6 hover:shadow-lg transition bg-gray-50 border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">
                                    👤 Profil Saya
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Lihat detail akun dan kinerja regional Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
