"use client";
import Image from "next/image";
import { useState } from "react";
import { simpanReservasi } from "@/app/actions/reservation";
import Swal from 'sweetalert2';

export default function StepTwo({ onNext, onBack }) {
    // State untuk menampung input user
    const [localData, setLocalData] = useState({
        nama: '', 
        wa: '62',
        tanggal: '', 
        jamDatang: '', 
        jamKeluar: '', 
        jumlahOrang: '', 
        meja: []
    });

    // Fungsi validasi WA (Hanya Angka & Tetap ada 62)
    const handleWAChange = (e) => {
        const val = e.target.value;
        // Hanya izinkan angka dan pastikan tidak menghapus '62'
        if (/^\d*$/.test(val) && val.startsWith('62')) {
            setLocalData({ ...localData, wa: val });
        } else if (val === '' || val === '6') { 
            // Cegah user hapus total, kembalikan ke 62
            setLocalData({ ...localData, wa: '62' });
        }
    };

    const handleOrangChange = (e) => {
        const val = e.target.value;
        
        // 1. Kalau inputnya kosong (dihapus semua), bolehin dulu biar user gak bingung
        if (val === '') {
            setLocalData({ ...localData, jumlahOrang: '' });
            return;
        }

        // 2. Ubah ke angka
        const numVal = parseInt(val);

        // 3. Hanya update kalau angkanya positif
        if (numVal > 0) {
            setLocalData({ ...localData, jumlahOrang: numVal.toString() });
        }
    };

    // Ambil tanggal hari ini untuk membatasi kalender (min date)
    const today = new Date().toISOString().split('T')[0];

    const handleLanjut = async () => { // Tambahkan 'async' di sini
        // 1. Validasi field wajib diisi semua
        if (!localData.nama || !localData.tanggal || !localData.jamDatang || !localData.jamKeluar || !localData.jumlahOrang) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Belum Lengkap',
            text: 'Waduh, isi dulu semua datanya ya, jangan ada yang kosong!',
            confirmButtonColor: '#382E2E',
        });
        return;
    }

        const namaDepan = localData.nama ? localData.nama.split(' ')[0] : 'Kak';
        
        // Ambil angka jam & menit untuk Datang
        const [jamD, menitD] = localData.jamDatang.split(':').map(Number);
        const totalMenitDatang = (jamD * 60) + menitD;

        // Ambil angka jam & menit untuk Keluar
        const [jamK, menitK] = localData.jamKeluar.split(':').map(Number);
        const totalMenitKeluar = (jamK * 60) + menitK;

        const menitBuka = 9 * 60;   // 09:00
        const menitTutup = 24 * 60; // 00:00

        // 2. CEK JAM DATANG (Aturan Kafe)
        if (totalMenitDatang < menitBuka) {
            Swal.fire({
                icon: 'warning',
                title: `Belum ${namaDepan}!`,
                text: `Lyon's Sky belum buka, ${namaDepan}! Kita buka jam 09.00 pagi.`,
                confirmButtonColor: '#382E2E',
            });
            return;
        }

        // 3. CEK JAM KELUAR (Anti-Tembus jam subuh)
        if (totalMenitKeluar < menitBuka && totalMenitKeluar !== 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tutup!',
                text: `${namaDepan}, jam segitu kita udah tutup. Lyon's tutup jam 00.00 malam.`,
                confirmButtonColor: '#382E2E',
            });
            return;
        }

        // 4. CEK LOGIKA: Jam Keluar harus setelah Jam Datang
        const totalMenitKeluarFix = totalMenitKeluar === 0 ? 1440 : totalMenitKeluar;
        
        if (totalMenitKeluarFix <= totalMenitDatang) {
            Swal.fire({
                icon: 'warning',
                title: 'Nggak salah Jamnya?',
                text: `Masa pulangnya lebih cepet daripada datangnya si, ${namaDepan}? Coba lagi jamnya!`,
                confirmButtonColor: '#382E2E',
            });
            return;
        }

        // 5. VALIDASI JUMLAH ORANG
        const jmlOrang = parseInt(localData.jumlahOrang);
        if (!localData.jumlahOrang || jmlOrang <= 0) {
            alert("Jumlah orang minimal 1 ya!");
            return;
        }

        // 6. --- PINDAHIN PENGECEKAN KE SINI ---
        // Kita panggil fungsi simpan yang sudah kamu buat tadi
        const result = await simpanReservasi({
            ...localData,
            metode: 'cek_doang' // Ini kode rahasia biar dia cuma ngecek, gak nyimpen
        }, []); 

        // Kalau hasilnya gagal (bentrok), munculin alert di Step 2 ini!
        if (result.success === false) {
        // PAKAI SWEETALERT DI SINI BIL!
        Swal.fire({
            icon: 'error',
            title: 'Meja Tidak Tersedia',
            text: result.message, // Ini bakal ngambil pesan dari reservation.js tadi
            confirmButtonColor: '#382E2E',
            confirmButtonText: 'Cek Meja Lain'
        });
        return; 
    }

        // 7. Kalau aman, baru boleh lanjut
        onNext(localData);
    };

    const handleMejaChange = (noMeja) => {
        setLocalData(prev => {
            const isSelected = prev.meja.includes(noMeja);
            if (isSelected) {
                return { ...prev, meja: prev.meja.filter(m => m !== noMeja) };
            } else {
                return { ...prev, meja: [...prev.meja, noMeja] };
            }
        });
    };

    const preventMinus = (e) => {
        if (e.code === 'Minus' || e.key === '-') {
            e.preventDefault();
        }
    };

    return (
        <main>
            <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500 space-y-10">
                
                {/* --- FORM DATA DIRI --- */}
                <div className="bg-white dark:bg-black p-6 md:p-8 rounded-lg border border-gray-100 shadow-xl">
                    <div className="border-l-4 border-[#cbc500] pl-4 mb-8">
                        <h3 className="text-xl font-bold text-[#382E2E] dark:text-white">Data Reservasi</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="w-full">
                            <label className="text-sm font-medium text-black">Nama Pemesan</label>
                            <input 
                                type="text" 
                                value={localData.nama}
                                onChange={(e) => setLocalData({...localData, nama: e.target.value})}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 text-black border-none focus:ring-2 focus:ring-[#cbc500]" 
                                placeholder="Nama lengkap" 
                            />
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium text-black">Nomor WhatsApp</label>
                            <div className="relative">
                                <input 
                                    type="tel" 
                                    value={localData.wa}
                                    onChange={handleWAChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 text-black border-none focus:ring-2 focus:ring-[#cbc500]" 
                                    placeholder="628123456789" 
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-2">*Nomer wa ditulis pake awalan 62 ya</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-medium text-black">Tanggal</label>
                                <input 
                                    type="date" 
                                    min={today}
                                    value={localData.tanggal}
                                    onChange={(e) => setLocalData({...localData, tanggal: e.target.value})}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 text-black border-none focus:ring-2 focus:ring-[#cbc500]" 
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-black">Jam Datang</label>
                                <input 
                                    type="time"
                                    value={localData.jamDatang}
                                    onChange={(e) => setLocalData({...localData, jamDatang: e.target.value})}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 text-black border-none focus:ring-2 focus:ring-[#cbc500]" 
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-black">Jam Keluar</label>
                                <input 
                                    type="time" 
                                    value={localData.jamKeluar}
                                    onChange={(e) => setLocalData({...localData, jamKeluar: e.target.value})}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 text-black border-none focus:ring-2 focus:ring-[#cbc500]" 
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium text-black">Jumlah Orang</label>
                            <input 
                                type="number" 
                                min="1"
                                placeholder="Contoh: 2"
                                onKeyDown={preventMinus} // Tetap pakai preventMinus yang tadi ya
                                value={localData.jumlahOrang}
                                onChange={handleOrangChange}
                                onBlur={() => {
                                    // Pas klik di luar input, kalau masih kosong, set jadi 1
                                    if (localData.jumlahOrang === '') {
                                        setLocalData({ ...localData, jumlahOrang: '1' });
                                    }
                                }}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 text-black border-none focus:ring-2 focus:ring-[#cbc500]" 
                            />
                        </div>
                    </div>
                </div>

                {/* --- PILIH MEJA --- */}
                <div className="bg-white dark:bg-black p-6 md:p-8 rounded-lg border border-gray-100 shadow-xl">
                    <div>
                        <div className="border-l-4 border-[#cbc500] pl-4 mb-6">
                        <h3 className="text-xl font-bold text-[#382E2E] dark:text-white">Pilih Meja</h3>
                    </div>
                        <img
                            src="denah-lyon's.png"
                            alt="Denah meja lyon'"
                            className="w-full h-full object-cover pb-5"
                        />
                    </div>


                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        {[...Array(21)].map((_, i) => {
                            const no = i + 1;
                            return (
                                <label key={i} className="cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="peer hidden" 
                                        checked={localData.meja.includes(no)}
                                        onChange={() => handleMejaChange(no)}
                                    />
                                    <div className="w-full py-4 rounded-2xl border-2 border-gray-100 flex flex-col items-center justify-center transition-all peer-checked:border-[#cbc500] peer-checked:bg-[#cbc500]/10 text-black dark:text-white">
                                        <span className="text-xs">No</span>
                                        <span className="font-bold">{no}</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* --- NAVIGASI --- */}
                <div className="flex items-center justify-between gap-4 pt-6">
                    <button onClick={onBack} className="text-sm font-medium text-gray-400">Kembali</button>
                    <button 
                        onClick={handleLanjut} 
                        className="font-medium bg-[#382E2E] text-[#fef600] px-8 py-2.5 rounded-full shadow-md active:scale-95 transition-all"
                    >
                        Lanjut 
                    </button>
                </div>
            </div>
        </main>
    );
}