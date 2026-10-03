import React, { useState } from 'react';
import {
  Sun,
  Cloud,
  Eye,
  Radio,
  Database,
  FileSpreadsheet,
  Plane,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Satellite,
  Compass,
  Building,
  Trees,
  Waves,
  Zap,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface StepMaterialProps {
  onPrev: () => void;
  onNext: () => void;
}

export function StepMaterial({ onPrev, onNext }: StepMaterialProps) {
  const [activeIllustrationTab, setActiveIllustrationTab] = useState<'system' | 'platforms' | 'objects'>('system');

  const workflowSteps = [
    {
      title: 'Sumber Energi',
      icon: Sun,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      desc: 'Matahari (sistem pasif) atau gelombang buatan (sistem aktif) yang memancarkan tenaga elektromagnetik.'
    },
    {
      title: 'Atmosfer',
      icon: Cloud,
      color: 'from-sky-400 to-blue-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      desc: 'Media transmisi yang menyerap, memantulkan, dan meneruskan gelombang melalui jendela atmosfer.'
    },
    {
      title: 'Objek',
      icon: Eye,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      desc: 'Kenampakan permukaan bumi yang diamati (vegetasi, bangunan, jalan, air, lahan terbuka).'
    },
    {
      title: 'Sensor & Wahana',
      icon: Radio,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      desc: 'Alat perekam (sensor) yang dibawa wahana seperti drone, pesawat udara, atau satelit antariksa.'
    },
    {
      title: 'Data / Citra',
      icon: Database,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      desc: 'Hasil perekaman permukaan bumi berupa citra foto udara atau citra satelit multispektral.'
    },
    {
      title: 'Informasi',
      icon: FileSpreadsheet,
      color: 'from-rose-400 to-red-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      desc: 'Hasil interpretasi kenampakan visual objek untuk perencanaan wilayah, tata kota, & mitigasi.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Card Ingat Kembali! */}
      <div className="bg-linear-to-r from-blue-900 via-sky-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Lightbulb className="w-4 h-4" />
          <span>Konsep Esensial Geografi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ingat Kembali!
        </h2>
        <p className="mt-3 text-sm sm:text-base text-sky-100 leading-relaxed max-w-3xl">
          <strong className="text-white font-semibold">Penginderaan jauh</strong> adalah ilmu, seni, dan teknik untuk memperoleh informasi mengenai objek, daerah, atau fenomena tanpa melakukan kontak langsung dengan objek tersebut menggunakan sensor.
        </p>
      </div>

      {/* ================= ILUSTRASI PENDUKUNG MATERI ================= */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Ilustrasi Edukatif Pendukung
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Visualisasi Konsep Penginderaan Jauh
            </h3>
            <p className="text-xs text-slate-500">
              Pilih tab di bawah untuk melihat diagram kerja sistem, jenis wahana pembawa sensor, dan ciri visual objek.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
            <button
              type="button"
              onClick={() => setActiveIllustrationTab('system')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeIllustrationTab === 'system'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Skema Sistem
            </button>
            <button
              type="button"
              onClick={() => setActiveIllustrationTab('platforms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeIllustrationTab === 'platforms'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              3 Wahana
            </button>
            <button
              type="button"
              onClick={() => setActiveIllustrationTab('objects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeIllustrationTab === 'objects'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Kenampakan Objek
            </button>
          </div>
        </div>

        {/* Tab 1: Skema Sistem SVG Interaktif */}
        {activeIllustrationTab === 'system' && (
          <div className="space-y-4">
            <div className="relative bg-linear-to-b from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white overflow-hidden border border-slate-700">
              {/* Stars & Orbit Decor */}
              <div className="absolute top-4 right-12 text-slate-500 text-xs font-mono opacity-40">
                ORBIT GEOSTASIONER / POLAR (705 KM)
              </div>

              {/* Graphic Diagram Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
                {/* 1. Sumber Energi (Sun) */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-amber-500/40 text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                    <Sun className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <span className="text-xs uppercase font-bold text-amber-300 block tracking-wider">
                    Sumber Tenaga
                  </span>
                  <h4 className="text-sm font-bold text-white">Matahari (Sistem Pasif)</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Memancarkan radiasi gelombang elektromagnetik (cahaya tampak & inframerah) melewati lapisan atmosfer bumi.
                  </p>
                </div>

                {/* 2. Sensor & Wahana (Satelit) */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-sky-500/40 text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/10">
                    <Satellite className="w-8 h-8 animate-pulse" />
                  </div>
                  <span className="text-xs uppercase font-bold text-sky-300 block tracking-wider">
                    Sensor & Wahana
                  </span>
                  <h4 className="text-sm font-bold text-white">Satelit Resolusi Tinggi</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Merekam pantulan spektral dari permukaan bumi lalu mentransmisikannya ke stasiun penerima di bumi.
                  </p>
                </div>

                {/* 3. Hasil & Analis (Citra & Detektif Citra) */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/40 text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <Database className="w-8 h-8" />
                  </div>
                  <span className="text-xs uppercase font-bold text-emerald-300 block tracking-wider">
                    Data & Pengguna
                  </span>
                  <h4 className="text-sm font-bold text-white">Citra Digital & Siswa</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Siswa menganalisis ciri visual (bentuk, ukuran, rona, tekstur, asosiasi) untuk mengenali objek geografis.
                  </p>
                </div>
              </div>

              {/* Lower Surface Cross Section */}
              <div className="mt-8 pt-6 border-t border-slate-700/80">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-3 text-center sm:text-left">
                  Permukaan Bumi (Objek Pengamatan Kota Malang):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-emerald-500/30 flex items-center gap-2.5">
                    <Trees className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Vegetasi / Taman</span>
                      <span className="text-[10px] text-emerald-300">Pantulan inframerah tinggi</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/90 border border-blue-500/30 flex items-center gap-2.5">
                    <Waves className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Sungai / Air</span>
                      <span className="text-[10px] text-sky-300">Rona gelap (menyerap cahaya)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/90 border border-amber-500/30 flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Bangunan / Gedung</span>
                      <span className="text-[10px] text-amber-300">Bentuk kotak & ada bayangan</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-500/30 flex items-center gap-2.5">
                    <Compass className="w-5 h-5 text-slate-300 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Jaringan Jalan</span>
                      <span className="text-[10px] text-slate-300">Pola linier kontinu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 3 Wahana Penginderaan Jauh */}
        {activeIllustrationTab === 'platforms' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Satelit */}
            <div className="p-5 rounded-2xl bg-linear-to-b from-sky-50 to-white border-2 border-sky-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                <Satellite className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  Ketinggian &gt; 500 km
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  1. Satelit Antariksa
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengorbit bumi secara periodik di luar angkasa. Memberikan cakupan sangat luas untuk pemantauan pulau, kota metropolitan, hingga benua secara berkala (contoh: Landsat, Sentinel, Pleiades, QuickBird).
              </p>
              <div className="pt-2 border-t border-sky-100 text-[11px] text-sky-800 font-semibold">
                • Keunggulan: Liputan global & pemantauan rutin
              </div>
            </div>

            {/* Pesawat Udara */}
            <div className="p-5 rounded-2xl bg-linear-to-b from-blue-50 to-white border-2 border-blue-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Ketinggian 1.000 – 10.000 m
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  2. Pesawat Udara
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membawa kamera udara fotogrametri beresolusi tinggi. Digunakan untuk pemetaan detail batas wilayah kabupaten/kota, perencanaan tata ruang tata kota, dan ortofoto detail.
              </p>
              <div className="pt-2 border-t border-blue-100 text-[11px] text-blue-800 font-semibold">
                • Keunggulan: Detail spasial tinggi & akurat
              </div>
            </div>

            {/* Drone / UAV */}
            <div className="p-5 rounded-2xl bg-linear-to-b from-emerald-50 to-white border-2 border-emerald-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Ketinggian &lt; 150 m
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  3. Drone (UAV)
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wahana tanpa awak yang sangat fleksibel dan dapat diterbangkan kapan saja di bawah awan. Sangat efektif untuk observasi mikro seperti area sekolah, kompleks perumahan, atau survei cepat bencana.
              </p>
              <div className="pt-2 border-t border-emerald-100 text-[11px] text-emerald-800 font-semibold">
                • Keunggulan: Cepat, bebas awan, biaya terjangkau
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Kunci Identifikasi Objek pada Citra */}
        {activeIllustrationTab === 'objects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-700">
                <Compass className="w-4 h-4" />
                <h5 className="font-bold text-sm">Jalan Raya & Rel</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ciri Visual:</strong> Pola garis linier memanjang kontinu, lebar relatif seragam. Rel kereta api memiliki tikungan melengkung landai (radius besar) dan terhubung ke stasiun.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-sky-700">
                <Waves className="w-4 h-4" />
                <h5 className="font-bold text-sm">Sungai & Saluran Air</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ciri Visual:</strong> Pola memanjang berkelok-kelok (meander) tidak teratur, lebar bertambah ke arah hilir. Rona gelap karena air menyerap spektrum cahaya.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <Trees className="w-4 h-4" />
                <h5 className="font-bold text-sm">Hutan & Vegetasi Taman</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ciri Visual:</strong> Tekstur kasar dengan bintik-bintik tajuk kanopi pohon. Rona hijau pekat atau merah menyala (pada citra komposit inframerah semu).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-700">
                <Building className="w-4 h-4" />
                <h5 className="font-bold text-sm">Gedung & Bangunan</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ciri Visual:</strong> Bentuk geometris tegas (persegi, persegi panjang, huruf L atau U). Tampak bayangan jatuh ke satu arah menjauhi posisi sumber matahari.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-purple-700">
                <Layers className="w-4 h-4" />
                <h5 className="font-bold text-sm">Permukiman Padat</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ciri Visual:</strong> Tekstur sedang hingga kasar, kumpulan atap rumah berukuran kecil berderet rapat dengan jaringan lorong jalan gang di antaranya.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-700">
                <Sparkles className="w-4 h-4" />
                <h5 className="font-bold text-sm">Lapangan Olahraga</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ciri Visual:</strong> Bentuk persegi panjang atau oval (seperti Velodrome / stadion), permukaan rata, rona cerah, dan tekstur sangat halus.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Diagram Alur: Sumber Energi → Atmosfer → Objek → Sensor → Data/Citra → Informasi */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Alur Sistem Penginderaan Jauh
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            Diagram Komponen & Interaksi
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Sumber Energi → Atmosfer → Objek → Sensor → Data/Citra → Informasi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${step.borderColor} ${step.bgColor} transition hover:shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-linear-to-tr ${step.color} text-white flex items-center justify-center shadow-xs`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Penjelasan Singkat 5 Komponen Utama */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          Penjelasan Singkat Komponen Utama
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">• Sumber energi:</span>
            Energi elektromagnetik yang digunakan dalam perekaman, bisa berupa sinar matahari alami (pasif) atau pulsa radar/lidar buatan (aktif).
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">• Objek:</span>
            Kenampakan permukaan bumi yang diamati seperti atap gedung, sungai, jalan raya, pepohonan, sawah, dan lapangan.
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">• Sensor:</span>
            Alat perekam yang menerima pantulan atau pancaran gelombang elektromagnetik dari objek permukaan bumi.
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">• Wahana:</span>
            Kendaraan pembawa sensor, seperti drone (ketinggian rendah), pesawat udara (ketinggian sedang), dan satelit orbit bumi (ketinggian tinggi).
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed md:col-span-2">
            <span className="font-bold text-slate-900 block mb-0.5">• Citra:</span>
            Hasil perekaman permukaan bumi yang dapat dianalisis secara visual melalui ciri bentuk, ukuran, rona, tekstur, pola, dan bayangan untuk mengenali objek geografi.
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <span>Lanjut ke Detektif Citra</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
