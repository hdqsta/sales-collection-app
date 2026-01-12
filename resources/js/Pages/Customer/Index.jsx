import React, { useState } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function CustomerIndex({ customers, filters }) {
    // State untuk Accordion (Menyimpan ID customer yang sedang terbuka)
    const [expandedId, setExpandedId] = useState(null);

    const { data, setData } = useForm({
        search: filters.search || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/customer-info", data, { preserveState: true });
    };

    // Fungsi Toggle Accordion
    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null); // Tutup jika sudah terbuka
        } else {
            setExpandedId(id); // Buka yang baru
        }
    };

    return (
        <SidebarLayout>
            <Head title="Customer Information" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Customer Information
                </h2>

                {/* FILTER SECTION */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Periode (Visual Saja sesuai gambar) */}
                    <div className="relative w-full md:w-1/3">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Periode"
                            className="w-full pl-10 border-gray-300 rounded-lg text-sm focus:ring-blue-900 text-gray-500"
                            disabled
                        />
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full md:w-2/3"
                    >
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
                            placeholder="Cari nama pelanggan, ID pelanggan, atau nomor kontrak..."
                            className="w-full pl-10 border-gray-300 rounded-lg text-sm focus:ring-blue-900"
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                        />
                    </form>
                </div>

                {/* LIST PELANGGAN (ACCORDION) */}
                <div className="space-y-4">
                    {customers.data && customers.data.length > 0 ? (
                        customers.data.map((cust) => (
                            <div
                                key={cust.customer_id}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* HEADER (Selalu Tampil) */}
                                <div
                                    onClick={() =>
                                        toggleExpand(cust.customer_id)
                                    }
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon Kotak Biru */}
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                ></path>
                                            </svg>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 uppercase">
                                                {cust.nama_pelanggan}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                ID: {cust.customer_id} |{" "}
                                                {cust.regional ||
                                                    "Regional Tidak Diketahui"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden md:block">
                                            <span className="text-xs text-gray-500">
                                                Sales:{" "}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-700 uppercase">
                                                {cust.sales_staff
                                                    ?.nama_lengkap || "-"}
                                            </span>
                                        </div>
                                        {/* Panah Chevron */}
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                                expandedId === cust.customer_id
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
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

                                {/* DETAIL BODY (Tampil jika Expanded) */}
                                {expandedId === cust.customer_id && (
                                    <div className="px-6 pb-6 pt-2 bg-[#F9FAFB] border-t border-gray-100">
                                        <h4 className="text-xs font-bold text-blue-900 mb-4 uppercase">
                                            Detail Informasi
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                                            {/* Kolom 1 */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    ID Pelanggan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.customer_id}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    ID Perusahaan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.id_perusahaan || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Telepon
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.no_telepon || "-"}
                                                </p>
                                            </div>

                                            {/* Kolom 2 */}
                                            <div className="md:col-span-2">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Nama Pelanggan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.nama_pelanggan}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Nomor Kontrak
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.nomor_kontrak || "-"}
                                                </p>
                                            </div>

                                            {/* Kolom 3 (Alamat Full Width) */}
                                            <div className="md:col-span-3">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Alamat
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.alamat || "-"}
                                                </p>
                                            </div>

                                            {/* Baris Baru - Contact Info */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Email
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.email || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    PIC Name
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.pic_name || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    PIC Phone
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {cust.pic_phone || "-"}
                                                </p>
                                            </div>

                                            {/* Baris Baru - Info Wilayah */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Regional
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 uppercase">
                                                    {cust.regional || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Kantor Perwakilan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 uppercase">
                                                    {cust.kantor_perwakilan ||
                                                        "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Nomor Virtual Account
                                                </p>
                                                <p className="text-sm font-bold text-gray-800">
                                                    {cust.nomor_va || "-"}
                                                </p>
                                            </div>

                                            {/* Payment Method & Sales */}
                                            <div className="md:col-span-2">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Layanan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 uppercase">
                                                    {cust.layanan ||
                                                        "INTERNET BROADBAND"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Sales Staff
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 uppercase">
                                                    {cust.sales_staff
                                                        ?.nama_lengkap || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 bg-white rounded-lg border border-gray-100">
                            Data pelanggan tidak ditemukan.
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {customers.last_page > 1 && (
                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center pt-4">
                        <div className="text-sm text-gray-600 mb-4 md:mb-0">
                            Menampilkan{" "}
                            <span className="font-bold text-gray-900">
                                {customers.from || 0}
                            </span>{" "}
                            -{" "}
                            <span className="font-bold text-gray-900">
                                {customers.to || 0}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold text-gray-900">
                                {customers.total}
                            </span>{" "}
                            data
                        </div>
                        <div className="flex gap-1">
                            {customers.links.map((link, key) =>
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
                )}
            </div>
        </SidebarLayout>
    );
}
