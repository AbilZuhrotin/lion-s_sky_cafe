"use client";
import React from 'react';

export default function StepFive({ cart = [], paymentType = 'dp', totalWajibBayar = 0 }) {
  const bookingCode = `LYS-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleWhatsApp = () => {
    const adminNumber = process.env.NEXT_PUBLIC_KONFIRMASI_PEMBAYARAN; 
    const listMenu = cart.map(item => `- ${item.nama_menu} (${item.qty}x)`).join('%0A');
    
    const message = `Halo Admin Lyon's Sky!%0A%0ASaya sudah melakukan pembayaran reservasi Proses:%0A%0A` +
      `*Kode Booking:* ${bookingCode}%0A` +
      `*Metode:* ${paymentType.toUpperCase()}%0A` +
      `*Total Bayar:* Rp ${totalWajibBayar.toLocaleString("id-ID")}%0A%0A` +
      `*Pesanan:*%0A${listMenu}%0A%0A_Saya melampirkan bukti bayar (SS QRIS) di bawah ini._`;

    window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10 font-sans min-h-screen">
      

      {/* Struk Lyon's */}
      <div className="bg-white dark:bg-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="text-center border-b border-gray-100 pb-2 mb-4">
          <h4 className="font-black text-[#382E2E] text-lg uppercase">Lyon's Sky</h4>
          <p className="text-[9px] text-gray-400 dark:text-black font-bold uppercase tracking-widest">Struk Digital</p>
        </div>


        {/* Scan QRIS */}
        <div className="flex flex-col items-center justify-center py-4 bg-zinc-50 rounded-xl mb-6 border border-dashed border-gray-200">
          <p className="text-[10px] font-bold text-[#382E2E] uppercase mb-3 tracking-widest">QRIS Lyon's Sky</p>
          
          {/* Barcode QRIS ada di supabase storage */}
          <div className="bg-white p-2 border border-gray-100 shadow-inner rounded-lg">
             <img 
               src="/foto/image.png" 
               alt="Pembayaran QRIS" 
               className="w-48 h-48 object-contain"
             />
          </div>
          
          <p className="text-[9px] text-gray-400 mt-3 italic font-medium">Scan menggunakan e-wallet atau m-banking</p>
        </div>

        {/* Total Harga */}
        <div className="space-y-3 mb-2 px-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 uppercase font-bold text-[9px]">Kode Booking</span>
            <span className="font-bold text-[#382E2E]">{bookingCode}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 uppercase font-bold text-[9px]">Payment Status</span>
            <span className="px-1.5 py-1 bg-amber-50 text-amber-600 text-[9px] font-black border border-amber-200 rounded-md uppercase">
            Pending
            </span>
        </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 uppercase font-bold text-[9px]">Tipe Bayar</span>
            <span className="font-bold text-[#382E2E] uppercase">{paymentType}</span>
          </div>
          
      {/* Status pembayaran */}
        <div className="border-t border-dashed border-gray-200 pt-5 mb-6">
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-4">Rincian:</p>
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-600 uppercase text-[10px]">{item.qty}x {item.nama_menu}</span>
                <span className="font-bold text-[#382E2E]">Rp {(item.harga * item.qty).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
        </div>
          <div className="border-t-2 border-[#382E2E] pt-4 mt-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#382E2E] uppercase">Total Bayar</span>
                <span className="text-[9px] text-gray-400 font-medium">*Sudah termasuk PPN 10%</span>
              </div>
              <span className="text-xl font-black text-[#382E2E]">
                Rp {totalWajibBayar.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi */}
      <div className="mt-8 space-y-3">
        <button 
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white dark:text-black py-4 rounded-xl font-black text-xs shadow-xl flex items-center justify-center gap-2"
        >
          Kirim Bukti Pembayaran
        </button>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-zinc-100 text-zinc-500 py-4 rounded-xl font-bold text-xs"
        >
          Selesai / Beranda
        </button>
      </div>

    </main>
  );
}