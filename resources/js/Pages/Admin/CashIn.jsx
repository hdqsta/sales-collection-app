import React from "react";
// 1. IMPORT Link & Swal
import { Head, useForm, router, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AdminCashIn({ invoices, filters, stats, auth_user }) {
    const { data, setData } = useForm({
        search: filters.search || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/cash-in", data, { preserveState: true });
    };

    // --- AKSI ADMIN DENGAN SWEETALERT ---

    // 1. Fungsi Konfirmasi (Hijau)
    const confirmPayment = (invoiceId) => {
        Swal.fire({
            title: "Konfirmasi Pembayaran?",
            text: `Anda akan memverifikasi pembayaran untuk Invoice ${invoiceId}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#16a34a", // Green-600
            cancelButtonColor: "#6b7280", // Gray-500
            confirmButtonText: "Ya, Konfirmasi!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/cash-in/${invoiceId}/confirm`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire(
                                "Berhasil!",
                                "Pembayaran telah dikonfirmasi.",
                                "success"
                            );
                        },
                    }
                );
            }
        });
    };

    // 2. Fungsi Reject (Merah)
    const rejectPayment = (invoiceId) => {
        Swal.fire({
            title: "Tolak Pembayaran?",
            text: `Yakin ingin MENOLAK pembayaran Invoice ${invoiceId}? Aksi ini tidak dapat dibatalkan.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626", // Red-600
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Tolak!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/cash-in/${invoiceId}/reject`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire(
                                "Ditolak!",
                                "Pembayaran telah ditolak.",
                                "success"
                            );
                        },
                    }
                );
            }
        });
    };

    // --- FORMATTERS ---
    const formatJuta = (number) => {
        if (number >= 1000000000)
            return `Rp ${(number / 1000000000).toFixed(1)}M`;
        if (number >= 1000000) return `Rp ${(number / 1000000).toFixed(0)}jt`;
        return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
    };

    const formatRupiah = (number) =>
        new Intl.NumberFormat("id-ID").format(number);

    return (
        <SidebarLayout>
            <Head title="Cash In Management" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Cash In Management
                </h2>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Pembayaran */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">
                            Total Pembayaran
                        </p>
                        <h3 className="text-3xl font-bold text-gray-800">
                            {formatJuta(stats.total_cash_in)}
                        </h3>
                        <p className=" text-xs text-gray-400 mt-1">
                            {stats.total_count} Pembayaran
                        </p>
                    </div>
                    {/* Pending */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">Pending</p>
                        <h3 className="text-3xl font-bold text-orange-500">
                            {formatJuta(stats.pending_amount)}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.pending_count} pembayaran
                        </p>
                    </div>

                    {/* Confirmed */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">Confirmed</p>
                        <h3 className="text-3xl font-bold text-green-500">
                            {formatJuta(stats.confirmed_amount)}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.confirmed_count} pembayaran
                        </p>
                    </div>
                </div>

                {/* --- SEARCH --- */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
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
                        </span>
                        <input
                            type="text"
                            placeholder="Cari pembayaran..."
                            className="w-full pl-10 border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-blue-900 py-3"
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                        />
                    </form>
                </div>

                {/* --- TABLE --- */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Tanggal & Waktu
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Invoice ID
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Nama Pelanggan
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Metode
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoices.data.length > 0 ? (
                                    invoices.data.map((inv, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(
                                                    inv.created_at
                                                ).toLocaleString("id-ID", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                {inv.invoice_id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {inv.customer?.nama_pelanggan ||
                                                    "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                                                Rp{" "}
                                                {formatRupiah(
                                                    inv.total_tagihan
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                Transfer Bank
                                            </td>

                                            {/* STATUS BADGES */}
                                            <td className="px-6 py-4 text-center">
                                                {inv.status_pembayaran ===
                                                "paid" ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="3"
                                                                d="M5 13l4 4L19 7"
                                                            ></path>
                                                        </svg>
                                                        Confirmed
                                                    </span>
                                                ) : inv.status_pembayaran ===
                                                  "rejected" ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="3"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            ></path>
                                                        </svg>
                                                        Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 gap-1 border border-gray-200">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            ></path>
                                                        </svg>
                                                        Pending
                                                    </span>
                                                )}
                                            </td>

                                            {/* ACTION BUTTONS */}
                                            <td className="px-6 py-4 text-center">
                                                {inv.status_pembayaran ===
                                                "unpaid" ? (
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                confirmPayment(
                                                                    inv.invoice_id
                                                                )
                                                            }
                                                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition shadow-sm"
                                                        >
                                                            Konfirmasi
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                rejectPayment(
                                                                    inv.invoice_id
                                                                )
                                                            }
                                                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition shadow-sm"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-left pl-4">
                                                        <p className="text-[10px] text-gray-400">
                                                            By: {auth_user.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">
                                                            {new Date().toLocaleDateString(
                                                                "id-ID"
                                                            )}{" "}
                                                            {new Date().getHours()}
                                                            :00
                                                        </p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-gray-400 italic"
                                        >
                                            Data tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- PAGINATION --- */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-4 md:mb-0">
                        Menampilkan{" "}
                        <span className="font-bold text-gray-900">
                            {invoices.from || 0}
                        </span>{" "}
                        -{" "}
                        <span className="font-bold text-gray-900">
                            {invoices.to || 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-gray-900">
                            {invoices.total}
                        </span>{" "}
                        data
                    </div>
                    <div className="flex gap-1">
                        {invoices.links.map((link, key) =>
                            link.url === null ? (
                                <div
                                    key={key}
                                    className="px-3 py-1.5 text-sm text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <Link
                                    key={key}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                                        link.active
                                            ? "bg-blue-900 text-white border-blue-900 shadow-sm font-medium"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-900"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    preserveScroll
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
