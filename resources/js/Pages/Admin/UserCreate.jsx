import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "", // Manual Input ID
        nama_lengkap: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "sales_staff",
        status: "aktif",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/users");
    };

    return (
        <SidebarLayout>
            <Head title="Tambah User Baru" />
            <div className="max-w-4xl mx-auto py-8 px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Tambah User Baru
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* User ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User ID (Cth: SAL002)
                            </label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.user_id}
                                onChange={(e) =>
                                    setData("user_id", e.target.value)
                                }
                            />
                            {errors.user_id && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.user_id}
                                </div>
                            )}
                        </div>

                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.nama_lengkap}
                                onChange={(e) =>
                                    setData("nama_lengkap", e.target.value)
                                }
                            />
                            {errors.nama_lengkap && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.nama_lengkap}
                                </div>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                            />
                            {errors.username && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.username}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                            >
                                <option value="sales_staff">Sales Staff</option>
                                <option value="collection_staff">
                                    Collection Staff
                                </option>
                                <option value="administrator">
                                    Administrator
                                </option>
                            </select>
                            {errors.role && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.role}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            {errors.password && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <Link
                                href="/users"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
                            >
                                {processing ? "Menyimpan..." : "Simpan User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
