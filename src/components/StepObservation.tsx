import React from 'react';
import { GroupNumber, InitialQuestions } from '../types';
import { GROUP_AREAS } from '../utils/constants';
import { ImageViewer } from './ImageViewer';
import { Search, HelpCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface StepObservationProps {
  groupNumber: GroupNumber;
  imageSrc: string | null;
  questions: InitialQuestions;
  onChangeQuestions: (updated: Partial<InitialQuestions>) => void;
  onPrev: () => void;
  onNext: () => void;
  isReadOnly?: boolean;
}

export function StepObservation({
  groupNumber,
  imageSrc,
  questions,
  onChangeQuestions,
  onPrev,
  onNext,
  isReadOnly = false
}: StepObservationProps) {
  const currentArea = GROUP_AREAS[groupNumber];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Tahap 4 dari 8 • Aktivitas Detektif Citra</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Amati Wilayah Kelompokmu!
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Wilayah: <strong className="text-blue-900 font-semibold">{currentArea.regionName}</strong>
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-sm">
          <span className="font-bold block mb-0.5">Instruksi Pengamatan:</span>
          Temukan minimal lima objek yang dapat kalian kenali pada citra. Diskusikan bersama rekan sekelompokmu!
        </div>
      </div>

      {/* Large Satellite Image Viewer (Primary Visual Element per prompt) */}
      <div className="space-y-2">
        <ImageViewer
          imageSrc={imageSrc}
          regionName={currentArea.regionName}
          groupNumber={groupNumber}
        />
        <p className="text-[11px] text-slate-500 text-center italic">
          Gunakan tombol zoom dan geser kursor untuk mengamati detil pola bangunan, jaringan jalan, dan vegetasi.
        </p>
      </div>

      {/* 5 Investigation Questions */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Pertanyaan Awal Pengamatan Citra</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Jawab kelima pertanyaan reflektif berikut berdasarkan kenampakan visual nyata yang kalian amati pada citra di atas.
          </p>
        </div>

        <div className="space-y-5">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              1. Objek apa saja yang kalian temukan? <span className="text-rose-500">*</span>
            </label>
            <textarea
              disabled={isReadOnly}
              rows={3}
              value={questions.objectsSeen}
              onChange={(e) => onChangeQuestions({ objectsSeen: e.target.value })}
              placeholder="Sebutkan minimal 5 objek yang dapat kalian kenali (contoh: jalan raya utama, pepohonan/vegetasi lebat, atap gedung perkantoran, rel kereta api, lapangan olahraga, pemukiman padat)..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
            />
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              2. Objek mana yang paling mudah dikenali? <span className="text-rose-500">*</span>
            </label>
            <textarea
              disabled={isReadOnly}
              rows={2}
              value={questions.easiestObject}
              onChange={(e) => onChangeQuestions({ easiestObject: e.target.value })}
              placeholder="Tuliskan 1 atau 2 objek yang paling cepat dikenali oleh seluruh anggota kelompok..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
            />
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              3. Apa alasan kalian mengenali objek tersebut? <span className="text-rose-500">*</span>
            </label>
            <textarea
              disabled={isReadOnly}
              rows={3}
              value={questions.easiestReason}
              onChange={(e) => onChangeQuestions({ easiestReason: e.target.value })}
              placeholder="Jelaskan alasan visualnya (misalnya bentuknya yang memanjang lurus, warna/rona yang kontras, pola teratur, atau ukuran yang sangat besar dibandingkan sekitarnya)..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
            />
          </div>

          {/* Question 4 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              4. Objek mana yang paling sulit dikenali? <span className="text-rose-500">*</span>
            </label>
            <textarea
              disabled={isReadOnly}
              rows={2}
              value={questions.hardestObject}
              onChange={(e) => onChangeQuestions({ hardestObject: e.target.value })}
              placeholder="Objek apa yang membingungkan atau memerlukan perdebatan antar anggota untuk memastikannya?..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
            />
          </div>

          {/* Question 5 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              5. Apakah terdapat objek yang masih kalian ragukan? Jelaskan. <span className="text-rose-500">*</span>
            </label>
            <textarea
              disabled={isReadOnly}
              rows={3}
              value={questions.doubtfulObject}
              onChange={(e) => onChangeQuestions({ doubtfulObject: e.target.value })}
              placeholder="Jelaskan objek yang diragukan (misalnya: apakah genangan air atau bayangan gedung? apakah jalan gang atau saluran drainase? mengapa kalian masih ragu?)..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
            />
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
          <span>Lanjut ke Tabel Pengamatan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
