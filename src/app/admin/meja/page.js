"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";

export default function MejaManagementPage() {
  const [reservasi, setReservasi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  const fetchReservasiAktif = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("reservasi")
      .select(`*, customer(nama_pelanggan)`)
      .eq("status_reservasi", "konfirmasi")
      .gte("tgl_reservasi", today)
      .order("tgl_reservasi", { ascending: true });

    if (!error) {
      setReservasi(data);
    }
  };

  useEffect(() => {
    fetchReservasiAktif();
  }, []);

  // --- FUNGSI EDIT LENGKAP (Meja, Tgl, Jam) ---
  const handleEditReservasi = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Jadwal & Meja",
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <label style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase;">Nomor Meja</label>
          <input id="swal-meja" class="swal2-input" style="margin-top: 5px; margin-bottom: 15px;" value="${item.nomor_meja}">
          
          <label style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase;">Tanggal Reservasi</label>
          <input id="swal-tgl" type="date" class="swal2-input" style="margin-top: 5px; margin-bottom: 15px;" value="${item.tgl_reservasi}">
          
          <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
              <label style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase;">Jam Datang</label>
              <input id="swal-masuk" type="time" class="swal2-input" style="margin-top: 5px;" value="${item.jam_datang}">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase;">Jam Keluar</label>
              <input id="swal-keluar" type="time" class="swal2-input" style="margin-top: 5px;" value="${item.jam_keluar || ""}">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#382E2E",
      confirmButtonText: "Simpan Perubahan",
      preConfirm: () => {
        return {
          nomor_meja: document.getElementById("swal-meja").value,
          tgl_reservasi: document.getElementById("swal-tgl").value,
          jam_datang: document.getElementById("swal-masuk").value,
          jam_keluar: document.getElementById("swal-keluar").value,
        };
      },
    });

    if (formValues) {
      const { error } = await supabase
        .from("reservasi")
        .update(formValues)
        .eq("id_reservasi", item.id_reservasi);

      if (!error) {
        Swal.fire("Berhasil!", "Jadwal telah diperbarui.", "success");
        fetchReservasiAktif();
      } else {
        Swal.fire("Gagal!", error.message, "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Reservasi?",
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase
        .from("reservasi")
        .delete()
        .eq("id_reservasi", id);
      if (!error) {
        Swal.fire("Terhapus!", "Data telah dibuang.", "success");
        fetchReservasiAktif();
      }
    }
  };

  const filteredData = reservasi.filter(
    (item) =>
      item.customer?.nama_pelanggan
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.id_reservasi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-5xl font-mediumbold text-[#382E2E]">
          Manajemen Meja
        </h2>
        <p className="text-lg font-medium text-zinc-400">
          Update Jadwal & Posisi Tamu
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 text-md font-bold text-zinc-400 border-b border-zinc-100">
              <tr>
                <th className="p-5 px-8">Booking ID & Pelanggan</th>
                <th className="p-5">Meja & Jadwal</th>
                <th className="p-5">Status Bayar</th>
                <th className="p-5 text-center">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredData.map((item) => (
                <tr
                  key={item.id_reservasi}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="p-3 px-8">
                    <p className="text-sm font-semibold text-zinc-400 italic mb-1 uppercase">
                      LYS-{item.id_reservasi.substring(0, 4).toUpperCase()}
                    </p>
                    <p className="text-md font-black uppercase text-[#382E2E]">
                      {item.customer?.nama_pelanggan || "Anonim"}
                    </p>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1 text-md font-medium text-[#382E2E] uppercase">
                      <p className="flex items-center gap-1.5">
                        <MapPin size={17} className="text-[#cbc500]" /> Meja{" "}
                        {item.nomor_meja}
                      </p>
                      <p className="flex items-center gap-1.5 text-zinc-400 italic">
                        <Calendar size={17} /> {item.tgl_reservasi}
                      </p>
                      <p className="flex items-center gap-1.5 text-zinc-400 italic">
                        <Clock size={17} /> {item.jam_datang} -{" "}
                        {item.jam_keluar || "??:??"}
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div
                        className={`text-md font-semibold uppercase italic ${item.sisa_bayar === 0 ? "text-green-600" : "text-amber-500"}`}
                      >
                        {item.sisa_bayar === 0 ? "LUNAS" : "DP MASUK"}
                      </div>
                      <p className="text-sm font-semibold text-zinc-400 uppercase italic">
                        Rp {item.sisa_bayar?.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditReservasi(item)}
                        className="p-2 bg-zinc-50 text-zinc-500 rounded-lg hover:bg-[#382E2E] hover:text-white transition-all border border-zinc-100 shadow-sm"
                      >
                        <Edit3 size={19} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_reservasi)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
