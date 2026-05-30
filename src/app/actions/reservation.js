'use server'
import { createClient } from '@/utils/supabase/server'

export async function simpanReservasi(dataForm, cartItems) {
  const supabase = await createClient()
  const namaDepan = dataForm.nama ? dataForm.nama.split(' ')[0] : 'Abil';

  // 1. Fungsi Konversi Jam (Biar akurat dibandingin)
  const jamKeMenit = (s) => {
    if (!s) return 0;
    const [h, m] = s.split(':').map(Number);
    return (h * 60) + m;
  };

  const baruD = jamKeMenit(dataForm.jamDatang);
  const baruK = jamKeMenit(dataForm.jamKeluar);

  console.log(`--- CEK BENTROK UNTUK ${namaDepan} ---`);
  console.log(`Input: Meja ${dataForm.meja}, Jam ${dataForm.jamDatang}-${dataForm.jamKeluar}`);

  // 2. AMBIL DATA DARI DATABASE
  // Pastikan kolom 'nomor_meja' sudah kamu buat di tabel 'reservasi' ya Bil!
  const { data: listLama, error: errCek } = await supabase
    .from('reservasi')
    .select('nomor_meja, jam_datang, jam_keluar, status_reservasi')
    .eq('tgl_reservasi', dataForm.tanggal)
    .in('status_reservasi', ['proses', 'konfirmasi']);

  if (errCek) {
    console.error("Gagal ambil data DB:", errCek.message);
  }

  // 3. PROSES PENGECEKAN
  if (listLama && listLama.length > 0) {
    console.log(`Ditemukan ${listLama.length} data pembanding di tanggal yang sama.`);

    const bentrok = listLama.some((res, index) => {
      const lamaD = jamKeMenit(res.jam_datang);
      const lamaK = jamKeMenit(res.jam_keluar);
      
      // Rumus Overlap Jam
      const jamTabrakan = (baruD < lamaK && baruK > lamaD);
      
      // Cek Meja (Kita asumsikan nomor_meja di DB isinya string seperti "1, 2")
      const mejaLamaArr = res.nomor_meja ? res.nomor_meja.split(',').map(m => m.trim()) : [];
      const mejaSama = dataForm.meja.some(m => mejaLamaArr.includes(m.toString()));

      console.log(`Data #${index + 1}: Jam Tabrakan? ${jamTabrakan} | Meja Sama? ${mejaSama}`);

      return jamTabrakan && mejaSama;
    });

    if (bentrok) {
      console.log("KESIMPULAN: BENTROK! Akses ditolak.");
      return { 
        success: false, 
        message: `Waduh ${namaDepan}, sepertinya satu atau beberapa meja yang kamu pilih sudah ada yang booking di jam segitu. Coba pilih meja atau jam lain ya!` 
      };
    }
  }

  if (dataForm.metode === 'cek_doang') {
    return { success: true };
  }
  console.log("KESIMPULAN: AMAN. Lanjut simpan data.");

  // 4. SIMPAN DATA (Pastikan kolom nomor_meja diisi)
  try {
    const { data: cust } = await supabase.from('customer').insert([{ nama_pelanggan: dataForm.nama, nomor_wa: dataForm.wa }]).select().single();
    
    // 4. SIMPAN DATA
    const { data: resBaru, error: errSimpan } = await supabase.from('reservasi').insert([{
      id_customer: cust.id_customer,
      tgl_reservasi: dataForm.tanggal,
      jam_datang: dataForm.jamDatang,
      jam_keluar: dataForm.jamKeluar,
      jumlah_orang: dataForm.jumlahOrang,
      total_bayar: dataForm.totalBayar,
      jenis_pembayaran: dataForm.metode,
      sisa_bayar: dataForm.sisaBayar,
      nomor_meja: dataForm.meja.join(', '),
      status_reservasi: 'proses',
      // TAMBAHKAN BARIS INI BIL:
      jenis_pembayaran: dataForm.metode // Ambil dari dataForm
    }]).select().single();

    if (errSimpan) throw errSimpan;

    // Simpan Menu
    const detailMenu = cartItems.map(item => ({
      id_reservasi: resBaru.id_reservasi,
      id_menu: item.id_menu,
      qty: item.qty,
      subtotal: item.harga * item.qty
    }));
    await supabase.from('detail_reservasi').insert(detailMenu);

    return { success: true, id: resBaru.id_reservasi };
  } catch (e) {
    return { success: false, message: "Gagal simpan: " + e.message };
  }
}