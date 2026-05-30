import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function StepOne({ onNext }) {
  return (
    <main>
      <Navbar />
      {/* BANNER */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-14">
        {/* Banner Foto Reservasi */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          {/* Foto Banner */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner-reservasi.png" //
              alt="Banner Lyon's Sky Cafe"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Overlay Kuning */}
          <div className="absolute inset-0 z-10 bg-[#cbc500] opacity-60"></div>
          {/* Teks Center */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-5xl md:text-5xl font-extrabold text-[#382E2E] tracking-tight">
              Reservasi
            </h1>
            <p className="mt-2 text-lg md:text-2xl font-bold text-[#382E2E]/90">
              Lyon's Sky Cafe
            </p>
          </div>
        </div>
      </div>


      {/* RULES */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Pembungkus subjudul */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-[#382E2E] dark:text-white">Syarat & Ketentuan Reservasi</h2>
          <div className="h-1 w-20 bg-[#cbc500] mx-auto mt-2 rounded-full"></div>
        </div>
        {/* Pembungkus rule */}
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {/* Rule 1 */}
          <div className="bg-white dark:bg-black border border-gray-200 shadow-sm rounded-2xl flex items-start p-5 gap-4 w-full h-full transition-all hover:shadow-md">
            <div className="text-black dark:text-white mt-1 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <span className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-md md:text-base">
              Reservasi untuk keep tanggal dan meja melakukan pembayaran uang muka sebesar 50% dari pesanan
            </span>
          </div>
          {/* Rule 2 */}
          <div className="bg-white dark:bg-black border border-gray-200 shadow-sm rounded-2xl flex items-start p-5 gap-4 w-full h-full transition-all hover:shadow-md">
            <div className="text-black dark:text-white mt-1 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <span className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-sm md:text-base">
              Apabila reservasi dibatalkan, uang muka tidak dapat dikembalikan
            </span>
          </div>
          {/* Rule 3 */}
          <div className="bg-white dark:bg-black border border-gray-200 shadow-sm rounded-2xl flex items-start p-5 gap-4 w-full h-full transition-all hover:shadow-md">
            <div className="text-black dark:text-white mt-1 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <span className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-sm md:text-base">
              Batas akhir pembatalan reservasi dilayani sampai H-1 keep tanggal
            </span>
          </div>
          {/* Rule 4 */}
          <div className="bg-white dark:bg-black border border-gray-200 shadow-sm rounded-2xl flex items-start p-5 gap-4 w-full h-full transition-all hover:shadow-md">
            <div className="text-black dark:text-white mt-1 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <span className="text-left leading-relaxed text-[#382E2E] dark:text-white font-medium text-sm md:text-base">
              Informasi lebih lanjut bisa menghubungi admin Lyon's +62 851-6260-1067
            </span>
          </div>
        </div>
      </div>

    {/* TUTORIAL */}
      {/* <div className="max-w-5xl mx-auto px-6 py-2">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#382E2E] dark:text-white">Tutorial Reservasi</h2>
          <div className="h-1 w-20 bg-[#cbc500] mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
            controls
          >
            <source src="URL_VIDEO_DARI_SUPABASE_KAMU" type="video/mp4" />
            Browser kamu tidak mendukung tag video.
          </video>
        </div>
      </div> */}

    {/* CTA Ke FORMULIR */}
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-20">
      <div className="group relative overflow-hidden rounded-3xl bg-[#cbc500] p-8 md:p-12 shadow-lg transition-all hover:shadow-2xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl transition-all group-hover:scale-150"></div>
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#382E2E]/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#382E2E]">
              Sudah Paham Reservasinya?
            </h3>
            <p className="mt-2 text-[#382E2E]/80 font-medium">
              Yuk, reservasi di Lyon's Sky sekarang!
            </p>
          </div>

          <button 
          onClick={onNext}
          className="btn border-none bg-[#382E2E] text-[#cbc500] hover:bg-[#2a2222] px-7 py-4 rounded-full text-lg font-bold shadow-md transition-all active:scale-95">
            Reservasi Now
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </main>
  );
}
