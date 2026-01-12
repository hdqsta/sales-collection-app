import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function LetterIndex({ letters, filters }) {
    // Setup Filter Form
    const { data, setData, get } = useForm({
        search: filters.search || "",
        tipe_surat: filters.tipe_surat || "all",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get("/collection/letters", { preserveState: true });
    };

    // Helper: Format Tipe Surat (Enum DB -> Tampilan)
    const formatTipeSurat = (type) => {
        if (type === "peringatan") return "Surat Peringatan";
        if (type === "konfirmasi_outstanding") return "Surat Outstanding";
        if (type === "surat_hutang") return "Surat Hutang";
        // TAMBAHAN BARU
        if (type === "surat_isolir") return "Surat Isolir";
        if (type === "surat_pencabutan") return "Surat Pencabutan";
        return type;
    };
    // Helper: Warna Badge Tipe Surat (Sesuai Gambar)
    const getBadgeClass = (type) => {
        if (type === "peringatan")
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (type === "konfirmasi_outstanding")
            return "bg-blue-100 text-blue-800 border-blue-200";
        if (type === "surat_hutang")
            return "bg-red-100 text-red-800 border-red-200";
        // TAMBAHAN BARU (Warna Isolir: Orange/Gelap, Pencabutan: Hitam/Abu)
        if (type === "surat_isolir")
            return "bg-orange-100 text-orange-800 border-orange-200";
        if (type === "surat_pencabutan")
            return "bg-gray-800 text-white border-gray-600";

        return "bg-gray-100 text-gray-800";
    };
    return (
        <SidebarLayout>
            <Head title="Collection Letters" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-900">
                        Collection Letter
                    </h2>
                </div>

                {/* --- FILTER SECTION --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                    >
                        {/* Periode */}
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

                        {/* Tipe Surat */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Tipe Surat
                            </label>
                            <select
                                value={data.tipe_surat}
                                onChange={(e) =>
                                    setData("tipe_surat", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">Semua Surat</option>
                                <option value="peringatan">
                                    Surat Peringatan
                                </option>
                                <option value="konfirmasi_outstanding">
                                    Surat Outstanding
                                </option>
                                <option value="surat_hutang">
                                    Surat Hutang
                                </option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Cari Surat
                            </label>
                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                placeholder="Nama / No Surat..."
                                className="w-full border-gray-300 rounded-lg text-sm pl-4"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-800 transition"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="min-w-full">
                        <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Nomor Surat
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Nama Pelanggan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Tipe Surat
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Nilai Tagihan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Jatuh Tempo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase">
                                    Tanggal Dibuat
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {letters.data.length > 0 ? (
                                letters.data.map((letter) => (
                                    <tr
                                        key={letter.letter_id}
                                        className="hover:bg-blue-50 transition"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {letter.no_surat}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                            {letter.invoice?.customer
                                                ?.nama_pelanggan || "N/A"}
                                            <div className="text-xs text-gray-400 font-normal">
                                                {
                                                    letter.invoice?.customer
                                                        ?.customer_id
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeClass(
                                                    letter.tipe_surat
                                                )}`}
                                            >
                                                {formatTipeSurat(
                                                    letter.tipe_surat
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID"
                                            ).format(letter.nilai_tagihan)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(
                                                letter.tanggal_jatuh_tempo
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(
                                                letter.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                {/* View Icon */}
                                                <button className="text-blue-500 hover:text-blue-700">
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
                                                {/* Download Icon */}
                                                <button className="text-green-500 hover:text-green-700">
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
                                        className="text-center py-8 text-gray-400"
                                    >
                                        Belum ada surat yang dibuat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {letters.links && letters.links.length > 3 && (
                    <div className="bg-white px-6 py-4 flex items-center justify-between border-t mt-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex gap-1">
                            {letters.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1.5 rounded-md text-sm ${
                                            link.active
                                                ? "bg-blue-900 text-white"
                                                : "bg-white border text-gray-600 hover:bg-gray-50"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-400 border"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
