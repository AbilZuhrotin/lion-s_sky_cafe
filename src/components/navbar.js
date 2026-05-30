"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Icon Hamburger & Close Manual SVG
  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <nav className="fixed top-0 w-full z-[999] bg-white/90 backdrop-blur-md border-b border-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1">
            <Image src="/foto/logo-nobg.png" alt="Logo" width={75} height={75} priority />
          </div>
          <span className="text-sm font-black italic uppercase tracking-tighter text-[#382E2E] hidden xs:block">
            Lyon's Sky
          </span>
        </Link>
        
        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-10 text-[14px] font-bold items-center text-[#382E2E]">
          <Link href="/" className="hover:text-[#cbc500] transition-colors">Beranda</Link>
          <Link href="/menu" className="hover:text-[#cbc500] transition-colors">Menu & Fasilitas</Link>
          <Link href="/reservasi" className="bg-[#382E2E] text-white px-6 py-3 rounded-md hover:bg-[#cbc500] hover:text-[#382E2E] transition-all shadow-xl shadow-zinc-200">
            Reservasi
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button 
          className="md:hidden p-2 text-[#382E2E] active:scale-90 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div className={`
        absolute top-[100%] left-0 w-full bg-white border-b border-zinc-100 shadow-xl transition-all duration-300 ease-in-out md:hidden
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
      `}>
        <div className="flex flex-col p-8 gap-6 text-center text-[11px] font-black uppercase tracking-[0.3em]">
          <Link href="/" onClick={() => setIsOpen(false)} className="py-2 border-b border-zinc-50">Beranda</Link>
          <Link href="/menu" onClick={() => setIsOpen(false)} className="py-2 border-b border-zinc-50">Menu & Fasilitas</Link>
          <Link href="/reservasi" onClick={() => setIsOpen(false)} className="bg-[#382E2E] text-white py-4 rounded-xl shadow-lg">
            Reservasi
          </Link>
        </div>
      </div>
    </nav>
  );
}