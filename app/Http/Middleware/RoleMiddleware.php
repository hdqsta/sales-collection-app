<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Ambil user yang sedang login
        $user = $request->user();

        // Cek apakah role user ada di dalam daftar role yang diizinkan
        // Contoh penggunaan di route: role:administrator,sales_staff
        if (! $user || ! in_array($user->role, $roles)) {
            // Jika role tidak cocok, tolak akses (403)
            abort(403, 'AKSES DITOLAK. ANDA TIDAK MEMILIKI IZIN UNTUK HALAMAN INI.');
        }

        return $next($request);
    }
}