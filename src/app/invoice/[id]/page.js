"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, MapPin, Clock, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function InvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      // Tarik data reservasi, customer, dan detail menu sekaligus
      const { data: reservasi, error } = await supabase
        .from("reservasi")
        .select(`
          *,
          customer (nama_pelanggan, nomor_wa),
          detail_reservasi (
            qty,
            menu (nama_menu, harga)
          )
        `)
        .eq("id_reservasi", id)
        .single();

      if (!error && reservasi) {
        setData(reservasi);
      }
      setLoading(false);
    };

    if (id) fetchInvoiceData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-zinc-300">Generating Invoice...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-red-500">Invoice Tidak Ditemukan!</div>;

  const total_pesanan = data.total_bayar || 0;
  const dp_dibayar = (data.total_bayar || 0) - (data.sisa_bayar || 0);
  const sisa_bayar = data.sisa_bayar || 0;

  return (
    <div className="min-h-screen bg-white py-6 md:py-12 px-4 font-sans text-[#1a1a1a]">
      <div className="max-w-2xl mx-auto">
        
        {/* BUTTON PRINT */}
        <div className="flex justify-end mb-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-[#382E2E] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
          >
            <Printer size={14} /> Download / Print Invoice
          </button>
        </div>

        {/* INVOICE CARD */}
        <div className="border border-zinc-200 p-6 md:p-12 shadow-sm relative overflow-hidden bg-white">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-12">
            <div className="w-32 h-32">
              <img
                src="/foto/logo-nobg.png"
                alt="Lyon's Sky Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col items-center md:items-end">
              <span className={`px-4 py-1 border-2 text-[10px] font-black uppercase tracking-widest mb-2 ${data.status_reservasi === 'konfirmasi' ? 'border-green-600 text-green-600' : 'border-amber-500 text-amber-500'}`}>
                {data.status_reservasi}
              </span>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">
                LYS-{data.id_reservasi.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="text-center text-[12px] font-black text-zinc-300 pb-5 uppercase tracking-[0.5em]">
            Digital Invoice
          </div>

          {/* GRID INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 border-y border-zinc-100 py-8">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Atas Nama</p>
              <p className="text-sm font-black uppercase">{data.customer?.nama_pelanggan}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Jadwal Kedatangan</p>
              <p className="text-xs font-black uppercase">
                {data.tgl_reservasi} <br /> {data.jam_datang} WIB
              </p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Nomor Meja</p>
              <p className="text-lg font-black text-[#382E2E]">{data.nomor_me_ja || data.nomor_meja}</p>
            </div>
          </div>

          {/* DAFTAR MENU */}
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 border-b pb-2">Rincian Pesanan</p>
            <div className="space-y-5">
              {data.detail_reservasi?.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-black uppercase text-[#382E2E]">{item.menu?.nama_menu}</p>
                    <p className="text-[9px] text-zinc-400 font-bold">Qty: {item.qty}x</p>
                  </div>
                  <p className="font-black italic text-[#382E2E]">
                    Rp {(item.menu?.harga * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="pt-8 border-t-2 border-zinc-50">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 p-4 bg-zinc-50 border-l-4 border-[#382E2E]">
                <p className="text-[9px] font-black uppercase mb-2 italic">Ketentuan Lyon's Sky:</p>
                <ul className="text-[8px] font-bold text-zinc-500 space-y-1 uppercase tracking-tighter">
                  <li>• TUNJUKKAN INVOICE INI KE KASIR SAAT TIBA.</li>
                  <li>• TOLERANSI KETERLAMBATAN MAKSIMAL 15 MENIT.</li>
                  <li>• DP YANG SUDAH DIBAYAR TIDAK DAPAT DIKEMBALIKAN.</li>
                </ul>
              </div>

              <div className="w-full md:w-72 space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase">
                  <span>Total Transaksi</span>
                  <span>Rp {total_pesanan.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between items-center py-4 border-y border-zinc-100 text-green-600 bg-green-50/50 px-3">
                  <span className="text-[9px] font-black uppercase italic">DP (Paid)</span>
                  <span className="text-lg font-black italic">- Rp {dp_dibayar.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between items-center pt-2 px-3 bg-[#382E2E] text-white p-4 rounded-xl">
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase leading-none">Sisa di Kasir</p>
                    <p className="text-[7px] font-bold uppercase opacity-60 mt-1">(Pay at Cashier)</p>
                  </div>
                  <span className="text-xl font-black text-[#cbc500]">
                    Rp {sisa_bayar.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-zinc-50 pt-8 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[1em]">LYON'S SKY</p>
          </div>
        </div>
      </div>
    </div>
  );
}