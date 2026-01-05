import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Login() {
    // Menggunakan hook useForm dari Inertia untuk manajemen state form yang mudah
    const { data, setData, post, processing, errors } = useForm({
        username: "", // Sesuai dengan LoginController yang kita buat
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post("/login"); // Mengirim data ke route POST /login Laravel
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            <Head title="Login - PLN Icon Plus" />

            {/* Bagian Kiri: Gambar & Slogan (Sesuai Desain image_9d0a5d.jpg) */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative items-center justify-center overflow-hidden">
                {/* Placeholder Image Background - Ganti URL ini dengan aset gambar asli Anda */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1581094794329-cd136ce4ebd1?q=80&w=2500&auto=format&fit=crop"
                        alt="Background Engineer"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10 text-center px-10">
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Smart Connectivity
                        <br />
                        Solutions, Digital &<br />
                        Green Energy
                    </h1>
                </div>
            </div>

            {/* Bagian Kanan: Form Login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-md">
                    {/* Logo PLN Icon Plus */}
                    <div className="flex justify-center mb-8">
                        {/* Ganti src dengan logo aset lokal Anda (/images/logo.png) */}
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_PLN.svg"
                            alt="PLN Icon Plus"
                            className="h-16 w-auto"
                        />
                        {/* Simulasi teks Icon Plus jika logo asli belum ada */}
                        <div className="ml-3 flex flex-col justify-center">
                            <span className="text-xl font-bold text-blue-900 leading-none">
                                PLN
                            </span>
                            <span className="text-sm font-semibold text-blue-500 tracking-wider">
                                Icon Plus
                            </span>
                        </div>
                    </div>

                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
                        Welcome
                    </h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">
                        Silakan masuk ke akun Anda
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Input Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username / Email Address
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                placeholder="youremail@iconpln.co.id"
                                autoFocus
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Input Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href="#"
                                className="text-sm text-gray-400 hover:text-gray-600"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md ${
                                processing
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {processing ? "Memproses..." : "Login"}
                        </button>

                        {/* Opsi Login Google (Mockup sesuai desain) */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    atau masuk dengan
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Login dengan Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
