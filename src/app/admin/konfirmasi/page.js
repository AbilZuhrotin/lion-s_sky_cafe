"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Send,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Trash2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";

export default function KonfirmasiPage() {
  const [dataKonfirmasi, setDataKonfirmasi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  // 1. Fungsi ambil data dari database
  const fetchReservasi = async () => {
    const { data, error } = await supabase
      .from("reservasi")
      .select(`*, customer (nama_pelanggan, nomor_wa)`)
      .eq("status_reservasi", "proses") // HANYA TAMPILIN YANG BELUM DI-ACC
      .order("created_at", { ascending: false });

    if (!error) setDataKonfirmasi(data);
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  // 2. Fungsi Filter Pencarian
  const filteredData = dataKonfirmasi.filter(
    (item) =>
      item.customer?.nama_pelanggan
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.id_reservasi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 3. Fungsi Verifikasi (Update Status di DB)
  const handleVerifikasi = async (id) => {
    const confirm = await Swal.fire({
      title: "Verifikasi Pembayaran?",
      text: "Pastikan uang DP sudah masuk. Setelah diverifikasi, silakan kirim WA ke customer sebelum data berpindah.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Ya, Verifikasi!",
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase
        .from("reservasi")
        .update({ status_reservasi: "konfirmasi" })
        .eq("id_reservasi", id);

      if (!error) {
        Swal.fire({
          title: "Berhasil!",
          text: "Status sudah 'Konfirmasi'. Silakan klik tombol WA untuk kirim invoice, lalu refresh halaman ini.",
          icon: "success",
          confirmButtonText: "Oke, Siap!",
        });
        // fetchReservasi(); // <--- KOMENTARI ATAU HAPUS INI Bil biar gak langsung ilang
      } else {
        Swal.fire("Gagal!", error.message, "error");
      }
    }
  };

  const handleSendWA = (item) => {
    // Ambil data dari hasil join customer
    const nama = item.customer?.nama_pelanggan || "Pelanggan";
    const wa = item.customer?.nomor_wa;
    const id = item.id_reservasi;
    const meja = item.nomor_meja;
    const tgl = item.tgl_reservasi;

    if (!wa) {
      return Swal.fire("Error", "Nomor WA tidak ditemukan!", "error");
    }

    const message = `Halo ${nama}, reservasi kamu di *Lyon's Sky* (Meja ${meja}) untuk tanggal ${tgl} telah kami konfirmasi. %0A%0ASilakan cek invoice kamu di sini: %0Ahttps://lyonssky.com/invoice/${id} %0A%0ASampai jumpa di lokasi! 🔥`;

    // Pastikan nomor WA diawali dengan kode negara (misal 62)
    const formattedWa = wa.startsWith("0") ? "62" + wa.slice(1) : wa;

    window.open(
      `https://api.whatsapp.com/send?phone=${formattedWa}&text=${message}`,
      "_blank",
    );
  };

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Batalkan Reservasi?",
      text: "Data ini bakal dihapus permanen!",
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
        Swal.fire("Dihapus!", "Pesanan iseng sudah dibuang.", "success");
        fetchReservasi();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-10">
      {/* HEADER */}
      <header className="flex flex-col gap-4">
        <div>
          <h2 className="text-5xl font-mediumbold text-[#382E2E]">
            Konfirmasi Pembayaran
          </h2>
          <p className="text-lg font-medium text-zinc-400">
            Verifikasi & Kirim Invoice Digital
          </p>
        </div>
      </header>

      <div className="flex justify-between items-center">
        <p className="text-md font-medium text-red-300 italic">
          *Data yang sudah diverifikasi akan hilang setelah halaman direfresh
        </p>
        <button
          onClick={fetchReservasi}
          className="bg-[#cbc500] hover:bg-[#b8b200] text-[#382E2E] px-4 py-2 rounded-lg text-md font-medium transition-all shadow-sm"
        >
          Refresh Daftar
        </button>
      </div>

      {/* GRID CARDS (Universal: HP, iPad, Laptop OK) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
        {filteredData.map((item) => (
          <div
            key={item.id_reservasi}
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-md font-medium text-zinc-400 tracking-tighter uppercase italic">
                  {/* Mengambil 8 karakter pertama biar mirip LYS-XXXX */}
                  LYS-{item.id_reservasi.substring(0, 4).toUpperCase()}
                </p>
                <h4 className="text-md font-black uppercase text-[#382E2E] tracking-tight leading-tight">
                  {item.customer?.nama_pelanggan}
                </h4>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded uppercase italic border ${
                  item.status_reservasi === "dikonfirmasi"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}
              >
                {item.status_reservasi}
              </span>
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <CreditCard size={18} />
                </div>
                <div>
                  {/* Ganti labelnya biar jelas */}
                  <p className="text-sm font-semibold text-zinc-400">
                    DP Masuk
                  </p>
                  <p className="text-sm font-black text-green-600 italic tracking-tight">
                    Rp{" "}
                    {(
                      (item.total_bayar || 0) - (item.sisa_bayar || 0)
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {/* Ganti labelnya biar jelas */}
                <p className="text-xs font-medium text-zinc-400">
                  Bayar di Tempat
                </p>
                <p className="text-xs font-bold text-red-600 italic">
                  Rp {(item.sisa_bayar || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin size={15} />
                <p className="text-sm font-medium italic">
                  Meja: {item.nomor_meja}
                </p>
              </div>
              {/* TAMBAHAN METODE PEMBAYARAN */}
              <div className="flex items-center gap-2 text-zinc-500">
                <CreditCard size={15} />
                <p className="text-sm font-medium italic">
                  Metode:{" "}
                  <span className="text-[#cbc500] uppercase">
                    {item.jenis_pembayaran || "Transfer"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar size={15} />
                <p className="text-sm font-medium italic">
                  Tanggal: {item.tgl_reservasi}
                </p>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock size={15} />
                <p className="text-sm font-medium italic">
                  Jam: {item.jam_datang} - {item.jam_keluar || "--:--"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {item.status_reservasi !== "dikonfirmasi" && (
                <button
                  onClick={() => handleVerifikasi(item.id_reservasi)}
                  className="flex-[2] bg-green-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Verifikasi
                </button>
              )}
              <button
                onClick={() => handleSendWA(item)}
                className="flex-1 border-2 border-[#382E2E] text-[#382E2E] py-3 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2"
              >
                <Send size={18} />
              </button>
              {/* TOMBOL DELETE BARU */}
              <button
                onClick={() => handleCancel(item.id_reservasi)}
                className="p-3 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
