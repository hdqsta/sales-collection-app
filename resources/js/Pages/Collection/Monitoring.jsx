import React, { useState, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import Swal from "sweetalert2";

export default function CollectionMonitoring({ invoices, filters }) {
    const { flash } = usePage().props;

    // State Modal Letter
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // State Filter
    const { data, setData, get } = useForm({
        search: filters.search || "",
        aging_filter: filters.aging_filter || "all",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    // Form Khusus Surat Peringatan
    const {
        data: letterData,
        setData: setLetterData,
        post,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        invoice_id: "",
        tipe_surat: "",
        periode_mulai: "",
        periode_akhir: "",
        jatuh_tempo_surat: "",
        catatan: "",
    });

    // --- EFFECT & HANDLERS ---
    useEffect(() => {
        if (flash.success)
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                showConfirmButton: false,
                timer: 2000,
            });
        if (flash.error)
            Swal.fire({ icon: "error", title: "Gagal!", text: flash.error });
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        get("/sales/monitoring", { preserveState: true });
    };

    // -- LOGIKA MODAL CREATE LETTER --
    const openLetterModal = (invoice) => {
        clearErrors();
        setSelectedInvoice(invoice);
        setLetterData({
            invoice_id: invoice.invoice_id,
            tipe_surat: "",
            periode_mulai: "",
            periode_akhir: "",
            jatuh_tempo_surat: "",
            catatan: "",
        });
        setIsLetterModalOpen(true);
    };

    const closeLetterModal = () => {
        setIsLetterModalOpen(false);
        reset();
        setSelectedInvoice(null);
    };

    const handleSubmitLetter = (e) => {
        e.preventDefault();
        // Kirim ke route khusus collection letter (sesuai controller baru)
        post("/collection/letter", {
            onSuccess: () => {
                closeLetterModal();
                Swal.fire(
                    "Sukses",
                    "Surat berhasil dibuat dan tersimpan di database.",
                    "success"
                );
            },
            onError: (errors) => {
                console.log("Error:", errors);
                // Pesan error validasi akan muncul otomatis di bawah input form
            },
        });
    };

    // --- HELPER UNTUK WARNA AGING (SAMA SEPERTI SALES) ---
    const getAgingBadgeClass = (category) => {
        const catString = String(category);

        if (catString === "Lunas")
            return "bg-green-500 text-white border-green-600"; // Lunas: Hijau Solid

        if (catString === "Ditolak")
            return "bg-red-500 text-white border-red-600"; // Ditolak: Merah Solid

        if (catString === "Lancar")
            return "bg-emerald-100 text-emerald-700 border-emerald-200"; // Lancar: Hijau Muda

        if (catString === "0")
            return "bg-blue-100 text-blue-700 border-blue-200"; // Aging 0: Biru

        if (catString === "1")
            return "bg-yellow-100 text-yellow-700 border-yellow-200"; // Aging 1: Kuning

        if (catString === "2")
            return "bg-orange-100 text-orange-700 border-orange-200"; // Aging 2: Oranye

        if (catString === "3") return "bg-red-100 text-red-700 border-red-200"; // Aging 3: Merah Muda

        // Aging 4 atau lainnya (>120 hari)
        return "bg-red-900 text-white border-red-900";
    };

    return (
        <SidebarLayout>
            <Head title="Monitoring Collection" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Monitoring Collection
                </h2>

                {/* FILTER SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                    >
                        {/* Input Periode */}
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Periode
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg text-sm"
                                />
                                <span className="self-center">-</span>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        {/* Input Aging */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Aging
                            </label>
                            <select
                                value={data.aging_filter}
                                onChange={(e) =>
                                    setData("aging_filter", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">Semua Aging</option>
                                <option value="lancar">Lancar</option>
                                <option value="0">Aging 0</option>
                                <option value="1">Aging 1</option>
                                <option value="2">Aging 2</option>
                                <option value="3">Aging 3</option>
                                <option value="4">Aging 4</option>
                            </select>
                        </div>

                        {/* Input Search */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Cari Surat / Pelanggan
                            </label>
                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                placeholder="Nama / ID..."
                                className="w-full border-gray-300 rounded-lg text-sm pl-4"
                            />
                        </div>

                        {/* Tombol Cari */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-900 text-white py-2 rounded-lg font-bold text-sm"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABEL DATA */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="min-w-full">
                        <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Invoice ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    ID Pelanggan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Nama Pelanggan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Nilai Tagihan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Aging
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Tanggal Invoice
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase">
                                    Collection Letter
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {invoices.data.length > 0 ? (
                                invoices.data.map((invoice) => (
                                    <tr
                                        key={invoice.invoice_id}
                                        className="hover:bg-blue-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {invoice.invoice_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {invoice.customer?.customer_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                            {invoice.customer?.nama_pelanggan}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID"
                                            ).format(invoice.total_tagihan)}
                                        </td>

                                        {/* KOLOM AGING (Disesuaikan dengan Sales) */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${getAgingBadgeClass(
                                                    invoice.aging_category
                                                )}`}
                                            >
                                                {/* Tampilkan Text "Aging X" hanya jika levelnya angka (0-4) */}
                                                {[
                                                    "0",
                                                    "1",
                                                    "2",
                                                    "3",
                                                    "4",
                                                ].includes(
                                                    String(
                                                        invoice.aging_category
                                                    )
                                                )
                                                    ? `Aging ${invoice.aging_category}`
                                                    : invoice.aging_category}
                                            </span>
                                            {/* (Opsional) Tampilkan hari keterlambatan jika ada */}
                                            {invoice.days_overdue > 0 && (
                                                <div className="text-[10px] text-gray-400 mt-1 ml-1">
                                                    {invoice.days_overdue} hari
                                                </div>
                                            )}
                                        </td>

                                        {/* TANGGAL INVOICE (Dengan Jam) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                invoice.tanggal_invoice
                                            ).toLocaleString("id-ID", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                // hour: "2-digit", // Hapus komentar ini jika ingin menampilkan jam
                                                // minute: "2-digit",
                                            })}
                                            {/* Due Date Kecil */}
                                            <div className="text-[10px] text-gray-400 mt-1">
                                                Due:{" "}
                                                {new Date(
                                                    invoice.tanggal_jatuh_tempo
                                                ).toLocaleDateString("id-ID")}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {invoice.aging_category !==
                                                    "Lunas" &&
                                                invoice.aging_category !==
                                                    "Ditolak" ? (
                                                    <button
                                                        onClick={() =>
                                                            openLetterModal(
                                                                invoice
                                                            )
                                                        }
                                                        className="bg-[#0f2d52] hover:bg-blue-900 text-white px-6 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
                                                    >
                                                        Create
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500 font-medium text-sm">
                                                        Selesai
                                                    </span>
                                                )}
                                                {/* Icon Eye (View Detail - Opsional) */}
                                                <button className="text-blue-500 bg-blue-50 p-1.5 rounded-full">
                                                    <svg
                                                        className="w-4 h-4"
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
                                        className="text-center py-8 text-gray-400"
                                    >
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION SECTION */}
                {invoices.last_page > 1 && (
                    <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t mt-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-600 mb-4 md:mb-0">
                            Menampilkan{" "}
                            <span className="font-bold">
                                {invoices.from || 0}
                            </span>{" "}
                            -{" "}
                            <span className="font-bold">
                                {invoices.to || 0}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold">{invoices.total}</span>{" "}
                            data
                        </div>
                        <div className="flex gap-1">
                            {invoices.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveState
                                        className={`px-3 py-1.5 rounded-md text-sm transition ${
                                            link.active
                                                ? "bg-blue-900 text-white font-bold"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* MODAL CREATE LETTER */}
                {isLetterModalOpen && selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up">
                            {/* Header Modal */}
                            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">
                                    CREATE LETTER
                                </h3>
                                <button
                                    onClick={closeLetterModal}
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

                            {/* Konten Modal */}
                            <div className="p-8">
                                {/* Info Pelanggan */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 uppercase text-sm">
                                            {
                                                selectedInvoice.customer
                                                    ?.nama_pelanggan
                                            }
                                        </h4>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getAgingBadgeClass(
                                                selectedInvoice.aging_category
                                            )}`}
                                        >
                                            {["0", "1", "2", "3", "4"].includes(
                                                String(
                                                    selectedInvoice.aging_category
                                                )
                                            )
                                                ? `Aging ${selectedInvoice.aging_category}`
                                                : selectedInvoice.aging_category}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 text-xs text-gray-600 mt-2">
                                        <div>
                                            <span className="block font-semibold text-gray-400">
                                                ID Pelanggan
                                            </span>
                                            {
                                                selectedInvoice.customer
                                                    ?.customer_id
                                            }
                                        </div>
                                        <div>
                                            <span className="block font-semibold text-gray-400">
                                                Nomor Kontrak
                                            </span>
                                            {selectedInvoice.customer
                                                ?.nomor_kontrak || "-"}
                                        </div>
                                        <div>
                                            <span className="block font-semibold text-gray-400">
                                                Layanan
                                            </span>
                                            METRONET
                                        </div>
                                        <div>
                                            <span className="block font-semibold text-gray-400">
                                                Total Tagihan
                                            </span>
                                            <span className="font-bold text-gray-800">
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

                                <hr className="border-gray-100 mb-6" />

                                {/* Form Input */}
                                <form
                                    onSubmit={handleSubmitLetter}
                                    className="space-y-5"
                                >
                                    {/* Tipe Surat */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Tipe Surat
                                        </label>
                                        <select
                                            className={`w-full border rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900 ${
                                                errors.tipe_surat
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            value={letterData.tipe_surat}
                                            onChange={(e) =>
                                                setLetterData(
                                                    "tipe_surat",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                Pilih Tipe Surat...
                                            </option>
                                            <option value="Verifikasi User">
                                                Verifikasi User
                                            </option>
                                            <option value="Surat Peringatan 1">
                                                Surat Peringatan 1
                                            </option>
                                            <option value="Surat Peringatan 2">
                                                Surat Peringatan 2
                                            </option>
                                            <option value="Surat Peringatan 3">
                                                Surat Peringatan 3
                                            </option>
                                            <option value="Surat Isolir">
                                                Surat Isolir
                                            </option>
                                            <option value="Surat Pencabutan">
                                                Surat Pencabutan
                                            </option>
                                        </select>
                                        {errors.tipe_surat && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Tipe surat wajib dipilih.
                                            </p>
                                        )}
                                    </div>

                                    {/* Periode Tagihan */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Periode Tagihan
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="date"
                                                className="w-full border-gray-300 rounded-lg text-sm"
                                                value={letterData.periode_mulai}
                                                onChange={(e) =>
                                                    setLetterData(
                                                        "periode_mulai",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <input
                                                type="date"
                                                className="w-full border-gray-300 rounded-lg text-sm"
                                                value={letterData.periode_akhir}
                                                onChange={(e) =>
                                                    setLetterData(
                                                        "periode_akhir",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Jatuh Tempo */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Jatuh Tempo Pembayaran
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border-gray-300 rounded-lg text-sm"
                                            value={letterData.jatuh_tempo_surat}
                                            onChange={(e) =>
                                                setLetterData(
                                                    "jatuh_tempo_surat",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Catatan */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Catatan
                                        </label>
                                        <textarea
                                            className="w-full border-gray-300 rounded-lg text-sm"
                                            rows="3"
                                            placeholder="Catatan tambahan..."
                                            value={letterData.catatan}
                                            onChange={(e) =>
                                                setLetterData(
                                                    "catatan",
                                                    e.target.value
                                                )
                                            }
                                        ></textarea>
                                    </div>

                                    {/* Tombol Aksi */}
                                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                                        <button
                                            type="button"
                                            onClick={closeLetterModal}
                                            className="px-6 py-2 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50 font-bold text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 rounded-lg text-white bg-blue-900 hover:bg-blue-800 font-bold text-sm flex items-center gap-2"
                                        >
                                            {processing
                                                ? "Memproses..."
                                                : "Buat Surat"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
