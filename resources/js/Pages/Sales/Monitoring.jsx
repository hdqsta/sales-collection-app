import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react"; // <--- Tambahkan router
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function Monitoring({ invoices, filters }) {
    const { flash } = usePage().props;

    // State Modal Follow Up (Input)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // State Modal History (Lihat Detail)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyInvoice, setHistoryInvoice] = useState(null);

    // State Filter & Search
    const { data, setData, get } = useForm({
        search: filters.search || "",
        aging_filter: filters.aging_filter || "all",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    // Auto-Submit saat filter berubah (Debounce opsional, tapi ini direct get)
    const handleFilterChange = (key, value) => {
        setData(key, value);
    };

    // Eksekusi Filter saat tombol "Cari" atau Enter ditekan
    const handleSearch = (e) => {
        e.preventDefault();
        get("/sales/monitoring", { preserveState: true });
    };
    // Reset Filter: Bersihkan form dan reload halaman tanpa query params
    const handleReset = () => {
        // 1. Reset state form lokal
        setData({
            search: "",
            aging_filter: "all",
            start_date: "",
            end_date: "",
        });

        // 2. Paksa reload ke URL dasar tanpa query string (membersihkan URL)
        router.get(
            "/sales/monitoring",
            {},
            {
                preserveState: false, // Penting: Jangan simpan state lama
                preserveScroll: true, // Opsional: Agar tidak scroll ke paling atas
            }
        );
    };

    // Form Khusus Submit Follow Up
    const {
        data: formData,
        setData: setFormData,
        post,
        processing,
        reset,
        errors,
    } = useForm({
        invoice_id: "",
        status_progress: "",
        catatan: "",
    });

    // -- LOGIKA MODAL --
    const openModal = (invoice) => {
        setSelectedInvoice(invoice);
        setFormData({ ...formData, invoice_id: invoice.invoice_id });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setSelectedInvoice(null);
    };

    const openHistory = (invoice) => {
        setHistoryInvoice(invoice);
        setIsHistoryOpen(true);
    };

    const closeHistory = () => {
        setIsHistoryOpen(false);
        setHistoryInvoice(null);
    };

    const handleSubmitFollowUp = (e) => {
        e.preventDefault();
        post("/sales/follow-up", {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <SidebarLayout>
            <Head title="Monitoring Sales" />

            {/* Navbar Sederhana */}
            {/* <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_PLN.svg"
                        alt="PLN Logo"
                        className="h-10"
                    />
                    <div className="border-l pl-4 border-gray-300">
                        <h1 className="text-xl font-bold text-blue-900">
                            Monitoring
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        Halo, Sales Staff
                    </span>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-red-600 font-bold text-sm border border-red-200 px-4 py-1 rounded hover:bg-red-50"
                    >
                        Logout
                    </Link>
                </div>
            </nav> */}

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Flash Message */}
                {flash.success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                        {flash.success}
                    </div>
                )}

                {/* FILTER SECTION (Sesuai Desain) */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                    >
                        {/* Periode Date Picker */}
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Periode
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "start_date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                />
                                <span className="self-center text-gray-400">
                                    -
                                </span>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "end_date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                />
                            </div>
                        </div>

                        {/* Aging Filter */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Aging
                            </label>
                            <select
                                value={data.aging_filter}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "aging_filter",
                                        e.target.value
                                    )
                                }
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                            >
                                <option value="all">Semua Aging</option>
                                <option value="lancar">
                                    Lancar (Belum Jatuh Tempo)
                                </option>
                                <option value="0">Aging 0 (0 - 30 Hari)</option>
                                <option value="1">
                                    Aging 1 (30 - 60 Hari)
                                </option>
                                <option value="2">
                                    Aging 2 (60 - 90 Hari)
                                </option>
                                <option value="3">
                                    Aging 3 (90 - 120 Hari)
                                </option>
                                <option value="4">
                                    Aging 4 (&gt; 120 Hari)
                                </option>
                            </select>
                        </div>
                        {/* Search Bar */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Cari Pelanggan
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nama / ID..."
                                    className="w-full pl-10 border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Action (DITAMBAH JADI col-span-2) */}
                        <div className="md:col-span-2 flex gap-2">
                            {/* Tombol Cari */}
                            <button
                                type="submit"
                                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 px-3 rounded-lg text-sm font-bold transition shadow-sm"
                            >
                                Cari
                            </button>

                            {/* Tombol Reset (BARU) */}
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 py-2 px-3 rounded-lg text-sm font-bold transition shadow-sm"
                                title="Reset Filter"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="space-y-6">
                    {/* TABEL UTAMA */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-white border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Invoice ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            ID Pelanggan
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Nama Pelanggan
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Nilai Tagihan
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Aging
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Tanggal & Waktu
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Follow up
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoices.data &&
                                    invoices.data.length > 0 ? (
                                        invoices.data.map((invoice) => (
                                            <tr
                                                key={invoice.invoice_id}
                                                className="hover:bg-blue-50 transition duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    {invoice.invoice_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {
                                                        invoice.customer
                                                            .customer_id
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                                                    {
                                                        invoice.customer
                                                            .nama_pelanggan
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                                    Rp{" "}
                                                    {new Intl.NumberFormat(
                                                        "id-ID"
                                                    ).format(
                                                        invoice.total_tagihan
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                            invoice.aging_category ===
                                                            "Lancar"
                                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200" // Hijau (Aman)
                                                                : invoice.aging_category ===
                                                                  0
                                                                ? "bg-blue-100 text-blue-700 border-blue-200" // Biru (Baru Lewat)
                                                                : invoice.aging_category ===
                                                                  1
                                                                ? "bg-yellow-100 text-yellow-700 border-yellow-200" // Kuning (Waspada)
                                                                : invoice.aging_category ===
                                                                  2
                                                                ? "bg-orange-100 text-orange-700 border-orange-200" // Oranye (Signifikan)
                                                                : invoice.aging_category ===
                                                                  3
                                                                ? "bg-red-100 text-red-700 border-red-200" // Merah (Risiko Tinggi)
                                                                : "bg-red-900 text-white border-red-900" // Merah Gelap (Aging 4 - Bahaya)
                                                        }`}
                                                    >
                                                        {invoice.aging_category ===
                                                        "Lancar"
                                                            ? "Lancar"
                                                            : `Aging ${invoice.aging_category}`}
                                                    </span>
                                                    {/* Opsional: Tampilkan hari terlambat */}
                                                    {invoice.days_overdue >
                                                        0 && (
                                                        <div className="text-[10px] text-gray-400 mt-1 text-center">
                                                            {
                                                                invoice.days_overdue
                                                            }{" "}
                                                            hari
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        invoice.created_at
                                                    ).toLocaleString("id-ID", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {invoice.follow_ups &&
                                                        invoice.follow_ups
                                                            .length > 0 ? (
                                                            <span className="text-gray-500 text-sm font-medium px-4 py-1.5 bg-gray-100 rounded-lg">
                                                                Selesai
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    openModal(
                                                                        invoice
                                                                    )
                                                                }
                                                                className="bg-blue-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-800 transition shadow-sm"
                                                            >
                                                                Follow Up
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                openHistory(
                                                                    invoice
                                                                )
                                                            }
                                                            className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded-full hover:bg-blue-100 transition"
                                                            title="Lihat Detail History"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                ></path>
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                ></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-10 text-center text-gray-400 italic bg-gray-50"
                                            >
                                                Data tidak ditemukan untuk
                                                filter ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Pagination */}
                    {invoices.last_page > 1 && (
                        <div className="bg-white px-6 py-4 flex items-center justify-between border-t">
                            <div className="text-sm text-gray-600">
                                Menampilkan {invoices.from} - {invoices.to} dari{" "}
                                {invoices.total} data
                            </div>
                            <div className="flex gap-2">
                                {invoices.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveState
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? "bg-blue-900 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- MODAL 1: FORM INPUT FOLLOW UP --- */}
                {/* MODAL FOLLOW UP - REVISI SESUAI DESAIN */}
                {isModalOpen && selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all scale-100">
                            {/* 1. Header: Judul */}
                            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                                    FOLLOW UP
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                </button>
                            </div>

                            {/* 2. Informasi Pelanggan (Layout Baru Sesuai Desain) */}
                            <div className="px-8 py-6 bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="font-bold text-gray-900 text-lg uppercase tracking-wide">
                                        {
                                            selectedInvoice.customer
                                                .nama_pelanggan
                                        }
                                    </h4>
                                    <span
                                        className={`px-4 py-1 rounded-full text-xs font-bold border 
                                    ${
                                        selectedInvoice.aging_category === 0
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                    }`}
                                    >
                                        Aging {selectedInvoice.aging_category}{" "}
                                        Bulan
                                    </span>
                                </div>

                                {/* GRID INFORMASI 4 KOLOM (ID, Kontrak, Layanan, Tagihan) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-b border-gray-100 pb-6">
                                    <div>
                                        <span className="block text-gray-400 text-xs font-semibold mb-1">
                                            ID Pelanggan
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            {
                                                selectedInvoice.customer
                                                    .customer_id
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs font-semibold mb-1">
                                            Nomor Kontrak
                                        </span>
                                        {/* Pastikan kolom 'nomor_kontrak' ada di tabel Customer, atau gunakan placeholder jika belum ada */}
                                        <span className="font-medium text-gray-700">
                                            {selectedInvoice.customer
                                                .nomor_kontrak ||
                                                "0228334/P1/10205"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs font-semibold mb-1">
                                            Layanan
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            METRONET
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs font-semibold mb-1">
                                            Total Tagihan
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID"
                                            ).format(
                                                selectedInvoice.total_tagihan
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Form Input */}
                            <form
                                onSubmit={handleSubmitFollowUp}
                                className="px-8 pb-8 pt-2"
                            >
                                <div className="space-y-6">
                                    {/* Status Progress (Update Status) */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Update Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.status_progress}
                                                onChange={(e) =>
                                                    setFormData(
                                                        "status_progress",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 appearance-none bg-white transition text-gray-700"
                                            >
                                                {/* OPSI BARU SESUAI GAMBAR */}
                                                <option value="" disabled>
                                                    Pilih Status...
                                                </option>
                                                <option value="verifikasi_user">
                                                    Verifikasi User
                                                </option>
                                                <option value="verifikasi_pembayaran">
                                                    Verifikasi Pembayaran
                                                </option>
                                                <option value="mapping_cash_in">
                                                    Mapping Cash-in
                                                </option>
                                                <option value="surat_peringatan">
                                                    Surat Peringatan / SKO
                                                </option>
                                                <option value="surat_hutang">
                                                    Surat Hutang
                                                </option>
                                                <option value="isolir">
                                                    Isolir
                                                </option>
                                                <option value="deaktivasi">
                                                    Deaktivasi
                                                </option>
                                                <option value="pullout">
                                                    Pullout
                                                </option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-blue-900">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Catatan */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Catatan
                                        </label>
                                        <textarea
                                            value={formData.catatan}
                                            onChange={(e) =>
                                                setFormData(
                                                    "catatan",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm transition placeholder-gray-400"
                                            rows="4"
                                            placeholder="Sudah melakukan verifikasi user..."
                                        ></textarea>
                                        {errors.catatan && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.catatan}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="flex justify-end items-center gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2.5 rounded-full text-gray-600 border border-gray-300 hover:bg-gray-50 font-medium transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-2.5 rounded-full text-white bg-blue-900 hover:bg-blue-800 font-bold shadow-lg shadow-blue-900/20 transition transform active:scale-95"
                                    >
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MODAL 2: HISTORY (MATA) --- */}
                {isHistoryOpen && historyInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
                            <div className="px-8 py-5 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Riwayat Follow Up
                                </h3>
                                <button
                                    onClick={closeHistory}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-blue-900">
                                            {
                                                historyInvoice.customer
                                                    .nama_pelanggan
                                            }
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            ID:{" "}
                                            {
                                                historyInvoice.customer
                                                    .customer_id
                                            }
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Total Tagihan
                                        </p>
                                        <p className="font-bold text-gray-800">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID"
                                            ).format(
                                                historyInvoice.total_tagihan
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* LIST HISTORY */}
                                <div className="space-y-4">
                                    {historyInvoice.follow_ups &&
                                    historyInvoice.follow_ups.length > 0 ? (
                                        historyInvoice.follow_ups.map(
                                            (fu, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">
                                                            {fu.status_progress.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(
                                                                fu.created_at
                                                            ).toLocaleString(
                                                                "id-ID"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        {fu.catatan}
                                                    </p>
                                                    <div className="pt-2 border-t border-gray-200 mt-2 flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">
                                                            {fu.sales_staff
                                                                ? fu.sales_staff.nama_lengkap.charAt(
                                                                      0
                                                                  )
                                                                : "?"}
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            Dikerjakan oleh:{" "}
                                                            <span className="font-bold text-gray-700">
                                                                {fu.sales_staff
                                                                    ? fu
                                                                          .sales_staff
                                                                          .nama_lengkap
                                                                    : "Unknown User"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                            Belum ada riwayat follow up untuk
                                            tagihan ini.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-8 py-4 bg-gray-50 border-t flex justify-end">
                                <button
                                    onClick={closeHistory}
                                    className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
