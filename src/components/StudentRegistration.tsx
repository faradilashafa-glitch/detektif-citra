import React, { useState } from 'react';
import { GroupNumber, StudentGroupIdentity } from '../types';
import { GROUP_AREAS } from '../utils/constants';
import { Users, MapPin, ArrowLeft, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StudentRegistrationProps {
  initialGroupNumber?: GroupNumber;
  initialIdentity?: Partial<StudentGroupIdentity>;
  onRegister: (identity: StudentGroupIdentity) => void;
  onBackToHome: () => void;
}

export function StudentRegistration({
  initialGroupNumber = '1',
  initialIdentity,
  onRegister,
  onBackToHome
}: StudentRegistrationProps) {
  const [groupNumber, setGroupNumber] = useState<GroupNumber>(
    (initialIdentity?.groupNumber as GroupNumber) || initialGroupNumber
  );
  const [groupName, setGroupName] = useState<string>(initialIdentity?.groupName || '');
  const [className, setClassName] = useState<string>(initialIdentity?.className || 'X-1');
  const [members, setMembers] = useState<string[]>(
    initialIdentity?.members && initialIdentity.members.length === 6
      ? initialIdentity.members
      : ['', '', '', '', '', '']
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedArea = GROUP_AREAS[groupNumber];

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index] = val;
    setMembers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setValidationError('Silakan isi Nama Kelompok terlebih dahulu.');
      return;
    }
    const filledMembers = members.filter((m) => m.trim().length > 0);
    if (filledMembers.length < 3) {
      setValidationError('Mohon masukkan minimal 3–6 nama anggota kelompok.');
      return;
    }

    setValidationError(null);
    onRegister({
      groupNumber,
      groupName: groupName.trim(),
      className: className.trim() || 'X-1',
      members,
      assignedArea: selectedArea.regionName
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-slate-50 to-blue-50/40 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation back */}
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Awal</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Akses Siswa / Kelompok</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pendaftaran Kelompok Detektif Citra
            </h1>
            <p className="text-sm text-slate-600">
              Isi data identitas kelompok dan anggota kalian sebelum memulai pengamatan citra wilayah.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shrink-0 text-center sm:text-right">
            <span className="text-xs text-emerald-800 font-semibold block">Total 6 Kelompok</span>
            <span className="text-xs text-emerald-600">Alokasi Waktu: 45 Menit (1 JP)</span>
          </div>
        </div>

        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Form: Identity inputs */}
            <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">1</span>
                Identitas Kelompok & Kelas
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor Kelompok <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={groupNumber}
                    onChange={(e) => setGroupNumber(e.target.value as GroupNumber)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold text-slate-800 bg-white"
                  >
                    <option value="1">Kelompok 1</option>
                    <option value="2">Kelompok 2</option>
                    <option value="3">Kelompok 3</option>
                    <option value="4">Kelompok 4</option>
                    <option value="5">Kelompok 5</option>
                    <option value="6">Kelompok 6</option>
                  </select>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Pilihan hanya Kelompok 1 s.d 6
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kelas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Contoh: X-1, X-A, dsb."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Kelompok <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Contoh: Tim Geodesi 1, Detektif Tugu, dsb."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm font-medium"
                />
              </div>

              {/* Members inputs (1 to 6) */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Daftar Nama Anggota Kelompok (5–6 Siswa) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {members.map((member, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => handleMemberChange(idx, e.target.value)}
                        placeholder={`Nama Anggota ${idx + 1}`}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: Automatic Assigned Area per Section B & C */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-linear-to-br from-blue-900 to-sky-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/80">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Penetapan Sistem Otomatis
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-800/80 border border-blue-700 text-[11px] font-mono font-bold text-amber-300">
                    Kelompok {groupNumber}
                  </span>
                </div>

                <div className="border-t border-blue-800/80 pt-3">
                  <h3 className="text-xs uppercase tracking-wider text-slate-300 font-medium">
                    Wilayah Pengamatan Kelompok Anda
                  </h3>
                  <div className="text-xl font-bold text-white mt-1 leading-snug">
                    {selectedArea.regionName}
                  </div>
                </div>

                <p className="mt-3 text-xs text-sky-200 leading-relaxed">
                  {selectedArea.description}
                </p>

                <div className="mt-4 pt-3 border-t border-blue-800/60">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                    Objek yang kemungkinan dapat ditemukan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArea.expectedObjects.map((obj, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-blue-800/60 border border-blue-700/60 text-[11px] text-sky-100 font-medium"
                      >
                        • {obj}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-blue-950/70 border border-blue-800/80 text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Siswa tidak dapat memilih atau mengganti area kelompoknya sendiri. Wilayah pengamatan telah dikunci oleh sistem.
                  </span>
                </div>
              </div>

              {/* Ready to begin button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Mulai Pengerjaan LKPD</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
