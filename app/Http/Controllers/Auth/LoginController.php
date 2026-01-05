<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // Method untuk menampilkan halaman Login
    // (Opsional karena route GET '/' sudah menghandle ini, tapi bagus untuk struktur)
    public function create()
    {
        return inertia('Auth/Login');
    }

    // Method untuk PROSES LOGIN
    public function login(Request $request)
    {
        // 1. Validasi Input
        $credentials = $request->validate([
            'username' => ['required'], 
            'password' => ['required'],
        ]);

        // 2. Ambil status 'Remember Me'
        $remember = $request->boolean('remember');

        // 3. Cek Login (Bisa pakai Username atau Email)
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password], $remember) ||
            Auth::attempt(['email' => $request->username, 'password' => $request->password], $remember)) {
            
            // Regenerasi session untuk keamanan
            $request->session()->regenerate();

            // REDIRECT KE DASHBOARD
            return redirect()->intended('/dashboard');
        }

        // 4. Jika Gagal Login
        return back()->withErrors([
            'username' => 'Username atau password salah.',
        ])->onlyInput('username');
    }

    // Method untuk LOGOUT
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}