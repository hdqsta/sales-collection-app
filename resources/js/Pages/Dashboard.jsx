import SidebarLayout from "@/Layouts/SidebarLayout";
import { Head } from "@inertiajs/react";

// Tambahkan prop 'statistik' di sini untuk menangkap data dari Controller
export default function Dashboard({ auth, statistik }) {
    return (
        <SidebarLayout>
            <Head title="Dashboard" />

            {/* Header Welcome */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6 border-l-4 border-blue-900">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Selamat Datang, {auth.user.name}!
                </h1>
                <p className="text-gray-600 text-sm">
                    Anda login sebagai{" "}
                    <span className="font-bold text-blue-600 uppercase">
                        {auth.user.role}
                    </span>
                    . Pantau kinerja dan tagihan pelanggan Anda di sini.
                </p>
            </div>

            {/* WIDGET STATISTIK DINAMIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Widget 1: Total Tagihan Aktif */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                        Total Tagihan Aktif
                    </div>
                    <div className="text-3xl font-extrabold text-gray-800">
                        {statistik.tagihan_aktif}{" "}
                        <span className="text-sm font-medium text-gray-400">
                            Invoice
                        </span>
                    </div>
                </div>

                {/* Widget 2: Perlu Follow Up */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                        Perlu Follow Up
                    </div>
                    <div className="text-3xl font-extrabold text-gray-800">
                        {statistik.perlu_follow_up}{" "}
                        <span className="text-sm font-medium text-gray-400">
                            Pelanggan
                        </span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-2 font-medium">
                        *Belum ada riwayat follow up
                    </p>
                </div>

                {/* Widget 3: Target Tercapai */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                        Collection Rate
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-3xl font-extrabold text-gray-800">
                            {statistik.persentase_tercapai}%
                        </div>
                        <div className="mb-1 text-sm font-medium text-green-600">
                            Tercapai
                        </div>
                    </div>
                    {/* Progress Bar Visual */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                        <div
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{
                                width: `${statistik.persentase_tercapai}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
