import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
// import { Instagram, MapPin, Star, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default function Beranda() {
  const StarIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="#cbc500" // Warna kuning Lyon's Sky
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  const galleryPhotos = [
    "/gallery/ig-1.jpg",
    "/gallery/ig-2.jpg",
    "/gallery/ig-3.jpg",
    "/gallery/ig-4.jpg",
    "/gallery/ig-5.jpg",
    "/gallery/ig-6.jpg",
  ];

  const customerReviews = [
    {
      name: "Andika Alfambayu",
      text: "Pertama kali kesini, vibesnya bener² bagus, nyaman, dan cocok buat acara ketemuan atau sekedar main, tempatnya cukup luas, banyak tempat duduk juga, yang ga kalah lagi pemandangan dari atas yang cukup bagus, dan café nya juga aesthetic, makanan dan minumannya worth it worth it semua, murah² juga, pelayanannya juga super ramah, apa lagi ada live musicnya jadi ada hiburannya, dan ga ngebosenin cocok buat pelajar, ga bikin dompet kering wkw,  apa lagi disini juga menyediakan wifi gratis jadi ga perlu takut buat yang ga ada sinyal atau kouta.. thanks ya buat lyon's sky dan para staff",
      stars: 5,
    },
    {
      name: "Fira Nur Sabarina",
      text: "Tempat bersih, bagus, aesthetic, instagramable banget buat kamu yang suka foto'. nyaman bangett si kalo untuk nongkrong sama temen-temen. ada outdoor sama indoor. suasananya sejuk karena tempatnya ada di lantai 4 dengan view gunung & kota Banjarnegara. untuk naik ke atas bisa memakai lift atau tangga. pas naik lift takut bgttt pls😔untuk minum sama makanan enakk harganya juga ngga terlalu mahal worth it si untuk nyobain cafe lyon's sky. jangan lupa mampir yaawww",
      stars: 5,
    },
    {
      name: "Fazalulloh Habib",
      text: "Tempatnya indah, terasa klasik dan elegant, semuanya tertata rapi, enak dilihat dan dipandang, suasana nyaman dan tentram serta damai. Sangat direkomendasikan untuk kalian semua yang ingin menikmati arti hidup sebenarnya dengan suasana nyaman dan rasa yang lebih hidup. Harga termasuk terjangkau dan kualitas makanan yang baik, semua terlihat lezat dan nikmat. Layanan nyaman dan maksimal dengan para pekerja yang sangat chill dan nyaman, waiter sangat penting untuk kenyamanan para konsumen, Terimakasih untuk Lyon's Sky Cafe yang telah memberikan semua kenyamanan dalam melayani dan memberikan pelayanan kepada para konsumen.",
      stars: 5,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="h-[80vh] flex items-center px-6 md:px-20 bg-[#382E2E] text-white relative overflow-hidden">
          <div className="z-10">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none mb-6">
              LYON'S SKY <br /> <span className="text-[#cbc500]">CAFE</span>
            </h1>
            <p className="max-w-md text-[18px] font-medium opacity-50 mb-10 leading-loose">
              Grab a mate a brew and plate today to start your week off right!
            </p>
          </div>
          {/* Dekorasi tulisan gede di background */}
          <div className="absolute -right-10 md:-right-20 -bottom-5 md:bottom-0 text-[50vw] md:text-[30vw] font-black italic text-white/5 select-none leading-none pointer-events-none tracking-tighter">
            LYON
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 px-6 md:px-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter border-l-4 border-[#cbc500] pl-6">
              The Story.
            </h2>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed">
              Lyon’s Sky Cafe didirikan pada 22 Januari 2022. Awalnya, tempat
              ini berasal dari ruang kosong di lantai empat rumah keluarga yang
              sebelumnya tidak terpakai. Dari situ muncul ide untuk memanfaatkan
              ruang tersebut menjadi sebuah kafe. Dengan keberanian dan tekad,
              ruang sederhana itu akhirnya diubah menjadi tempat yang nyaman
              dengan konsep yang unik. <br /> <br /> Dari yang awalnya hanya
              sebuah ruang biasa, Lyon’s Sky Cafe perlahan berkembang dan mulai
              dikenal oleh banyak pengunjung. Suasana yang berbeda karena berada
              di lantai atas juga menjadi daya tarik tersendiri. <br /> <br />{" "}
              Pada awal operasional, Lyon’s Sky Cafe hanya memiliki enam orang
              pegawai. Namun seiring berjalannya waktu dan meningkatnya jumlah
              pengunjung, jumlah karyawan pun bertambah. Hal ini menunjukkan
              bahwa Lyon’s Sky Cafe terus berkembang dan semakin diminati.
            </p>
          </div>
          <div className="aspect-square bg-zinc-100 relative overflow-hidden rounded-xl border border-zinc-100">
            <Image
              src="/foto/logo-nobg.png"
              alt="About Lyon's"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Galery Section */}
        <section className="py-24 px-6 md:px-20 text-center">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="text-right">
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                Gallery.
              </h2>
            </div>
            <a
              href="https://www.instagram.com/lyonsky_/"
              target="_blank"
              className="flex items-center gap-2 text-[13px] rounded-md font-semibold tracking-widest border-2 border-[#382E2E] px-6 py-3 hover:bg-[#382E2E] hover:text-white transition-all"
            >
              {/* Ini Icon Instagram Manual SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              @lyonsky_
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryPhotos.map((photo, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-50"
              >
                <Image
                  src={photo}
                  alt={`Lyon's Gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </section>

        {/*Priview Section */}
        <section className="py-24 bg-[#382E2E] text-white px-6 md:px-20 overflow-hidden relative">
          <div className="text-left mb-16 border-l-4 border-[#cbc500] pl-6">
            <h2 className="text-md font-black uppercase text-zinc-300 mb-2">Testimonials</h2>
            <h3 className="text-5xl font-black uppercase tracking-tighter text-[#cbc500]">What They Say.</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {customerReviews.map((rev, i) => (
              <div
                key={i}
                className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm space-y-4"
              >
                <div className="flex text-[#cbc500] gap-1">
                  {[...Array(rev.stars)].map((_, index) => (
                    <StarIcon key={index} />
                  ))}
                </div>
                <p className="text-lg leading-relaxed opacity-70">
                  {rev.text}
                </p>
                <p className="text-md font-bold uppercase">
                  — {rev.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lokasi dan Buka */}
        <section className="py-24 px-6 md:px-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter">
                location.
              </h2>
              <p className="text-lg font-medium flex items-center gap-3">
                Jl. M.T. Haryono No.10, Krandegan, Kec. Banjarnegara, Kab.
                Banjarnegara, Jawa Tengah
              </p>
            </div>
            <div className="space-y-4 border-l-2 border-zinc-100 pl-8">
              <div className="flex items-center gap-3">
                <p className="text-xl font-semibold ">
                  Open
                </p>
              </div>
              <p className="text-lg font-medium">09:00 — 00:00</p>
            </div>
            <a
              href="https://www.google.com/maps/place/Lyon's+Sky+Cafe/@-7.395204,109.6997666,17.07z/data=!4m6!3m5!1s0x2e7aa90c38a64e59:0x8bea6e9fd018ff6c!8m2!3d-7.3942595!4d109.6990763!16s%2Fg%2F11pd_x4x_k?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              className="inline-block bg-[#382E2E] text-white px-8 py-4 text-md font-medium rounded-xs hover:bg-black transition-all"
            >
              Buka di Google Maps
            </a>
          </div>
          <div className="h-[400px] bg-zinc-200 rounded-3xl overflow-hidden relative shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.882414704381!2d109.69650137586542!3d-7.394254172801456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa20c38a64e59%3A0xabeadf9fd018ff6c!2sLyon&#39;s%20Sky%20Cafe!5e0!3m2!1sid!2sid!4v1715000000000!5m2!1sid!2sid"
              className="w-full h-full invert border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}