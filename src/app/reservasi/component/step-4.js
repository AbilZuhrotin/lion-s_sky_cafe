"use client";
import React from "react";
import { useState } from "react";

export default function StepFour({ cart, setCart, onBack, onNext }) {
  const [paymentType, setPaymentType] = useState("dp"); // 'dp' atau 'lunas'
  // --- LOGIKA PERHITUNGAN FIX (PPN 10% DARI TOTAL ASLI) ---
  const subtotalAsli = cart.reduce(
    (acc, curr) => acc + curr.harga * curr.qty,
    0,
  );

  // PPN 10% dari total belanja (selalu tetap mau DP/Lunas) + Pembulatan
  const ppnTetap = Math.round(subtotalAsli * 0.1);

  const totalKeseluruhan = subtotalAsli + ppnTetap;

  // Wajib Bayar Sekarang:
  // Kalau DP: (Setengah Subtotal) + PPN Full
  // Kalau Lunas: Subtotal + PPN Full
  const wajibBayarSekarang =
    paymentType === "dp"
      ? Math.round(subtotalAsli * 0.5) + ppnTetap
      : totalKeseluruhan;

  // Fungsi buat nambah qty
  const updateQty = (id, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id_menu === id
          ? { ...item, qty: Math.max(1, item.qty + amount) }
          : item,
      ),
    );
  };

  // --- TAMBAHKAN INI BIAR TOMBOL HAPUS JALAN ---
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id_menu !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="border-l-4 border-[#cbc500] pl-4 mb-8">
        <h3 className="text-xl font-bold text-[#382E2E] dark:text-white">
          Konfirmasi Pesanan
        </h3>
      </div>

      {/* List menu dan qty */}
      <div className="space-y-4 mb-10">
        {cart.map((item) => (
          <div
            key={item.id_menu}
            className="flex items-center gap-3 bg-white dark:bg-black p-3 rounded-xl border border-gray-100 shadow-sm"
          >
            {/* Gambar Menu */}
            <img
              src={item.url_menu_image}
              className="w-14 h-14 object-cover rounded-lg bg-gray-50 shrink-0"
              alt=""
            />

            {/* Info Menu (Nama & Harga) */}
            <div className="flex-1 min-w-0">
              <h4 className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-md">
                {item.nama_menu}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-[#cbc500] text-left leading-relaxed font-medium text-lg">
                  Rp {(item.harga * item.qty).toLocaleString("id-ID")}
                </p>
                {/* Tombol Hapus Kecil di bawah nama */}
                <button
                  onClick={() => removeItem(item.id_menu)}
                  className="p-1 hover:bg-red-50 rounded-md transition-colors group"
                  title="Hapus"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-red-400 group-hover:text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Counter Mini */}
            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 shrink-0">
              <button
                onClick={() => updateQty(item.id_menu, -1)}
                className="text-left leading-relaxed text-[#382E2E] font-medium text-md w-5 h-5 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-center leading-relaxed text-[#382E2E] font-medium text-md">
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id_menu, 1)}
                className="text-left leading-relaxed text-[#382E2E] font-medium text-md w-5 h-5 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Opsi Pembayaran */}
      <div className="bg-white dark:bg-black border border-gray-100 rounded-2xl p-3 mb-8 space-y-4 shadow-sm text-sm">
        <div className="flex justify-center pl-4 mb-4">
          <h3 className="text-lg font-bold text-[#382E2E] dark:text-white">Opsi Pembayaran</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {/* Opsi DP */}
          <label
            onClick={() => setPaymentType("dp")}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
              paymentType === "dp"
                ? "border-[#cbc500] bg-white/10"
                : "border-white/10 opacity-50"
            }`}
          >
            <input
              type="radio"
              name="pay_type"
              checked={paymentType === "dp"}
              readOnly
              className="radio border-[#cbc500] checked:bg-[#cbc500]"
            />
            <div>
              <p className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-lg">
                DP 50%
              </p>
              <p className="text-left leading-relaxed font-medium text-md text-gray-400">
                Bayar Setengah Dulu
              </p>
            </div>
          </label>

          {/* Opsi Lunas */}
          <label
            onClick={() => setPaymentType("lunas")}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
              paymentType === "lunas"
                ? "border-[#cbc500] bg-white/10"
                : "border-white/10 opacity-50"
            }`}
          >
            <input
              type="radio"
              name="pay_type"
              checked={paymentType === "lunas"}
              readOnly
              className="radio border-[#cbc500] checked:bg-[#cbc500]"
            />
            <div>
              <p className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-lg">
                Bayar Lunas
              </p>
              <p className="text-left leading-relaxed font-medium text-md text-gray-400">
                Langsung Beres
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Total Pembayaran */}
      <div className="p-6 mb-8 space-y-2 text-sm">
        <h4 className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-lg">
          Rincian Invoice
        </h4>

        <div className="flex justify-between text-gray-500 font-medium">
          <span className="leading-relaxed font-medium text-md text-gray-400">
            Subtotal Pesanan
          </span>
          <span className="leading-relaxed font-medium text-md text-gray-400">
            Rp {subtotalAsli.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between text-gray-500 font-medium">
          <span className="leading-relaxed font-medium text-md text-gray-400">
            PPN (10%)
          </span>
          <span className="leading-relaxed font-medium text-md text-gray-400">
            Rp {ppnTetap.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="border-t border-dashed border-gray-200 pt-2 mb-6">
          <div className="flex justify-between text-gray-400 font-medium text-xs mb-2">
            <span className="leading-relaxed font-medium text-md text-gray-400">
              Total Keseluruhan
            </span>
            <span className="leading-relaxed font-medium text-md text-gray-400">
              Rp {totalKeseluruhan.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between font-black text-[#382E2E] text-xl pt-2">
            <span className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-lg">
              Total Bayar
            </span>
            <span className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-lg">
              Rp {wajibBayarSekarang.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {paymentType === "dp" && (
          <p className="leading-relaxed text-red-400 font-medium text-l text-center pt-2 bg-red-50 dark:bg-gray-900 py-3 rounded-lg">
            *Sisa Rp {Math.round(subtotalAsli * 0.5).toLocaleString("id-ID")}{" "}
            bayar di Lyon's Sky
          </p>
        )}
      </div>

      {/* Navigasi */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-gray-400 hover:text-[#382E2E] transition-colors"
        >
          Kembali Menu
        </button>

        <button
          onClick={() => {
            // Hitung sisa di sini sebelum kirim
            const sisa = paymentType === "dp" ? Math.round(subtotalAsli * 0.5) : 0;
            
            // Kirim semua paket lengkapnya
            onNext({ 
              type: paymentType, 
              total: wajibBayarSekarang,
              sisa: sisa 
            });
          }}
          className="font-medium bg-[#382E2E] text-[#cbc500] px-8 py-2.5 rounded-full text-md shadow-md active:scale-95 transition-all tracking-tighter"
        >
          Buat Reservasi
        </button>
      </div>
    </div>
  );
}
