import React from 'react';
import { LEARNING_OBJECTIVES, ACTIVITY_GUIDELINES, TIME_ALLOCATION } from '../utils/constants';
import { TimerWidget } from './TimerWidget';
import { Target, BookOpen, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface StepInstructionsProps {
  startedAt?: string | null;
  onPrev: () => void;
  onNext: () => void;
}

export function StepInstructions({ startedAt, onPrev, onNext }: StepInstructionsProps) {
  return (
    <div className="space-y-6">
      {/* 45-Minute Timer Widget Prominently Featured with Auto-Start */}
      <TimerWidget initialSeconds={2700} startedAt={startedAt} autoStart={true} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section E: Tujuan Pembelajaran */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-600">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                  Kompetensi Pembelajaran
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Tujuan Pembelajaran
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              Setelah mengikuti kegiatan pembelajaran ini, peserta didik mampu:
            </p>

            <div className="space-y-2.5">
              {LEARNING_OBJECTIVES.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-snug font-medium">
                    {obj}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section F: Petunjuk Kegiatan */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-600">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Langkah Kerja Kolaboratif
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Aktivitas: Detektif Citra
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              Ikuti petunjuk pengerjaan di bawah ini bersama seluruh anggota kelompok:
            </p>

            <div className="space-y-2">
              {ACTIVITY_GUIDELINES.map((guide, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section F: Pembagian Waktu 45 Menit */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">
            Rekomendasi Pembagian Waktu (1 JP = 45 Menit)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {TIME_ALLOCATION.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold font-mono">
                {item.duration}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
          <span>Lanjut ke Materi Singkat</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
