"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react"; 
import TableSkeleton from "@/components/TableSkeleton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    kelas: string;
    tanggal_lahir: string;
    role: "Admin" | "Siswa";
}

const dummyUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@sekolah.com`,
    kelas: `Kelas ${((i % 6) + 1)}`,
    tanggal_lahir: `200${i % 10}-0${((i % 9) + 1)}-15`,
    role: i % 3 === 0 ? "Admin" : "Siswa"
}));

const ITEMS_PER_PAGE = 5;

function UsersContent() { // ✅ pisah ke komponen terpisah
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedQR, setSelectedQR] = useState<User | null>(null);

    const [showFilter, setShowFilter] = useState(false);
    const [kelasFilter, setKelasFilter] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [tanggalLahirAwal, setTanggalLahirAwal] = useState<string | null>(null);
    const [tanggalLahirAkhir, setTanggalLahirAkhir] = useState<string | null>(null);

    const [reserfilter, setResetFilter] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncechQuery, setDebounceQuery] = useState("");

    const filteredUsers = dummyUsers.filter((user) => {
        const query = debouncechQuery.toLowerCase();
        const mathQuery =
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.kelas.toLowerCase().includes(query) ||
            user.tanggal_lahir.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query);

        const matchKelas = kelasFilter ? user.kelas === kelasFilter : true;
        const matchRole = roleFilter ? user.role === roleFilter : true;
        const matchTanggalLahir =
            tanggalLahirAwal && tanggalLahirAkhir
                ? user.tanggal_lahir >= tanggalLahirAwal && user.tanggal_lahir <= tanggalLahirAkhir
                : true;
        if (!matchKelas || !matchRole || !matchTanggalLahir) {
            return false;
        }
        return mathQuery;
    });

    const page = Number(searchParams.get("page")) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (page !== 1) { // ✅ page ! == 1 → page !== 1
            router.push(`/users?page=1`);
        }
    }, [debouncechQuery]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [page, debouncechQuery]);

    const handlePageChange = (newPage: number) => {
        router.push(`/users?page=${newPage}`);
    };

    const getQRCodeUrl = (user: User) => {
        const data = `ID: ${user.id}\nNama: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`;
        return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=1000x1000`;
    };

    const handleQRCodeClick = (user: User) => {
        setSelectedQR(user);
    };

    const handleCloseModal = () => {
        setSelectedQR(null);
    };

    const handleResetFilter = () => {
        setKelasFilter(null);
        setRoleFilter(null);
        setTanggalLahirAwal(null);
        setTanggalLahirAkhir(null);
        setResetFilter(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-600">Daftar Users</h1>
                    <Link href="/" className="text-indigo-600 hover:underline text-sm">
                        &larr; Kembali ke Home
                    </Link>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, email, atau role..."
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                const timer = setTimeout(() => {
                                    setDebounceQuery(e.target.value);
                                }, 300);
                                return () => clearTimeout(timer);
                            }}
                        />
                        <button onClick={() => setShowFilter(!showFilter)} className="bg-gray-100 px-4 rounded-md">Filter</button>
                    </div>

                    {showFilter && (
                        <div className="mt-2 mb-6 p-4 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                                    <select
                                        value={kelasFilter || ""}
                                        onChange={(e) => setKelasFilter(e.target.value || null)}
                                    >
                                        <option value="">Semua</option>
                                        {[...Array(6)].map((_, i) => (
                                            <option key={i} value={`Kelas ${i + 1}`}>{`Kelas ${i + 1}`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={roleFilter || ""}
                                        onChange={(e) => setRoleFilter(e.target.value || null)}
                                    >
                                        <option value="">Semua</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Siswa">Siswa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir Awal</label>
                                    <input
                                        type="date"
                                        value={tanggalLahirAwal || ""}
                                        onChange={(e) => setTanggalLahirAwal(e.target.value || null)}
                                        className="block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir Akhir</label>
                                    <input
                                        type="date"
                                        value={tanggalLahirAkhir || ""}
                                        onChange={(e) => setTanggalLahirAkhir(e.target.value || null)}
                                        className="block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <div className="mt-4">
                                        <button
                                            onClick={handleResetFilter}
                                            className="w-full bg-red-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border rounded-lg overflow-hidden min-h-[300px] relative">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase">
                                <tr>
                                    <th className="p-4 border-b">ID</th>
                                    <th className="p-4 border-b">Nama</th>
                                    <th className="p-4 border-b">Email</th>
                                    <th className="p-4 border-b">Kelas</th>
                                    <th className="p-4 border-b">Tanggal Lahir</th>
                                    <th className="p-4 border-b">Role</th>
                                    <th className="p-4 border-b">QR Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <TableSkeleton />
                                ) : (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition border-b last:border-0">
                                            <td className="p-4 font-semibold text-gray-900">{user.id}</td>
                                            <td className="p-4 font-semibold text-gray-900">{user.name}</td>
                                            <td className="p-4 font-semibold text-gray-900">{user.email}</td>
                                            <td className="p-4">{user.kelas}</td>
                                            <td className="p-4">{user.tanggal_lahir}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <img
                                                    src={getQRCodeUrl(user)}
                                                    className="w-10 h-10 cursor-pointer hover:scale-110 transition"
                                                    onClick={() => handleQRCodeClick(user)}
                                                    alt="QR Code"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-gray-500">
                            Halaman <b>{page}</b> dari <b>{totalPages}</b>
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Sebelumnya
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedQR && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseModal}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedQR?.name}</h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-semibold">ID: </span>{selectedQR?.id}</p>
                                <p><span className="font-semibold">Role: </span>{selectedQR?.role}</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img src={getQRCodeUrl(selectedQR)} alt={`QR Code ${selectedQR?.name}`} className="w-80 h-80 rounded-lg" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ✅ export default dibungkus Suspense
export default function UsersPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <UsersContent />
        </Suspense>
    );
}