<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // Tampilkan List User
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
        }

        return Inertia::render('Admin/UserManagement', [
            'users' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    // Tampilkan Form Tambah
    public function create()
    {
        return Inertia::render('Admin/UserCreate');
    }

    // Simpan User Baru
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|unique:users,user_id|max:20', // ID manual (cth: SAL002)
            'nama_lengkap' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // butuh field password_confirmation di form
            'role' => 'required|in:administrator,collection_staff,sales_staff',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        User::create([
            'user_id' => $request->user_id,
            'nama_lengkap' => $request->nama_lengkap,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $request->status,
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    // Tampilkan Form Edit
    public function edit($id)
    {
        $user = User::where('user_id', $id)->firstOrFail();
        return Inertia::render('Admin/UserEdit', [
            'user' => $user
        ]);
    }

    // Update User
    public function update(Request $request, $id)
    {
        $user = User::where('user_id', $id)->firstOrFail();

        $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            // Ignore unique rule untuk user ini sendiri saat update
            'username' => ['required', 'max:50', Rule::unique('users')->ignore($user->user_id, 'user_id')],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->user_id, 'user_id')],
            'role' => 'required|in:administrator,collection_staff,sales_staff',
            'status' => 'required|in:aktif,nonaktif',
            'password' => 'nullable|string|min:6|confirmed', // Password opsional saat edit
        ]);

        $data = [
            'nama_lengkap' => $request->nama_lengkap,
            'username' => $request->username,
            'email' => $request->email,
            'role' => $request->role,
            'status' => $request->status,
        ];

        // Hanya update password jika diisi
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'Data user berhasil diperbarui.');
    }

    // Hapus User
    public function destroy($id)
    {
        $user = User::where('user_id', $id)->firstOrFail();
        
        // Mencegah menghapus diri sendiri
        if (auth()->user()->user_id === $user->user_id) {
            return back()->withErrors(['error' => 'Anda tidak dapat menghapus akun sendiri.']);
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
}