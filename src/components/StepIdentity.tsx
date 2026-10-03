import React from 'react';
import { StudentGroupIdentity } from '../types';
import { GROUP_AREAS } from '../utils/constants';
import { Users, MapPin, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface StepIdentityProps {
  identity: StudentGroupIdentity;
  onChange: (updated: Partial<StudentGroupIdentity>) => void;
  onNext: () => void;
  isReadOnly?: boolean;
}

export function StepIdentity({
  identity,
  onChange,
  onNext,
  isReadOnly = false
}: StepIdentityProps) {
  const currentArea = GROUP_AREAS[identity.groupNumber];

  const handleMemberChange = (index: number, val: string) => {
    if (isReadOnly) return;
    const updated = [...identity.members];
    updated[index] = val;
    onChange({ members: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Tahap 1 dari 8 • Identitas Kelompok</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Profil Kelompok Pengamatan
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Periksa kembali kelengkapan identitas dan pembagian peran anggota kelompokmu sebelum melanjutkan.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
              Kelompok Terdaftar
            </span>
            <span className="text-lg font-black text-blue-900 font-mono">
              Kelompok {identity.groupNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Identity Fields */}
        <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Data Tim Siswa</span>
            {isReadOnly && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                Terkunci (Sudah Dikumpulkan)
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Kelompok
              </label>
              <input
                type="text"
                disabled
                value={`Kelompok ${identity.groupNumber}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kelas
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={identity.className}
                onChange={(e) => onChange({ className: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-semibold text-slate-800 disabled:bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Kelompok
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={identity.groupName}
              onChange={(e) => onChange({ groupName: e.target.value })}
              placeholder="Contoh: Detektif Tugu Malang"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-semibold text-slate-800 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daftar Anggota Kelompok (6 Siswa)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {identity.members.map((member, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={member}
                    onChange={(e) => handleMemberChange(idx, e.target.value)}
                    placeholder={`Nama Siswa ${idx + 1}`}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Assigned Area Card (Section C) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-linear-to-br from-blue-900 to-sky-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/80">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Wilayah Pengamatan Kelompok Anda
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-800 border border-blue-700 text-[11px] font-mono font-bold text-amber-300">
                Kelompok {identity.groupNumber}
              </span>
            </div>

            <div className="border-t border-blue-800/80 pt-3">
              <h4 className="text-lg font-bold text-white leading-snug">
                {currentArea.regionName}
              </h4>
              <p className="mt-2 text-xs text-sky-200 leading-relaxed">
                {currentArea.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-800/60">
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Objek yang kemungkinan dapat ditemukan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentArea.expectedObjects.map((obj, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-blue-800/80 border border-blue-700 text-[11px] text-sky-100 font-medium"
                  >
                    • {obj}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-blue-950/70 border border-blue-800/80 text-[11px] text-sky-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Area ini otomatis ditetapkan untuk Kelompok {identity.groupNumber} dan tidak dapat diubah oleh siswa.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Lanjut ke Tujuan & Petunjuk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
