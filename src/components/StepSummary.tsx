import React, { useState } from 'react';
import { GroupSubmission, RubricScore, StudentStepKey } from '../types';
import { GROUP_AREAS } from '../utils/constants';
import {
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Award,
  MessageSquare,
  FileCheck,
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';

interface StepSummaryProps {
  submission: GroupSubmission;
  score?: RubricScore | null;
  onSaveDraft: () => Promise<void>;
  onSubmitLKPD: () => Promise<void>;
  onNavigateToStep: (stepKey: StudentStepKey) => void;
  isSaving: boolean;
}

export function StepSummary({
  submission,
  score,
  onSaveDraft,
  onSubmitLKPD,
  onNavigateToStep,
  isSaving
}: StepSummaryProps) {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isSubmitted = submission.status === 'submitted';
  const isGraded = submission.status === 'graded';
  const isRevision = submission.status === 'revision';

  const filledObsCount = submission.observations.filter(
    (o) => o.objectName.trim() && o.visualFeature.trim()
  ).length;

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitLKPD();
      setShowConfirmModal(false);
      setSubmitSuccessNotice(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Status Alert Banner */}
      {isGraded && score && (
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Hasil Penilaian Resmi Guru</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                HASIL PENILAIAN
              </h2>
              <p className="text-sm text-sky-200">
                Pengerjaan LKPD Detektif Citra telah dinilai oleh Guru Geografi.
              </p>
            </div>

            {/* Final Score Circle/Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[180px] shrink-0">
              <span className="text-xs uppercase font-bold text-sky-300 tracking-wider block">
                Nilai Akhir
              </span>
              <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight mt-1">
                {score.totalScore}
                <span className="text-xl text-sky-200 font-normal"> / 100</span>
              </div>
            </div>
          </div>

          {/* Breakdown Per Criteria per Section T */}
          <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-sky-200 block">Identifikasi objek</span>
              <span className="text-base font-bold text-white font-mono">{score.objectIdentification} / 30</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-sky-200 block">Ciri visual & alasan</span>
              <span className="text-base font-bold text-white font-mono">{score.visualReasoning} / 25</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-sky-200 block">Kelengkapan tabel</span>
              <span className="text-base font-bold text-white font-mono">{score.completeness} / 20</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-sky-200 block">Diskusi / Presentasi</span>
              <span className="text-base font-bold text-white font-mono">{score.presentation} / 15</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-sky-200 block">Refleksi</span>
              <span className="text-base font-bold text-white font-mono">{score.reflection} / 10</span>
            </div>
          </div>

          {/* Teacher Feedback per Section T */}
          {score.teacherFeedback && (
            <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-sky-100 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-semibold mb-0.5">Catatan / Feedback Guru:</strong>
                <p className="leading-relaxed whitespace-pre-wrap">{score.teacherFeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {isSubmitted && !isGraded && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold text-emerald-900 block">
                Status: ✅ Sudah Dikumpulkan
              </span>
              <p className="text-xs text-emerald-700">
                LKPD telah berhasil dikirimkan ke guru. Jawaban Anda terkunci untuk evaluasi guru.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 transition cursor-pointer self-start sm:self-center"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      )}

      {isRevision && (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <span className="text-base font-bold text-amber-900 block">
              Status: 🟠 Revisi
            </span>
            <p className="text-xs text-amber-800">
              Guru telah membuka kembali pengerjaan kelompok Anda. Silakan perbaiki jawaban dan kumpulkan kembali setelah lengkap.
            </p>
          </div>
        </div>
      )}

      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Ringkasan Pengerjaan LKPD
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Periksa ringkasan jawaban seluruh tahapan kegiatan sebelum mengirim ke guru.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Kelompok {submission.groupNumber}</span>
            <span className="text-sm font-bold text-blue-900">{submission.groupName || 'Tanpa Nama'}</span>
          </div>
        </div>

        {/* Section Checklist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">1. Anggota</span>
              <button
                type="button"
                onClick={() => onNavigateToStep('identity')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Ubah
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {submission.members.filter((m) => m.trim().length > 0).length} dari 6 nama terisi
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">2. Pertanyaan Awal</span>
              <button
                type="button"
                onClick={() => onNavigateToStep('image_observation')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Ubah
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {submission.answers.objectsSeen && submission.answers.easiestObject ? 'Terjawab' : 'Belum lengkap'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">3. Tabel Objek</span>
              <button
                type="button"
                onClick={() => onNavigateToStep('table_objects')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Ubah
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {filledObsCount} objek teridentifikasi
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">4. Presentasi & Refleksi</span>
              <button
                type="button"
                onClick={() => onNavigateToStep('presentation')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Ubah
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {submission.presentationObjects.obj1.objectName && submission.reflection.learnedToday
                ? 'Siap dipresentasikan'
                : 'Belum lengkap'}
            </p>
          </div>
        </div>

        {/* Action Buttons: SIMPAN SEMENTARA & KIRIM HASIL KE GURU (Section L) */}
        {!isSubmitted && (
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-blue-600" />
              <span>{isSaving ? 'Menyimpan...' : 'SIMPAN SEMENTARA'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>KIRIM HASIL KE GURU</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal before Submit per Section L */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-xl font-bold text-slate-900">
                Konfirmasi Pengiriman LKPD
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                “Apakah kelompok kalian yakin semua jawaban sudah lengkap?”
              </p>
              <p className="text-xs text-slate-500">
                Setelah dikirim, status kelompok akan berubah menjadi <strong className="text-emerald-700">Sudah Dikumpulkan</strong> dan jawaban terkunci hingga dinilai oleh guru.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
              >
                Periksa Kembali
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim...' : 'Ya, Kirim Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
