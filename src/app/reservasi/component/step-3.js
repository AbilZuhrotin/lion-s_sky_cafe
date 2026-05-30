"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function StepThree({ cart, setCart, onNext }) {
  const [menu, setMenu] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // 1. Ambil Data Menu dari Supabase
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from("menu").select("*");
      if (!error) setMenu(data);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  // 2. Logika Filter & Kategori
  const daftarKategori = ["Semua", ...new Set(menu.map((item) => item.pilih_menu))];
  const menuFiltered = filter === "Semua" 
    ? menu 
    : menu.filter((item) => item.pilih_menu === filter);

  // 3. Logika Keranjang
  const addToCart = (item) => {
    setCart((prev) => {
      const isExist = prev.find((i) => i.id_menu === item.id_menu);
      if (isExist) {
        return prev.map((i) => i.id_menu === item.id_menu ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const totalHarga = cart.reduce((acc, curr) => acc + curr.harga * curr.qty, 0);
  const totalItem = cart.reduce((acc, curr) => acc + curr.qty, 0);

  if (loading) return <div className="text-center py-20 font-bold">Memuat Menu Lyon's Sky...</div>;

  return (
    <main className="max-w-6xl mx-auto px-2 md:px-4 py-8 pb-32">
      {/* Subjudul */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#382E2E] dark:text-white uppercase tracking-tighter">Daftar Menu</h2>
        <div className="h-1.5 w-16 bg-[#cbc500] mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Filter Kategori */}
      <div className="w-full mb-10 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide py-4">
          <div className="flex gap-3 md:mx-auto px-4">
            {daftarKategori.map((kat) => (
              <button
                key={kat}
                onClick={() => setFilter(kat)}
                className={`px-6 py-2.5 rounded-full leading-relaxed text-[#382E2E] font-medium text-xs md:text-base tracking-wider transition-all border whitespace-nowrap ${
                  filter === kat
                    ? "bg-[#382E2E]  text-[#cbc500] dark: border-[#382E2E]"
                    : "bg-white dark:bg-black text-gray-400 dark:text-white border-gray-100 hover:border-[#cbc500]"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
        {menuFiltered.map((item) => (
          <div key={item.id_menu} className="bg-white dark:bg-black rounded-sm border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all">
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <span className="absolute top-2 left-2 z-10 bg-[#cbc500]/90 backdrop-blur-sm leading-relaxed text-[#382E2E] font-medium text-xs md:text-base px-2 py-1 rounded-full">
                {item.kategori}/{item.pilih_menu}
              </span>
              <img
                src={item.url_menu_image}
                alt={item.nama_menu}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="p-2.5 md:p-5 flex flex-col flex-1">
              <h4 className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-md">
                {item.nama_menu}
              </h4>
              <p className="text-left leading-relaxed text-[#cbc500] font-medium text-xl">
                Rp {item.harga.toLocaleString("id-ID")}
              </p>
              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => addToCart(item)}
                  className="w-11 bg-[#f3f0e1] dark:bg-black dark:border-2 hover:bg-[#382E2E] hover:text-[#cbc500] text-[#382E2E] py-2 md:py-3 rounded-full flex items-center justify-center transition-all shadow-sm"
                >
                  <span className="text-sm font-black dark:text-white">+</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Checkout Bar */}
      {totalItem > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-100 animate-in slide-in-from-bottom duration-500">
          <div className="bg-[#382E2E] p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-[#cbc500]/20 backdrop-blur-md">
            <div className="flex items-center gap-3 pl-2 text-white">
              <div>
                <p className="text-[#cbc500] font-black text-md">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-400 font-semibold tracking-widest">
                  Total Pesanan
                </p>
              </div>
            </div>
            <div>
              <div className="relative">
                <span className="absolute -top-2 -right-2 bg-[#ffffff] text-[#382E2E] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItem}
                </span>
              </div>
              <button 
              onClick={onNext}
              className="bg-[#cbc500] text-[#382E2E] px-8 py-3 rounded-2xl font-black text-sm tracking-tighter shadow-lg active:scale-95 transition-all">
                Checkout Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}