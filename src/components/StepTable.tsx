import React from 'react';
import { ObservationRow } from '../types';
import { Table, Plus, Trash2, ArrowRight, ArrowLeft, Info } from 'lucide-react';

interface StepTableProps {
  rows: ObservationRow[];
  onChangeRows: (newRows: ObservationRow[]) => void;
  onPrev: () => void;
  onNext: () => void;
  isReadOnly?: boolean;
}

export function StepTable({
  rows,
  onChangeRows,
  onPrev,
  onNext,
  isReadOnly = false
}: StepTableProps) {
  const handleCellChange = (
    index: number,
    field: keyof Omit<ObservationRow, 'id'>,
    value: string
  ) => {
    if (isReadOnly) return;
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChangeRows(updated);
  };

  const handleAddRow = () => {
    if (isReadOnly) return;
    const newId = `row-${Date.now()}`;
    onChangeRows([
      ...rows,
      { id: newId, objectName: '', visualFeature: '', reasonOrConjecture: '' }
    ]);
  };

  const handleDeleteRow = (index: number) => {
    if (isReadOnly) return;
    if (rows.length <= 6) {
      alert('Tabel harus memiliki minimal 6 baris objek pengamatan.');
      return;
    }
    const updated = rows.filter((_, i) => i !== index);
    onChangeRows(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Table className="w-3.5 h-3.5" />
            <span>Tahap 5 dari 8 • Tabel Pengamatan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tabel Hasil Pengamatan Objek
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Catat hasil temuan objek citra secara sistematis beserta ciri visual nyata dan dasar dugaan kelompokmu.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <span className="font-bold block">Target: Minimal 5 Objek</span>
          Tersedia {rows.length} baris pencatatan
        </div>
      </div>

      {/* Guidance Alert with Example Placeholders */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            Panduan Mengisi Ciri yang Terlihat & Alasan:
          </p>
          <p className="text-slate-600">
            Perhatikan bentuk, ukuran relatif, rona warna terang/gelap, tekstur halus/kasar, serta asosiasi objek sekitar.
            Contoh referensi ciri visual: <span className="italic font-medium">Objek: Sungai | Ciri: Memanjang dan berkelok | Alasan: Bentuk alur kontinu dengan rona gelap khas air</span>.
          </p>
        </div>
      </div>

      {/* Interactive Observation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-3 text-center w-12">No.</th>
                <th className="py-3.5 px-4 min-w-[180px]">Objek yang Ditemukan</th>
                <th className="py-3.5 px-4 min-w-[220px]">Ciri yang Terlihat</th>
                <th className="py-3.5 px-4 min-w-[220px]">Alasan / Dugaan</th>
                {!isReadOnly && <th className="py-3.5 px-3 text-center w-14">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                    {index + 1}
                  </td>
                  <td className="p-2 sm:p-3">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={row.objectName}
                      onChange={(e) => handleCellChange(index, 'objectName', e.target.value)}
                      placeholder={index === 0 ? 'Contoh: Sungai' : `Nama objek ${index + 1}...`}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50"
                    />
                  </td>
                  <td className="p-2 sm:p-3">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={row.visualFeature}
                      onChange={(e) => handleCellChange(index, 'visualFeature', e.target.value)}
                      placeholder={index === 0 ? 'Contoh: Memanjang dan berkelok' : 'Ciri visual tampak (bentuk/warna/tekstur)...'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50"
                    />
                  </td>
                  <td className="p-2 sm:p-3">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={row.reasonOrConjecture}
                      onChange={(e) => handleCellChange(index, 'reasonOrConjecture', e.target.value)}
                      placeholder={index === 0 ? 'Alasan: Alur air alami berona gelap' : 'Mengapa kelompok menduga demikian?...'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 text-xs sm:text-sm text-slate-800 disabled:bg-slate-50"
                    />
                  </td>
                  {!isReadOnly && (
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        disabled={rows.length <= 6}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition cursor-pointer"
                        title={rows.length <= 6 ? 'Minimal 6 baris' : 'Hapus baris'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        {!isReadOnly && (
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Perlu mencatat objek lain? Klik tombol di kanan untuk menambah baris.
            </span>
            <button
              type="button"
              onClick={handleAddRow}
              className="px-4 py-2 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-xl text-blue-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Objek</span>
            </button>
          </div>
        )}
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
          <span>Lanjut ke Objek Presentasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
