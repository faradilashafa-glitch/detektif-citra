import React from 'react';
import { PresentationObject, ObservationRow } from '../types';
import { Mic, Clock, Sparkles, ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';

interface StepPresentationProps {
  presentationObjects: {
    obj1: PresentationObject;
    obj2: PresentationObject;
  };
  detectedRows: ObservationRow[];
  onChange: (updated: { obj1: PresentationObject; obj2: PresentationObject }) => void;
  onPrev: () => void;
  onNext: () => void;
  isReadOnly?: boolean;
}

export function StepPresentation({
  presentationObjects,
  detectedRows,
  onChange,
  onPrev,
  onNext,
  isReadOnly = false
}: StepPresentationProps) {
  const handleObj1Change = (field: keyof PresentationObject, value: string) => {
    if (isReadOnly) return;
    onChange({
      ...presentationObjects,
      obj1: { ...presentationObjects.obj1, [field]: value }
    });
  };

  const handleObj2Change = (field: keyof PresentationObject, value: string) => {
    if (isReadOnly) return;
    onChange({
      ...presentationObjects,
      obj2: { ...presentationObjects.obj2, [field]: value }
    });
  };

  const availableNamedObjects = detectedRows
    .map((r) => r.objectName.trim())
    .filter((n) => n.length > 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>Tahap 6 dari 8 • Objek Presentasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Persiapan Pemaparan Kelas
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pilihlah dua objek paling menarik atau paling khas dari hasil pengamatan kelompokmu untuk dipresentasikan.
          </p>
        </div>

        {/* Section J Notice: Siapkan penjelasan kelompok selama ±1 menit */}
        <div className="px-5 py-3 rounded-2xl bg-amber-500 text-white shadow-xs flex items-center gap-3 shrink-0">
          <Clock className="w-6 h-6 shrink-0" />
          <div>
            <span className="text-xs uppercase tracking-wider font-bold block text-amber-100">
              Durasi Presentasi
            </span>
            <span className="text-sm font-bold">
              Siapkan penjelasan kelompok selama ±1 menit.
            </span>
          </div>
        </div>
      </div>

      {/* 2 Object Presentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Object 1 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Objek Pilihan Pertama
              </h3>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Fokus Utama
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Objek <span className="text-rose-500">*</span>
              </label>
              {availableNamedObjects.length > 0 && !isReadOnly && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-400 self-center">Pilih cepat:</span>
                  {availableNamedObjects.slice(0, 4).map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleObj1Change('objectName', name)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-[11px] text-slate-700 hover:text-blue-800 transition"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                disabled={isReadOnly}
                value={presentationObjects.obj1.objectName}
                onChange={(e) => handleObj1Change('objectName', e.target.value)}
                placeholder="Contoh: Balai Kota Malang / Rel Kereta Api"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 text-sm font-semibold text-slate-800 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ciri yang Terlihat pada Citra <span className="text-rose-500">*</span>
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                value={presentationObjects.obj1.visualFeature}
                onChange={(e) => handleObj1Change('visualFeature', e.target.value)}
                placeholder="Jelaskan ciri visual (bentuk, ukuran, warna atap, tekstur permukaan, pola keliling)..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alasan Identifikasi <span className="text-rose-500">*</span>
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                value={presentationObjects.obj1.reasonOrEvidence}
                onChange={(e) => handleObj1Change('reasonOrEvidence', e.target.value)}
                placeholder="Mengapa kelompok yakin ini adalah objek tersebut? Bukti apa yang memperkuat dugaan?..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Object 2 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Objek Pilihan Kedua
              </h3>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Objek Pembanding
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Objek <span className="text-rose-500">*</span>
              </label>
              {availableNamedObjects.length > 0 && !isReadOnly && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-400 self-center">Pilih cepat:</span>
                  {availableNamedObjects.slice(2, 6).map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleObj2Change('objectName', name)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-[11px] text-slate-700 hover:text-emerald-800 transition"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                disabled={isReadOnly}
                value={presentationObjects.obj2.objectName}
                onChange={(e) => handleObj2Change('objectName', e.target.value)}
                placeholder="Contoh: Alun-Alun Tugu Lingkaran / Taman Ijen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm font-semibold text-slate-800 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ciri yang Terlihat pada Citra <span className="text-rose-500">*</span>
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                value={presentationObjects.obj2.visualFeature}
                onChange={(e) => handleObj2Change('visualFeature', e.target.value)}
                placeholder="Jelaskan ciri visual pembeda objek ini dari kenampakan di sekitarnya..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alasan Identifikasi <span className="text-rose-500">*</span>
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                value={presentationObjects.obj2.reasonOrEvidence}
                onChange={(e) => handleObj2Change('reasonOrEvidence', e.target.value)}
                placeholder="Bagikan argumentasi visual kelompokmu yang akan dipaparkan ke teman sekelas..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Presentation Tips */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">Tips Presentasi 1 Menit:</span>
          Sebutkan nama objek, tunjukkan di mana letak objek pada citra, lalu jelaskan dua ciri khas visual (misal bentuk bundar taman vs atap persegi panjang) yang membuat kalian yakin atas objek tersebut.
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
          <span>Lanjut ke Refleksi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
