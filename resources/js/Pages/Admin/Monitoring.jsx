import React from "react";
import { Head } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS Components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminMonitoring({ stats }) {
    // Konfigurasi Data Pie Chart
    const pieData = {
        labels: [
            "Lancar",
            "Aging 0",
            "Aging 1",
            "Aging 2",
            "Aging 3",
            "Aging 4",
        ],
        datasets: [
            {
                label: "# of Invoices",
                data: [
                    stats.aging_distribution["Lancar"],
                    stats.aging_distribution["Aging 0"],
                    stats.aging_distribution["Aging 1"],
                    stats.aging_distribution["Aging 2"],
                    stats.aging_distribution["Aging 3"],
                    stats.aging_distribution["Aging 4"],
                ],
                backgroundColor: [
                    "#10B981", // Lancar - Emerald
                    "#3B82F6", // Aging 0 - Blue
                    "#EAB308", // Aging 1 - Yellow
                    "#F97316", // Aging 2 - Orange
                    "#EF4444", // Aging 3 - Red
                    "#7F1D1D", // Aging 4 - Dark Red
                ],
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "right", // Legenda di sebelah kanan seperti desain
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                },
            },
        },
    };

    return (
        <SidebarLayout>
            <Head title="Monitoring Dashboard" />

            <div className="max-w-7xl mx-auto py-8 px-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-8">
                    Monitoring
                </h2>

                {/* --- 1. CARDS SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1: Total Users */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-2">
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats.total_users}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total Users
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Total Pelanggan */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white mb-2">
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
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats.total_customers}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total Pelanggan
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Collection Letters */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center text-white mb-2">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats.collection_letters}
                            </div>
                            <div className="text-sm text-gray-500">
                                Collection Letters
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Total Cash In */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white mb-2">
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                Rp{" "}
                                {new Intl.NumberFormat("id-ID", {
                                    notation: "compact",
                                    maximumFractionDigits: 1,
                                }).format(stats.total_cash_in)}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total Cash In (Bulan Ini)
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 2. CHARTS & LIST SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-blue-900 mb-4">
                            Distribusi Aging Pelanggan
                        </h3>
                        <div className="h-64 flex justify-center items-center">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>

                    {/* Right: Follow Up Status List */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-blue-900 mb-6">
                            Status Follow Up
                        </h3>

                        <div className="space-y-4">
                            {/* Sudah Follow Up */}
                            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-100">
                                <span className="text-green-800 font-medium">
                                    Sudah Follow Up
                                </span>
                                <span className="text-green-800 font-bold text-xl">
                                    {stats.follow_up_status.sudah}
                                </span>
                            </div>

                            {/* Belum Follow Up */}
                            <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <span className="text-yellow-800 font-medium">
                                    Belum Follow Up
                                </span>
                                <span className="text-yellow-800 font-bold text-xl">
                                    {stats.follow_up_status.belum}
                                </span>
                            </div>

                            {/* Total Pelanggan (Dalam Konteks Invoice Aktif) */}
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                                <span className="text-blue-800 font-medium">
                                    Total Invoice Aktif
                                </span>
                                <span className="text-blue-800 font-bold text-xl">
                                    {stats.follow_up_status.total}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
