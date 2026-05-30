"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Download, ChevronDown, FileSpreadsheet, FileText, Calendar, Users, CircleDollarSign, Filter } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LaporanPage() {
  const [showDL, setShowDL] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [bulanAktif, setBulanAktif] = useState(new Date().getMonth());
  const [dataOmset, setDataOmset] = useState([]);
  const [historiReservasi, setHistoriReservasi] = useState([]);
  const [stats, setStats] = useState({ total_omset: 0, total_reservasi: 0 });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const year = 2026; 
      
      // Buat format tanggal yang benar-benar mencakup seluruh hari
      const startDate = `${year}-${String(bulanAktif + 1).padStart(2, '0')}-01`;
      
      // Dapatkan tanggal terakhir di bulan tersebut
      const lastDay = new Date(year, bulanAktif + 1, 0).getDate();
      const endDate = `${year}-${String(bulanAktif + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      // 1. Ambil Histori & Stats
      const { data: histori, error: errHistori } = await supabase
        .from("reservasi")
        .select(`id_reservasi, tgl_reservasi, total_bayar, sisa_bayar, customer(nama_pelanggan)`)
        .eq("sisa_bayar", 0) // Pastikan di DB sisa_bayar-nya angka 0
        .gte("tgl_reservasi", startDate)
        .lte("tgl_reservasi", endDate) // Filter sampai tanggal terakhir bulan itu
        .order("tgl_reservasi", { ascending: false });

      if (errHistori) throw errHistori;

      // Debugging: Cek di console log browser (F12) apakah datanya ada?
      console.log(`Data bulan ${namaBulan[bulanAktif]}:`, histori);

      const totalOmsetBulanIni = histori?.reduce((acc, curr) => acc + (Number(curr.total_bayar) || 0), 0) || 0;
      
      setHistoriReservasi(histori || []);
      setStats({ 
        total_omset: totalOmsetBulanIni, 
        total_reservasi: histori?.length || 0 
      });

      // 2. Grafik 12 Bulan
      const { data: allYearData } = await supabase
        .from("reservasi")
        .select("tgl_reservasi, total_bayar")
        .eq("sisa_bayar", 0)
        .gte("tgl_reservasi", `${year}-01-01`)
        .lte("tgl_reservasi", `${year}-12-31`);

      const monthlyStats = new Array(12).fill(0);
      allYearData?.forEach(item => {
        // Pastikan parsing tanggal aman
        const d = new Date(item.tgl_reservasi);
        if (!isNaN(d.getTime())) {
          const mIdx = d.getMonth();
          monthlyStats[mIdx] += Number(item.total_bayar) || 0;
        }
      });

      setDataOmset(namaBulan.map((bln, idx) => ({
        bln: bln.substring(0, 3).toUpperCase(),
        total: monthlyStats[idx]
      })));

    } catch (err) {
      console.error("Error Detail Page Laporan:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLaporan(); }, [bulanAktif]);

  // --- FITUR DOWNLOAD EXCEL ---
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(historiReservasi.map(item => ({
      ID: `LYS-${item.id_reservasi.substring(0,8)}`,
      Customer: item.customer?.nama_pelanggan,
      Tanggal: item.tgl_reservasi,
      Total: item.total_bayar
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, `Laporan_LyonsSky_${namaBulan[bulanAktif]}.xlsx`);
    setShowDL(false);
  };

  // --- FITUR DOWNLOAD PDF ---
  const downloadPDF = () => {
  const doc = new jsPDF();
  
  doc.text(`Laporan Pendapatan Lyon's Sky - ${namaBulan[bulanAktif]} 2026`, 14, 15);
  
  // GUNAKAN autoTable(doc, { ... }) bukan doc.autoTable
  autoTable(doc, {
    startY: 25,
    head: [['ID', 'Customer', 'Tanggal', 'Total Bayar']],
    body: historiReservasi.map(item => [
      `LYS-${item.id_reservasi.substring(0,8)}`,
      item.customer?.nama_pelanggan,
      item.tgl_reservasi,
      `Rp ${item.total_bayar.toLocaleString('id-ID')}`
    ]),
    headStyles: { fillColor: [56, 46, 46] }, // Warna #382E2E
  });
  
  doc.save(`Laporan_LyonsSky_${namaBulan[bulanAktif]}.pdf`);
  setShowDL(false);
};

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-[#382E2E]">
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-5xl font-mediumbold text-[#382E2E]">Laporan</h2>
          <p className="text-lg font-medium text-zinc-400">Analytics Lyon's Sky</p>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowDL(!showDL)} className="bg-[#382E2E] text-white px-4 py-2 rounded-xl text-md font-medium flex items-center gap-2 shadow-md hover:bg-black transition-all">
            <Download size={14} className="text-[#cbc500]" /> Download <ChevronDown size={12} />
          </button>
          {showDL && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-zinc-100 rounded-xl shadow-xl z-50 overflow-hidden border-t-4 border-t-[#cbc500]">
              <button onClick={downloadExcel} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-zinc-50 flex items-center gap-2 transition-colors">
                <FileSpreadsheet size={17} className="text-green-600" /> EXCEL
              </button>
              <button onClick={downloadPDF} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-zinc-50 flex items-center gap-2 transition-colors">
                <FileText size={17} className="text-red-600" /> PDF
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm border-l-4 border-l-[#cbc500]">
          <p className="text-md font-semibold text-zinc-400 mb-1">Omset {namaBulan[bulanAktif]}</p>
          <h3 className="text-3xl font-black italic tracking-tighter">Rp {stats.total_omset.toLocaleString('id-ID')}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm border-l-4 border-l-[#382E2E]">
          <p className="text-md font-semibold text-zinc-400 mb-1">Total Reservasi</p>
          <h3 className="text-3xl font-black italic tracking-tighter">{stats.total_reservasi} <span className="text-sm not-italic text-zinc-300">BOOK</span></h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#cbc500] rounded-full"></div>
            <h4 className="text-md font-black uppercase tracking-widest text-[#382E2E]">Revenue 12 Months</h4>
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataOmset}>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="bln" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900'}} dy={10} />
              <YAxis hide />
              <Tooltip cursor={{fill: '#fcfcfc'}} contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: 'bold'}} />
              <Bar dataKey="total" radius={[6, 6, 2, 2]}>
                {dataOmset.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === bulanAktif ? '#cbc500' : '#382E2E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABEL HISTORI (UNCOMMENTED) */}
      {/* <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-50 bg-zinc-50/30 flex justify-between items-center">
          <h4 className="text-sm font-black uppercase flex items-center gap-2">
            <Calendar size={14} className="text-[#cbc500]" /> Transaksi {namaBulan[bulanAktif]}
          </h4>
          <button onClick={() => setShowFilter(!showFilter)} className="relative bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
            Filter <ChevronDown size={10} />
            {showFilter && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto shadow-zinc-200">
                {namaBulan.map((m, idx) => (
                  <div key={m} onClick={() => {setBulanAktif(idx); setShowFilter(false);}} className={`px-3 py-2 text-[10px] font-bold hover:bg-zinc-50 cursor-pointer border-b last:border-0 ${bulanAktif === idx ? 'text-[#cbc500]' : ''}`}>{m}</div>
                ))}
              </div>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase text-zinc-300 border-b border-zinc-50 italic">
              <tr>
                <th className="p-5 px-10">ID</th>
                <th className="p-5">Pelanggan</th>
                <th className="p-5 text-right px-10">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {historiReservasi.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 transition-all">
                  <td className="p-4 px-10 font-bold text-zinc-300 text-[10px]">LYS-{item.id_reservasi.substring(0,8).toUpperCase()}</td>
                  <td className="p-4 text-xs font-black uppercase">{item.customer?.nama_pelanggan}</td>
                  <td className="p-4 text-right px-10 font-black italic text-[#382E2E]">Rp {item.total_bayar?.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}