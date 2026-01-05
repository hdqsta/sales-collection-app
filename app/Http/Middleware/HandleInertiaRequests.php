<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
   public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Kirim data Auth User
            'auth' => [
                'user' => $request->user() ? [
                    'user_id' => $request->user()->user_id,
                    // Di sini kita panggil 'name' yang sudah dijembatani di Model tadi
                    'name' => $request->user()->name, 
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    // Ambil inisial untuk Avatar (Opsional, biar backend yang hitung)
                    'initials' => substr($request->user()->nama_lengkap, 0, 2), 
                ] : null,
            ],
            // Kirim Flash Message (Sudah ada sebelumnya)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
