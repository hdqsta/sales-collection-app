import React from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

// TERIMA PROPS 'stats'
export default function SalesCashIn({ invoices, filters, stats }) {
    const { data, setData } = useForm({
        search: filters.search || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/cash-in", data, { preserveState: true });
    };

    // Helper Format Juta
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
            <Head title="Monitoring Pembayaran" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Riwayat Pembayaran Pelanggan
                </h2>

                {/* --- STATS WIDGETS (DITAMBAHKAN UNTUK SALES) --- */}
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
                {/* ----------------------------------------------- */}

                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
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
                            placeholder="Cari Invoice ID atau Nama Pelanggan..."
                            className="w-full pl-10 border-gray-300 rounded-lg text-sm focus:ring-blue-900 py-2"
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                        />
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                                        Invoice ID
                                    </th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                                        Pelanggan
                                    </th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                                        Nilai
                                    </th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoices.data.length > 0 ? (
                                    invoices.data.map((inv) => (
                                        <tr
                                            key={inv.invoice_id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    inv.created_at
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
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
                                                        </svg>{" "}
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
                                                        </svg>{" "}
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
                                                        </svg>{" "}
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-gray-400"
                                        >
                                            Data tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
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
