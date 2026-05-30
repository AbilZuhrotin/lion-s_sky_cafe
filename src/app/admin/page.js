"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BellRing,
  Wallet,
  CalendarDays,
  Utensils,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";

export default function DashboardAdmin() {
  const [tagihanDP, setTagihanDP] = useState([]);
  const [jadwalMendatang, setJadwalMendatang] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDataDashboard = async () => {
    setLoading(true);
    
    // PERBAIKAN DI SINI: Pake Intl buat dapet tanggal lokal YYYY-MM-DD
    const today = new Intl.DateTimeFormat('fr-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Jakarta' // Paksa ke zona waktu kita
    }).format(new Date());

    console.log("Cek Tanggal Hari Ini:", today); // Liat di inspect element, harusnya 2026-04-29

    const { count } = await supabase
      .from("reservasi")
      .select("*", { count: "exact", head: true })
      .eq("status_reservasi", "proses");
    setNotifCount(count || 0);

    // Filter tagihan jadi akurat ke hari ini
    const { data: dataDP } = await supabase
      .from("reservasi")
      .select(`*, customer(nama_pelanggan)`)
      .eq("status_reservasi", "konfirmasi")
      .eq("tgl_reservasi", today)
      .gt("sisa_bayar", 0)
      .order("tgl_reservasi", { ascending: true });
    setTagihanDP(dataDP || []);

    const { data: dataJadwal } = await supabase
      .from("reservasi")
      .select(
        `
        *, 
        customer(nama_pelanggan),
        detail_reservasi ( qty, menu (nama_menu) )
      `,
      )
      .eq("status_reservasi", "konfirmasi")
      .gte("tgl_reservasi", today)
      .order("tgl_reservasi", { ascending: true })
      .limit(6);

    setJadwalMendatang(dataJadwal || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDataDashboard();
  }, []);

  const handlePelunasan = async (id) => {
    const confirm = await Swal.fire({
      title: "Pelunasan Pembayaran",
      text: "Tamu sudah bayar sisanya? Status akan berubah jadi LUNAS.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#382E2E",
      confirmButtonText: "Ya, Lunaskan!",
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase
        .from("reservasi")
        .update({ sisa_bayar: 0, status_pembayaran: "lunas" })
        .eq("id_reservasi", id);

      if (!error) {
        Swal.fire("Sukes!", "Data telah diupdate ke status LUNAS.", "success");
        fetchDataDashboard();
      }
    }
  };

  // FUNGSI KIRIM DETAIL KE DAPUR VIA WA
  const shareToKitchen = (item) => {
    const menus =
      item.detail_reservasi
        ?.map((d) => `- ${d.qty}x ${d.menu.nama_menu}`)
        .join("%0A") || "Hanya reservasi tempat";
    const text = `*ORDER BARU - LYON'S SKY*%0A%0A*Meja:* ${item.nomor_meja}%0A*Tamu:* ${item.customer.nama_pelanggan}%0A*Jam:* ${item.jam_datang}%0A%0A*Pesanan:*%0A${menus}%0A%0A_Mohon segera diproses!_ 🔥`;

    // Ganti nomor ini dengan nomor WA Dapur/Chef kamu
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 animate-pulse">
          Loading Lyon's Sky Data...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 text-[#382E2E]">
      {/* HEADER & NOTIF */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-5xl font-mediumbold text-[#382E2E]">Dashboard</h2>
          <p className="text-lg font-medium text-zinc-400">
            Manajemen Operasional
          </p>
        </div>
        <Link
          href="/admin/konfirmasi"
          className="relative p-3 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-[#cbc500] transition-all"
        >
          <BellRing
            size={22}
            className={notifCount > 0 ? "text-[#382E2E]" : "text-zinc-300"}
          />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-[10px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-white">
              {notifCount}
            </span>
          )}
        </Link>
      </div>

      {/* SECTION 1: PELUNASAN (FULL WIDTH) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Wallet className="text-[#382E2E]" size={16} />
            <h3 className="text-lg font-medium">
              Tagihan Hari Ini
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tagihanDP.length > 0 ? (
            tagihanDP.map((item) => (
              <div
                key={item.id_reservasi}
                className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 border-l-4 border-l-red-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-zinc-50 rounded-lg border border-zinc-100">
                    <span className="text-sm font-medium text-zinc-400 uppercase">
                      Meja
                    </span>
                    <span className="text-3xl font-black text-[#382E2E] leading-none">
                      {item.nomor_meja}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-md font-black uppercase leading-tight">
                      {item.customer?.nama_pelanggan}
                    </h5>
                    <p className="text-md font-bold text-red-500 italic mt-0.5">
                      Sisa: Rp {item.sisa_bayar?.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handlePelunasan(item.id_reservasi)}
                  className="bg-[#382E2E] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 whitespace-nowrap"
                >
                  Bayar
                </button>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 p-6 text-center border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-500 text-md font-medium italic">
              Belum ada tamu hari ini yang perlu pelunasan
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: AGENDA TERDEKAT (FULL WIDTH) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-[#382E2E]" size={18} />
            <h3 className="text-lg font-medium">Reservasi Terdekat</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {jadwalMendatang.map((item) => {
            const date = new Date(item.tgl_reservasi);
            return (
              <div
                key={item.id_reservasi}
                className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm group hover:border-[#382E2E] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Info Customer */}
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-50 p-2 rounded-lg text-center min-w-[50px] border border-zinc-100">
                      <p className="text-xs font-bold uppercase text-zinc-400 leading-none">
                        {date.toLocaleString("id-ID", { month: "short" })}
                      </p>
                      <p className="text-xl font-bold">{date.getDate()}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h6 className="text-md font-black uppercase leading-none">
                          {item.customer?.nama_pelanggan}
                        </h6>
                        {item.sisa_bayar === 0 && (
                          <CheckCircle2 size={18} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-md font-medium text-zinc-400 italic mt-1">
                        Meja {item.nomor_meja} • {item.jam_datang} WIB
                      </p>
                    </div>
                  </div>

                  {/* Kitchen Task Preview */}
                  <div className="flex-1 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 flex flex-wrap gap-2">
                    <div className="w-full flex items-center gap-1.5 mb-1">
                      <Utensils size={10} className="text-[#cbc500]" />
                      <span className="text-md font-black text-zinc-400 tracking-tighter">
                        Kitchen Task
                      </span>
                    </div>
                    {item.detail_reservasi?.map((det, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-sm font-mediun px-2 py-1 rounded border border-zinc-100 text-zinc-500"
                      >
                        {det.qty}x {det.menu?.nama_menu}
                      </span>
                    )) || (
                      <span className="text-[8px] text-zinc-300 italic uppercase">
                        Hanya Reservasi Tempat
                      </span>
                    )}
                  </div>

                  {/* Aksi Share WA Dapur */}
                  <button
                    onClick={() => shareToKitchen(item)}
                    className="flex items-center justify-center gap-2 bg-zinc-50 hover:bg-[#382E2E] hover:text-white text-[#382E2E] p-4 rounded-xl border border-zinc-100 transition-all active:scale-95"
                    title="Kirim ke Dapur"
                  >
                    <Send size={16} />
                    <span className="text-[10px] font-black uppercase md:hidden">
                      Kirim ke Dapur
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
