import React, { useEffect } from "react";
import { Head, useForm, router, Link, usePage } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import Swal from "sweetalert2";

export default function UserManagement({ users, filters }) {
    // Mengambil flash message dari backend (Controller)
    const { flash } = usePage().props;

    // State untuk search
    const { data, setData, get } = useForm({
        search: filters.search || "",
    });

    // EFFECT: Menampilkan Notifikasi Sukses dari Controller (Create/Update)
    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                showConfirmButton: false,
                timer: 2000,
                position: "center",
            });
        }
        if (flash.error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: flash.error,
            });
        }
    }, [flash]);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        get("/users", { preserveState: true });
    };

    // Handle Delete User
    const handleDelete = (userId) => {
        Swal.fire({
            title: "Hapus User?",
            text: "Data user ini akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/users/${userId}`, {
                    onSuccess: () =>
                        Swal.fire(
                            "Terhapus!",
                            "User berhasil dihapus.",
                            "success"
                        ),
                });
            }
        });
    };

    // Helper: Badge Color berdasarkan Role (Disesuaikan dengan Gambar)
    const getRoleBadge = (role) => {
        switch (role) {
            case "collection_staff":
                // Biru Muda
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "sales_staff":
                // Ungu/Indigo Muda
                return "bg-indigo-100 text-indigo-800 border border-indigo-200";
            case "administrator":
                // Abu-abu
                return "bg-gray-100 text-gray-800 border border-gray-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Helper: Format Role Text
    const formatRole = (role) => {
        if (!role) return "-";
        return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <SidebarLayout>
            <Head title="User Management" />

            <div className="max-w-7xl mx-auto py-8 px-6">
                {/* Header */}
                <h2 className="text-2xl font-bold text-blue-900 mb-8">
                    User Management
                </h2>

                {/* Toolbar: Search & Add Button */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full md:w-1/3"
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
                            placeholder="Cari user..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900 transition"
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                        />
                    </form>

                    {/* Button Tambah User */}
                    <Link
                        href="/users/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-sm"
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
                                d="M12 4v16m8-8H4"
                            ></path>
                        </svg>
                        Tambah User
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#003366] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.length > 0 ? (
                                    users.data.map((user, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-blue-50 transition duration-150"
                                        >
                                            {/* Nama */}
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                                {user.nama_lengkap}
                                            </td>

                                            {/* Username */}
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {user.username}
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                                {user.email}
                                            </td>

                                            {/* Role Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${getRoleBadge(
                                                        user.role
                                                    )}`}
                                                >
                                                    {formatRole(user.role)}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                                        user.status === "aktif"
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                    }`}
                                                >
                                                    {user.status === "aktif"
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Aksi Icons */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center gap-4">
                                                    {/* Edit Icon */}
                                                    <Link
                                                        href={`/users/${user.user_id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded transition"
                                                        title="Edit User"
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
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            ></path>
                                                        </svg>
                                                    </Link>

                                                    {/* Delete Icon */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.user_id
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded transition"
                                                        title="Hapus User"
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-gray-500 italic"
                                        >
                                            Data user tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-gray-600 mb-4 md:mb-0">
                        Halaman{" "}
                        <span className="font-bold text-gray-900">
                            {users.current_page}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-gray-900">
                            {users.last_page}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        {users.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-sm border rounded-md transition ${
                                        link.active
                                            ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-900"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 text-sm border rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
