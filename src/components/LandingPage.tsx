import React from 'react';
import { Users, GraduationCap, Satellite, Compass, ArrowRight, BookOpen, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onSelectStudent: () => void;
  onSelectOperator: () => void;
}

export function LandingPage({ onSelectStudent, onSelectOperator }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-blue-50/50 to-emerald-50/30 flex flex-col font-sans selection:bg-blue-200">
      {/* Top Banner with Geographical Navigation Theme */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-blue-900 block leading-none font-mono">
                GEOEXPLORE
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-tight">
                Geografi SMA Kelas X • Penginderaan Jauh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectOperator}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Akses Operator / Guru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold shadow-2xs">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Geografi Kelas X | Pertemuan 1 | Aktivitas 45 Menit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            <span className="bg-linear-to-r from-blue-700 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              GEOEXPLORE
            </span>
            <br />
            LKPD INTERAKTIF – DETEKTIF CITRA
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-700">
            Topik: <span className="text-blue-700 font-bold">Penginderaan Jauh: Pengenalan Objek pada Citra</span>
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Selamat datang di laboratorium digital Geografi! Bekerjalah bersama 5–6 rekan kelompokmu,
            lakukan investigasi citra satelit Kota Malang, temukan objek-objek geografis tersembunyi,
            dan uji kemampuan analisis visualmu sebagai Detektif Citra.
          </p>
        </div>

        {/* 2 Main Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full mb-12">
          {/* Siswa Card */}
          <div className="bg-white rounded-2xl p-7 border-2 border-blue-200/80 hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-blue-600">
                  Untuk Siswa / Kelompok
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Mengerjakan LKPD
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Pilih nomor kelompok (Kelompok 1 sampai 6), amati citra satelit wilayah yang ditetapkan secara otomatis,
                isi tabel observasi, siapkan bahan presentasi, dan kirimkan hasil pengerjaan ke guru.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>6 anggota kelompok per meja kerja</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Area pengamatan otomatis ditentukan sistem</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Citra resolusi tinggi dengan zoom & pan interaktif</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSelectStudent}
              className="mt-6 w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition group-hover:translate-x-0.5 cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>MASUK SEBAGAI SISWA</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Guru / Operator Card */}
          <div className="bg-white rounded-2xl p-7 border-2 border-emerald-200/80 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">
                  Untuk Guru / Operator
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Dashboard Operator
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Pantau langsung progres pengerjaan 6 kelompok secara real-time, baca tabel observasi siswa,
                berikan penilaian berdasar rubrik 100 poin, tuliskan umpan balik edukatif, dan kelola citra kelompok.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Monitoring realtime 6 kelompok dari Firestore</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Form penilaian rubrik 100 poin & feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Rekap nilai kelas + Ekspor CSV & Cetak PDF</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSelectOperator}
              className="mt-6 w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition group-hover:translate-x-0.5 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>MASUK SEBAGAI OPERATOR/GURU</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">45 Menit Terstruktur</h4>
              <p className="text-[12px] text-slate-500">
                Observasi (5m) • Identifikasi (15m) • Hasil (15m) • Presentasi (10m)
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">6 Wilayah Kota Malang</h4>
              <p className="text-[12px] text-slate-500">
                Alun-Alun Tugu, Ijen, UB, UM, Velodrome, hingga Kedungkandang
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-amber-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Sinkronisasi Cloud Real-time</h4>
              <p className="text-[12px] text-slate-500">
                Pengerjaan tiap kelompok terhubung langsung ke dashboard guru
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Classroom Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            GEOEXPLORE • LKPD Interaktif Penginderaan Jauh Geografi Kelas X SMA
          </p>
          <p className="text-slate-400 text-[11px]">
            Kurikulum Merdeka • Pembelajaran 1 JP (45 Menit) • Kolaborasi 6 Kelompok Siswa
          </p>
        </div>
      </footer>
    </div>
  );
}
