"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import link from "next/link";
import Recaptcha from "react-google-recaptcha";

export default function RegisterPage() {
    const router = useRouter();

    //state input
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ReCAPTCHAValue, setReCAPTCHAValue] = useState<string | null>(null);

    //state error
    const [error, setError] = useState("");

    //handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //1. validasi required (wajib diisi)
            if (!Email || !Password) {
                setError("Email dan Password wajib diisi"); 
                return;
            }

            //2. validasi format email
            const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailpattern.test(Email)) {
                setError("Format email tidak valid");
                return;
            }

            //3. validasi panjang password minimal 6 karakter
            if (Password.length < 6) {
                setError("Password minimal 6 karakter");
                return;
            }

            //4. validasi ReCAPTCHA
            if (!ReCAPTCHAValue) {
                setError("Silahkan verifikasi ReCAPTCHA");
                return;
            }

            //jika lolos
            setError("");
            alert("Register berhasil");
            router.push("/");
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Masuk Akun</h1>
                <p className="text-sm text-gray-500 mt-2">Silahkan login untuk mengakses Dashboard</p>
                </div>
                {error &&(
                    <div className="text-red-500 p-3 rounded-lg text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="bloct text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full  px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan email anda"
                        />
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>        
                        <input
                            type="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full  px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                            placeholder="Masukkan password anda"
                        />
                    </div>

                    {/* Tambahan ReCAPTCHA Disini */}
                    <div className="flex justify-center pt-2"></div>
                    
                    <Recaptcha
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        onChange={(value: string | null) => setReCAPTCHAValue(value)}
                    />
                    <button type="submit" className="w-full px-4 py-4 border border-gray-300 rounded-lg bg-blue-500 text-white">
                        Masuk Sekarang
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Belum punya akun?
                    <a href="/register" className="text-blue-500 hover:underline">
                        Daftar disini
                    </a>
                </p>
            </div>
        </div>
    )
}