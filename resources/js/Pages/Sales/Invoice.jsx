import React from "react";
// 1. IMPORT Link AGAR PAGINATION BERFUNGSI
import { Head, useForm, router, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function Invoice({ invoices, filters }) {
    // State Filter
    const { data, setData } = useForm({
        search: filters.search || "",
        status: filters.status || "all",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const handleFilterChange = (key, value) => {
        setData(key, value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/sales/invoice", data, { preserveState: true });
    };

    const handleReset = () => {
        setData({ search: "", status: "all", start_date: "", end_date: "" });
        router.get("/sales/invoice", {}, { preserveState: false });
    };

    // --- LOGIKA DUMMY PDF ---
    const handleDownloadPdf = (invoiceId) => {
        const content = `DUMMY INVOICE\n\nInvoice ID: ${invoiceId}\nDate: ${new Date().toISOString()}\n\nIni adalah file simulasi PDF.`;
        const blob = new Blob([content], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Invoice-${invoiceId}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Helper Status Badge
    const getStatusBadge = (status) => {
        if (status === "paid") {
            return (
                <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold w-fit">
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
            );
        } else if (status === "rejected") {
            return (
                <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold w-fit">
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
            );
        } else {
            return (
                <span className="flex items-center gap-1 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold w-fit">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Pending
                </span>
            );
        }
    };

    return (
        <SidebarLayout>
            <Head title="Invoice" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header Title */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-blue-900">
                        Invoice
                    </h2>
                </div>

                {/* FILTER SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                    >
                        {/* Periode */}
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Periode
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "start_date",
                                            e.target.value
                                        )
                                    }
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "end_date",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Status Pembayaran
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                            >
                                <option value="all">Semua Status</option>
                                <option value="unpaid">Pending (Unpaid)</option>
                                <option value="paid">Confirmed (Paid)</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Cari Invoice
                            </label>
                            <input
                                type="text"
                                placeholder="Cari Invoice ID / Nama..."
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                                value={data.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                            />
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-bold transition shadow-sm"
                            >
                                Cari
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 py-2 px-3 rounded-lg text-sm font-bold transition shadow-sm"
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

                {/* TABLE SECTION */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
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
                                        ID Pelanggan
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Nama Pelanggan
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoices.data.length > 0 ? (
                                    invoices.data.map((invoice, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-blue-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-600">
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
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {invoice.invoice_id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {invoice.customer_id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                                                {invoice.customer
                                                    ?.nama_pelanggan || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                Rp{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID"
                                                ).format(invoice.total_tagihan)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(
                                                    invoice.status_pembayaran
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Lihat"
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
                                                    <button
                                                        onClick={() =>
                                                            handleDownloadPdf(
                                                                invoice.invoice_id
                                                            )
                                                        }
                                                        className="text-green-500 hover:text-green-700"
                                                        title="Download Invoice"
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
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
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
                                            className="px-6 py-10 text-center text-gray-400 italic"
                                        >
                                            Data invoice tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. PAGINATION SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-4 md:mb-0">
                        Menampilkan{" "}
                        <span className="text-sm text-gray-600">
                            {invoices.from || 0}
                        </span>{" "}
                        -{" "}
                        <span className="text-sm text-gray-600">
                            {invoices.to || 0}
                        </span>{" "}
                        dari{" "}
                        <span className="text-sm text-gray-600">
                            {invoices.total}
                        </span>{" "}
                        data
                    </div>
                    <div className="flex gap-1">
                        {invoices.links.map((link, key) =>
                            link.url === null ? (
                                <div
                                    key={key}
                                    className="px-3 py-1.5 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed"
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
