import React from "react";
// 1. PERBAIKAN: Tambahkan Link di sini
import { Head, useForm, router, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function Telecollection({ telecollections, filters }) {
    // State Filter
    const { data, setData } = useForm({
        search: filters.search || "",
        tipe_surat: filters.tipe_surat || "all",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const handleFilterChange = (key, value) => {
        setData(key, value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/sales/telecollection", data, { preserveState: true });
    };

    const handleReset = () => {
        setData({
            search: "",
            tipe_surat: "all",
            start_date: "",
            end_date: "",
        });
        router.get("/sales/telecollection", {}, { preserveState: false });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "verifikasi_user":
            case "verifikasi_pembayaran":
                return "bg-green-100 text-green-700 border-green-200";
            case "mapping_cash_in":
            case "surat_outstanding":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "surat_peringatan":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "surat_hutang":
            case "isolir":
            case "deaktivasi":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const formatStatus = (status) => {
        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <SidebarLayout>
            <Head title="Telecollection" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* FILTER SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                    >
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

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Status / Surat
                            </label>
                            <select
                                value={data.tipe_surat}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "tipe_surat",
                                        e.target.value
                                    )
                                }
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                            >
                                <option value="all">Semua Status</option>
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
                                <option value="isolir">Isolir</option>
                                <option value="deaktivasi">Deaktivasi</option>
                                <option value="pullout">Pullout</option>
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Cari Surat
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
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
                                    placeholder="Nama / Invoice ID..."
                                    className="w-full pl-10 border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                                    value={data.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 px-3 rounded-lg text-sm font-bold transition shadow-sm"
                            >
                                Cari
                            </button>
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

                {/* TABLE SECTION */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Invoice ID
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Nama Pelanggan
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Status Progress
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Nilai Tagihan
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Tanggal Update
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Updated By
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {telecollections.data.length > 0 ? (
                                    telecollections.data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-blue-50 transition duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                {item.invoice_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                                                {item.invoice?.customer
                                                    ?.nama_pelanggan || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                                        item.status_progress
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        item.status_progress
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                Rp{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID"
                                                ).format(
                                                    item.invoice
                                                        ?.total_tagihan || 0
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {item.sales_staff
                                                    ?.nama_lengkap || "System"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded-full hover:bg-blue-100 transition">
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
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-gray-400 italic bg-gray-50"
                                        >
                                            Data tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION SECTION - UPDATE SESUAI GAMBAR */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-100">
                    {/* Bagian Kiri: Info Data */}
                    <div className="text-sm text-gray-600 mb-4 md:mb-0">
                        Menampilkan{" "}
                        <span className="text-sm text-gray-600">
                            {telecollections.from || 0}
                        </span>{" "}
                        -{" "}
                        <span className="text-sm text-gray-600">
                            {telecollections.to || 0}
                        </span>{" "}
                        dari{" "}
                        <span className="text-sm text-gray-600">
                            {telecollections.total}
                        </span>{" "}
                        data
                    </div>

                    {/* Bagian Kanan: Tombol Navigasi */}
                    <div className="flex gap-1">
                        {telecollections.links.map((link, key) => {
                            // Render Link
                            return link.url === null ? (
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
                            );
                        })}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
