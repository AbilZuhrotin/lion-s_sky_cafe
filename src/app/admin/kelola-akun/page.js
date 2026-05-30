"use client";
import React, { useState, useEffect } from "react";
import { UserPlus, Shield, Key, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";

export default function KelolaAkunPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Ambil data staff dari tabel public.users
  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*");

    if (!error) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddStaff = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'TAMBAH STAFF BARU',
      html:
        '<input id="swal-email" class="swal2-input" placeholder="Email Staff">' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Password Staff">' +
        '<input id="swal-name" class="swal2-input" placeholder="Nama Staff">' +
        '<select id="swal-role" class="swal2-input">' +
        '<option value="admin">Admin</option>' +
        '<option value="super_admin">Super Admin</option>' +
        '</select>',
      focusConfirm: false,
      showCancelButton: true, // Biar ada tombol batal
      confirmButtonText: 'SIMPAN STAFF', // Teks tombol confirm
      confirmButtonColor: '#382E2E',
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const password = document.getElementById('swal-password').value;
        const username = document.getElementById('swal-name').value;
        const role = document.getElementById('swal-role').value;

        if (!email || !password || !username) {
          Swal.showValidationMessage('Semua harus diisi ya Bil!');
          return false;
        }
        return { email, password, username, role };
      }
    });

    if (formValues) {
      // Tampilkan loading pas lagi proses nembak API
      Swal.fire({
        title: 'Sedang mendaftarkan...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
      });

      try {
        const res = await fetch('/api/add-staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // Tambahkan header ini Bil
          body: JSON.stringify(formValues)
        });
        
        const result = await res.json();
        
        if (!res.ok || result.error) {
          Swal.fire("Gagal!", result.error || "Terjadi kesalahan", "error");
        } else {
          Swal.fire("Berhasil!", "Staff baru siap login!", "success");
          fetchAccounts();
        }
      } catch (err) {
        Swal.fire("Error!", "Koneksi ke API gagal", "error");
      }
    }
  };

  const handleDelete = async (id, role) => {
    if (role === "super_admin") {
      return Swal.fire(
        "Waduh!",
        "Super Admin nggak bisa dihapus sendiri Bil!",
        "error",
      );
    }

    const confirm = await Swal.fire({
      title: "Hapus Staff?",
      text: "Akses login orang ini bakal hilang!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#382E2E",
      confirmButtonText: "Ya, Hapus!",
    });

    if (confirm.isConfirmed) {
      // Logic hapus di sini (Hapus di public.users)
      await supabase.from("users").delete().eq("id_user", id);
      fetchAccounts();
      Swal.fire("Terhapus!", "Staff berhasil didepak.", "success");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-mediumbold text-[#382E2E]">
            Kelola Akun
          </h2>
          <p className="text-lg font-medium text-zinc-400">
            Manajemen hak akses staff
          </p>
        </div>
        <button
          onClick={handleAddStaff}
          className="bg-[#cbc500] text-[#382E2E] px-4 py-2.5 rounded-xl text-md font-medium flex items-center gap-2"
        >
          <UserPlus size={16} /> Tambah Staff
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id_user}
            className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-[#382E2E]">
                <Shield size={25} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">
                  {acc.username}
                </h4>
                <p className="text-md font-medium text-zinc-400 italic">
                  {acc.role.replace("_", " ")} •{" "}
                  {acc.email || "Email belum diset"}
                </p>
              </div>
            </div>
            {/* Tombol Hapus */}
            <button
              onClick={() => handleDelete(acc.id_user, acc.role)}
              className="p-2 text-zinc-400 hover:text-red-500"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
