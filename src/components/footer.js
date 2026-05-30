export default function Footer() {
  const currentYear = new Date().getFullYear();
  const adminNumber = process.env.NEXT_PUBLIC_KONFIRMASI_PEMBAYARAN; 

  return (
    <footer className="bg-[#382E2E] text-white py-20 px-6 md:px-20 font-sans border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        
        {/* 1. BRAND & ADDRESS */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
              Lyon's <span className="text-[#cbc500]">Sky.</span>
            </h2>
          </div>
          <div className="space-y-4 text-[11px] font-medium tracking-widest leading-relaxed text-white/60">
            <p>
              Jl. M.T. Haryono No.10, Krandegan,<br />
              Kec. Banjarnegara, Kab. Banjarnegara,<br />
              Jawa Tengah
            </p>
            <p className="text-[#cbc500]">Open Daily: 09:00 — 00:00</p>
          </div>
        </div>

        {/* 2. QUICK LINKS */}
        <div className="space-y-6 md:pl-20">
          <h4 className="text-[16px] font-bold text-white/30 ">Navigation</h4>
          <ul className="space-y-4 text-[13px] font-medium">
            <li><a href="/" className="hover:text-[#cbc500] transition-colors">Beranda</a></li>
            <li><a href="/menu" className="hover:text-[#cbc500] transition-colors">Menu & Fasilitas</a></li>
            <li><a href="/reservasi" className="hover:text-[#cbc500] transition-colors">Reservasi</a></li>
          </ul>
        </div>

        {/* 3. SOCIALS & CALL TO ACTION */}
        <div className="space-y-6">
          <h4 className="text-[16px] font-bold text-white/30">Stay Connected</h4>
          <div className="flex gap-4">
            {/* Instagram Icon */}
            <a href="https://instagram.com/lyonsky_" target="_blank" className="p-3 border border-white/10 hover:bg-white hover:text-[#382E2E] transition-all duration-500 rounded-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            {/* WhatsApp Icon */}
            <a 
              href={`https://wa.me/${adminNumber}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 border border-white/10 hover:bg-white hover:text-[#382E2E] transition-all duration-500 rounded-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
          © {currentYear} Lyon's Sky Cafe Banjarnegara.
        </p>
        <div className="flex gap-6">
           {/* <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em]">Designed by Informatics Student</p> */}
        </div>
      </div>
    </footer>
  );
}