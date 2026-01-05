import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Monitoring({ invoices, filters }) {
    const { flash } = usePage().props;

    // State untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // State untuk Search & Filter
    const { data, setData, get } = useForm({
        search: filters.search || "",
        aging_filter: filters.aging_filter || "all",
    });

    // Form Khusus untuk Submit Follow Up
    const {
        data: formData,
        setData: setFormData,
        post,
        processing,
        reset,
        errors,
    } = useForm({
        invoice_id: "",
        status_progress: "janji_bayar", // Default value
        catatan: "",
    });

    // Fungsi Search Otomatis
    const handleSearch = (e) => {
        e.preventDefault();
        get("/sales/monitoring", { preserveState: true });
    };

    // Buka Modal
    const openModal = (invoice) => {
        setSelectedInvoice(invoice);
        setFormData({
            ...formData,
            invoice_id: invoice.invoice_id,
        });
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setSelectedInvoice(null);
    };

    // Submit Follow Up
    const handleSubmitFollowUp = (e) => {
        e.preventDefault();
        post("/sales/follow-up", {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Head title="Monitoring Sales" />

            {/* Header */}
            <div className="bg-blue-900 text-white p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link
                        href="/dashboard"
                        className="font-bold hover:text-gray-300"
                    >
                        ← Kembali ke Dashboard
                    </Link>
                    <span>Monitoring Piutang</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-10 px-4">
                {/* Flash Message Sukses */}
                {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {flash.success}
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    {/* Toolbar: Search & Filter */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Daftar Tagihan Pelanggan
                        </h2>

                        <form onSubmit={handleSearch} className="flex gap-2">
                            <select
                                value={data.aging_filter}
                                onChange={(e) =>
                                    setData("aging_filter", e.target.value)
                                }
                                className="border-gray-300 rounded-md shadow-sm text-sm"
                            >
                                <option value="all">Semua Status</option>
                                <option value="0">Lancar</option>
                                <option value="1">Menunggak 1 Bulan</option>
                                <option value="2">Menunggak 2 Bulan</option>
                                <option value="3">Macet (>3 Bulan)</option>
                            </select>

                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                placeholder="Cari nama pelanggan..."
                                className="border-gray-300 rounded-md shadow-sm text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* TABEL UTAMA */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pelanggan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Tagihan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status Aging
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.invoice_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                {invoice.invoice_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="font-medium text-gray-900">
                                                    {
                                                        invoice.customer
                                                            .nama_pelanggan
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {
                                                        invoice.customer
                                                            .customer_id
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rp{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID"
                                                ).format(invoice.total_tagihan)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${
                                                    invoice.aging_category === 0
                                                        ? "bg-green-100 text-green-800"
                                                        : invoice.aging_category <
                                                          3
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                                >
                                                    {invoice.aging_category ===
                                                    0
                                                        ? "Lancar"
                                                        : `Menunggak ${invoice.aging_category} Bulan`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* LOGIKA TOMBOL (YANG TADI ANDA TANYAKAN) */}
                                                {invoice.follow_ups &&
                                                invoice.follow_ups.length >
                                                    0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-md text-xs font-bold cursor-not-allowed">
                                                            ✅ Sudah Follow Up
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(
                                                                invoice.follow_ups[
                                                                    invoice
                                                                        .follow_ups
                                                                        .length -
                                                                        1
                                                                ].created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            openModal(invoice)
                                                        }
                                                        className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition shadow-sm"
                                                    >
                                                        Follow Up
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-gray-500 italic"
                                        >
                                            Tidak ada data tagihan yang
                                            ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL FORM FOLLOW UP */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Follow Up: {selectedInvoice?.invoice_id}
                        </h3>

                        <form onSubmit={handleSubmitFollowUp}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status Progress
                                </label>
                                <select
                                    value={formData.status_progress}
                                    onChange={(e) =>
                                        setFormData(
                                            "status_progress",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="janji_bayar">
                                        Janji Bayar
                                    </option>
                                    <option value="minta_reschedule">
                                        Minta Reschedule
                                    </option>
                                    <option value="kendala_teknis">
                                        Kendala Teknis
                                    </option>
                                    <option value="tidak_ada_respon">
                                        Tidak Ada Respon
                                    </option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Catatan
                                </label>
                                <textarea
                                    value={formData.catatan}
                                    onChange={(e) =>
                                        setFormData("catatan", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    rows="3"
                                    placeholder="Tulis hasil percakapan..."
                                ></textarea>
                                {errors.catatan && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.catatan}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
