import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function SidebarLayout({ children }) {
    // 1. Ambil url dan props dari usePage()
    const { url, props } = usePage();
    const { auth } = props;

    const user = auth.user;
    const userRole = user.role; // 'administrator', 'sales_staff', 'collection_staff'

    // 2. Definisikan Menu berdasarkan Role
    let menus = [];

    if (userRole === "administrator") {
        // --- MENU KHUSUS ADMIN ---
        menus = [
            {
                name: "Dashboard",
                route: "/dashboard",
                icon: (
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
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "User Management",
                route: "/users",
                icon: (
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
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Monitoring",
                route: "/sales/monitoring", // Route Admin & Sales sama (dibedakan di Controller)
                icon: (
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
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Cash-in",
                route: "/cash-in",
                icon: (
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
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Customer Info",
                route: "/customer-info",
                icon: (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Data Master",
                route: "#",
                icon: (
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
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        ></path>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                    </svg>
                ),
            },
        ];
    } else if (userRole === "collection_staff") {
        // --- MENU KHUSUS COLLECTION STAFF ---
        menus = [
            {
                name: "Dashboard",
                route: "/dashboard",
                icon: (
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
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Monitoring",
                route: "/sales/monitoring", // Collection bisa akses monitoring juga
                icon: (
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
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Collection Letter",
                route: "/collection/letters",
                icon: (
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                ),
            },
            // Tambahkan menu khusus Collection lain di sini jika ada (misal: "Task List", "Reminder")
            {
                name: "Invoice",
                route: "/sales/invoice",
                icon: (
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Customer Info",
                route: "/customer-info",
                icon: (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                    </svg>
                ),
            },
        ];
    } else {
        // --- MENU DEFAULT (SALES STAFF) ---
        menus = [
            {
                name: "Dashboard",
                route: "/dashboard",
                icon: (
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
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Monitoring",
                route: "/sales/monitoring",
                icon: (
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
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Tellecollection",
                route: "/sales/telecollection",
                icon: (
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Invoice",
                route: "/sales/invoice",
                icon: (
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Cash-in",
                route: "/cash-in",
                icon: (
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
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                    </svg>
                ),
            },
            {
                name: "Customer Info",
                route: "/customer-info",
                icon: (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                    </svg>
                ),
            },
        ];
    }

    // Helper: Inisial Nama
    const getInitials = (name) => {
        if (!name) return "GU";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const userInitials = getInitials(user.nama_lengkap || user.name);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-[#003366] text-white flex flex-col fixed h-full transition-all duration-300 shadow-xl z-50">
                {/* Logo Section */}
                <div className="p-6 bg-white flex items-center justify-center border-b border-gray-200 h-20">
                    <img
                        src="/images/pln-kuning.png"
                        alt="PLN Logo"
                        className="h-[50px] w-auto"
                    />
                    <div className="ml-3 font-bold text-[#00adef] text-xl leading-tight">
                        PLN
                        <br />
                        <span className="text-[#025970]">Icon Plus</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menus.map((menu, index) => {
                        // Cek apakah route aktif
                        // Gunakan pengecekan aman agar tidak error jika url undefined
                        const isActive =
                            url &&
                            url.startsWith(menu.route) &&
                            menu.route !== "#";
                        return (
                            <Link
                                key={index}
                                href={menu.route === "#" ? "#" : menu.route}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
                                    isActive
                                        ? "bg-white text-[#003366] shadow-sm"
                                        : "text-gray-300 hover:bg-[#004080] hover:text-white"
                                }`}
                            >
                                <span className="mr-3">{menu.icon}</span>
                                {menu.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Logout (Sticky Bottom) */}
                <div className="p-4 border-t border-[#004080] bg-[#002b55]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                            {userInitials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">
                                {user.nama_lengkap || user.name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                                {userRole.replace("_", " ")}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full bg-white text-[#003366] py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition shadow-sm flex items-center justify-center gap-2"
                    >
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
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                        </svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <main className="flex-1 ml-64 overflow-y-auto h-screen bg-gray-50">
                <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between sticky top-0 z-40">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        Sistem Sales & Collection
                    </h2>
                    <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </header>

                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
