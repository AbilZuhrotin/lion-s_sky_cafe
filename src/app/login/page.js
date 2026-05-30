"use client"
import Image from "next/image";
import { useState } from "react";
import { createClient } from '@/utils/supabase/client'; 
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Mencoba login untuk:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), // Tambahkan trim biar nggak ada spasi nyelip
        password: password,
      });

      if (error) {
        console.error("Error dari Supabase:", error.message);
        // Kalo error, Swal HARUS muncul
        await Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'Email atau Password salah. Coba cek lagi!',
          confirmButtonColor: '#382E2E',
        });
      } else if (data.user) {
        console.log("Login Berhasil!", data.user);
        // Maksa pindah pake window location biar gak rewel
        window.location.href = '/admin';
      }
    } catch (err) {
      console.error("Sistem Error:", err);
      alert("Ada masalah sistem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-200 font-sans dark:bg-black">
      <div>
        <form 
        onSubmit={handleLogin}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <div className="flex justify-center">
            <Image
              className="dark:invert object-center"
              src="/foto/logo-nobg.png"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </div>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              className="input validator"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>

          <label className="fieldset">
            <span className="label">Password</span>
            <input
              type="password"
              className="input validator"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="validator-hint hidden">Required</span>
          </label>

          <button 
            className={`btn btn-warning mt-4 w-full ${loading ? 'loading' : ''}`} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sabar ya...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
