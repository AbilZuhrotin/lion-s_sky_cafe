"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/client";
import { Wifi, Toilet, Plug, Building2, MoonStar } from "lucide-react";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const supabase = createClient();

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await supabase.from("menu").select("*");
      if (data) setMenu(data);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  // Fasilitas: 5 Item, Tanpa Desc
  const fasilitas = [
    { name: "Free Wi-Fi", icon: Wifi },
    { name: "Toilet", icon: Toilet },
    { name: "Musholla", icon: MoonStar },
    { name: "Stopkontak", icon: Plug },
    { name: "Rooftop View", icon: Building2 },
  ];

  const daftarKategori = [
    "Semua",
    ...new Set(menu.map((item) => item.pilih_menu)),
  ];
  const filteredMenu = menu.filter((item) =>
    filter === "Semua" ? true : item.pilih_menu === filter,
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenu.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white font-sans pt-20">
        {/* BANNER */}
        <section className="relative w-full h-64 md:h-80 overflow-hidden">
          <Image
            src="/banner-reservasi.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#cbc500] opacity-60"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#382E2E] tracking-tight">
              Menu & Fasilitas
            </h1>
            <p className="mt-2 text-lg md:text-2xl font-bold text-[#382E2E]/90">
              Lyon's Sky
            </p>
          </div>
        </section>

        {/* SECTION FASILITAS (5 Items, No Desc) */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-5xl font-bold text-[#382E2E] text-center pb-5 dark:text-white">
            Fasilitas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {fasilitas.map((f, i) => {
              // 1. Ambil iconnya dan simpan di variabel Awalan Kapital
              const IconLayanan = f.icon;

              return (
                <div
                  key={i}
                  className="p-6 border border-zinc-100 rounded-2xl text-center hover:bg-zinc-50 transition-all flex flex-col items-center justify-center gap-3"
                >
                  {/* 2. Panggil sebagai komponen <IconLayanan /> */}
                  <IconLayanan size={24} className="text-[#382E2E]" />
                  <h4 className="text-xs font-semibold text-[#382E2E] leading-tight">
                    {f.name}
                  </h4>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION MENU */}
        <section className="bg-zinc-50 py-16 px-6 md:px-20 border-t border-zinc-100">
          <div className="max-w-7xl mx-auto">
            {/* DROPDOWN FILTER */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-5xl font-bold text-[#382E2E] text-center dark:text-white">
                Menu
              </h2>
              <select
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-32 md:w-64 bg-white border-2 border-[#382E2E] px-4 py-3 rounded-xl font-black text-xs outline-none focus:ring-2 ring-[#cbc500] cursor-pointer"
              >
                {daftarKategori.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="py-20 text-center font-black uppercase text-xs tracking-widest text-zinc-300">
                Wait...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {currentItems.map((item) => (
                    <div
                      key={item.id_menu}
                      className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-2xl transition-all"
                    >
                      <div className="relative aspect-square overflow-hidden bg-zinc-100">
                        <img
                          src={item.url_menu_image}
                          alt={item.nama_menu}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {/* Kategori Badge di Pojok */}
                        <div className="absolute top-4 right-4 bg-[#cbc500] text-medium text-md font-medium px-3 py-1 rounded-full">
                          {item.pilih_menu}
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <h4 className="text-md font-medium text-[#cbc500] mb-2 truncate">
                          {item.nama_menu}
                        </h4>
                        {/* Harga di Bawah */}
                        <p className="text-lg font-black italic text-[#382E2E]">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${currentPage === 1 ? "bg-zinc-100 text-zinc-300 border-none" : "bg-white border-2 border-[#382E2E] text-[#382E2E] hover:bg-zinc-100"}`}
                    >
                      Prev
                    </button>
                    <span className="font-black text-[10px] uppercase tracking-widest text-zinc-300">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${currentPage === totalPages ? "bg-zinc-100 text-zinc-300 border-none" : "bg-[#382E2E] text-[#cbc500] hover:scale-105"}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
