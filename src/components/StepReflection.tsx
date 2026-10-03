import React from 'react';
import { ReflectionAnswers } from '../types';
import { BrainCircuit, CheckCircle2, ArrowRight, ArrowLeft, MessageSquareQuote } from 'lucide-react';

interface StepReflectionProps {
  reflection: ReflectionAnswers;
  onChange: (updated: Partial<ReflectionAnswers>) => void;
  onPrev: () => void;
  onNext: () => void;
  isReadOnly?: boolean;
}

export function StepReflection({
  reflection,
  onChange,
  onPrev,
  onNext,
  isReadOnly = false
}: StepReflectionProps) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Tahap 7 dari 8 • Refleksi Pembelajaran</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Refleksi & Evaluasi Belajar
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Ulas kembali pengalaman belajar, tantangan interpretasi visual, dan pemahaman konsep yang kalian peroleh hari ini.
          </p>
        </div>
      </div>

      {/* Reflection Questions Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        {/* Question 1 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Hal baru yang kami pelajari hari ini adalah... <span className="text-rose-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={reflection.learnedToday}
            onChange={(e) => onChange({ learnedToday: e.target.value })}
            placeholder="Tuliskan wawasan baru mengenai citra satelit, alur penginderaan jauh, atau cara mengenali objek permukaan bumi..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
          />
        </div>

        {/* Question 2 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Objek yang paling mudah dikenali adalah... karena... <span className="text-rose-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={reflection.easiestLearned}
            onChange={(e) => onChange({ easiestLearned: e.target.value })}
            placeholder="Sebutkan objek dan jelaskan alasan mengapa sangat mudah dikenali (warna, bentuk khusus, ukuran)..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
          />
        </div>

        {/* Question 3 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Objek yang masih sulit dikenali adalah... karena... <span className="text-rose-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={reflection.hardestLearned}
            onChange={(e) => onChange({ hardestLearned: e.target.value })}
            placeholder="Sebutkan objek yang sulit dan apa faktor penyebabnya (resolusi, kesamaan rona, atau bayangan)..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 disabled:bg-slate-50 leading-relaxed"
          />
        </div>

        {/* Question 4: Radio Ya / Tidak with Section K feedback */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            4. Menurut kelompok kalian, apakah satu ciri saja cukup untuk mengenali suatu objek pada citra? <span className="text-rose-500">*</span>
          </label>

          <div className="flex items-center gap-4">
            <label className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer font-semibold text-sm transition ${
              reflection.canIdentifyByShapeOnly === 'yes'
                ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-2xs'
                : 'border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}>
              <input
                type="radio"
                name="single_feature"
                disabled={isReadOnly}
                checked={reflection.canIdentifyByShapeOnly === 'yes'}
                onChange={() => onChange({ canIdentifyByShapeOnly: 'yes' })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Ya</span>
            </label>

            <label className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer font-semibold text-sm transition ${
              reflection.canIdentifyByShapeOnly === 'no'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-2xs'
                : 'border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}>
              <input
                type="radio"
                name="single_feature"
                disabled={isReadOnly}
                checked={reflection.canIdentifyByShapeOnly === 'no'}
                onChange={() => onChange({ canIdentifyByShapeOnly: 'no' })}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Tidak</span>
            </label>
          </div>

          {/* Section K Interactive Feedback when selecting "Tidak" */}
          {reflection.canIdentifyByShapeOnly === 'no' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3 mt-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block text-emerald-950 mb-0.5">Penjelasan Konsep Geografi:</span>
                “Tepat. Pada pertemuan berikutnya kita akan mempelajari unsur interpretasi citra untuk mengenali objek dengan lebih sistematis.”
              </div>
            </div>
          )}

          {reflection.canIdentifyByShapeOnly === 'yes' && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 mt-3">
              <MessageSquareQuote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Pertimbangkan kembali: misalnya rel kereta api dan jalan raya mungkin sama-sama memanjang, tetapi rel memiliki stasiun dan tikungan dengan radius besar. Karena itu, para ahli penginderaan jauh memerlukan kombinasi unsur interpretasi (bentuk, ukuran, rona, tekstur, pola, bayangan, situs, asosiasi).
              </span>
            </div>
          )}
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
          <span>Lanjut ke Pengiriman LKPD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
