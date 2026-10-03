import React, { useState } from 'react';
import {
  GroupNumber,
  GroupSubmission,
  GroupStatus,
  RubricScore,
  AppSettings
} from '../types';
import { GROUP_AREAS, RUBRIC_CRITERIA } from '../utils/constants';
import {
  saveRubricScore,
  reopenGroupSubmission,
  uploadGroupImageFile,
  removeGroupImage,
  signOutUser
} from '../services/firebase';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  FileSpreadsheet,
  Image as ImageIcon,
  LogOut,
  Eye,
  Edit3,
  RotateCcw,
  Download,
  Printer,
  Upload,
  Trash2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Search,
  MapPin,
  TrendingUp,
  X
} from 'lucide-react';

interface OperatorDashboardProps {
  groups: Record<string, GroupSubmission>;
  scores: Record<string, RubricScore>;
  settings: AppSettings;
  operatorEmail: string;
  onLogout: () => void;
}

type TabKey = 'monitoring' | 'recap' | 'images';

export function OperatorDashboard({
  groups,
  scores,
  settings,
  operatorEmail,
  onLogout
}: OperatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('monitoring');
  const [selectedGroup, setSelectedGroup] = useState<GroupSubmission | null>(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // Form score state
  const [scoreForm, setScoreForm] = useState<{
    objectIdentification: number;
    visualReasoning: number;
    completeness: number;
    presentation: number;
    reflection: number;
    teacherFeedback: string;
  }>({
    objectIdentification: 0,
    visualReasoning: 0,
    completeness: 0,
    presentation: 0,
    reflection: 0,
    teacherFeedback: ''
  });

  const [uploadingGroup, setUploadingGroup] = useState<GroupNumber | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const groupKeys: GroupNumber[] = ['1', '2', '3', '4', '5', '6'];

  // Summary statistics per Section N
  const totalGroups = 6;
  const notStartedCount = groupKeys.filter(
    (k) => (groups[`group${k}`]?.status || 'not_started') === 'not_started'
  ).length;
  const inProgressCount = groupKeys.filter(
    (k) => groups[`group${k}`]?.status === 'in_progress' || groups[`group${k}`]?.status === 'revision'
  ).length;
  const submittedCount = groupKeys.filter(
    (k) => groups[`group${k}`]?.status === 'submitted'
  ).length;
  const gradedCount = groupKeys.filter(
    (k) => groups[`group${k}`]?.status === 'graded'
  ).length;

  const totalCompletedOrSubmitted = submittedCount + gradedCount;

  // Open Grading Modal
  const handleOpenGrading = (group: GroupSubmission) => {
    setSelectedGroup(group);
    const existingScore = scores[group.id];
    if (existingScore) {
      setScoreForm({
        objectIdentification: existingScore.objectIdentification,
        visualReasoning: existingScore.visualReasoning,
        completeness: existingScore.completeness,
        presentation: existingScore.presentation,
        reflection: existingScore.reflection,
        teacherFeedback: existingScore.teacherFeedback || ''
      });
    } else {
      setScoreForm({
        objectIdentification: 25,
        visualReasoning: 20,
        completeness: 18,
        presentation: 13,
        reflection: 8,
        teacherFeedback: 'Pengamatan objek sudah baik. Pertahankan ketelitian identifikasi ciri visual.'
      });
    }
    setIsGradingModalOpen(true);
  };

  // Open Detail View Modal
  const handleOpenView = (group: GroupSubmission) => {
    setSelectedGroup(group);
    setIsViewModalOpen(true);
  };

  // Save Score & Feedback per Section R & S
  const handleSaveScore = async () => {
    if (!selectedGroup) return;

    // Validate maximum boundaries
    const safeObj = Math.min(30, Math.max(0, Number(scoreForm.objectIdentification) || 0));
    const safeVis = Math.min(25, Math.max(0, Number(scoreForm.visualReasoning) || 0));
    const safeComp = Math.min(20, Math.max(0, Number(scoreForm.completeness) || 0));
    const safePres = Math.min(15, Math.max(0, Number(scoreForm.presentation) || 0));
    const safeRef = Math.min(10, Math.max(0, Number(scoreForm.reflection) || 0));
    const total = safeObj + safeVis + safeComp + safePres + safeRef;

    const payload: RubricScore = {
      groupId: selectedGroup.id,
      objectIdentification: safeObj,
      visualReasoning: safeVis,
      completeness: safeComp,
      presentation: safePres,
      reflection: safeRef,
      totalScore: total,
      teacherFeedback: scoreForm.teacherFeedback,
      gradedAt: new Date().toISOString(),
      gradedBy: operatorEmail
    };

    await saveRubricScore(payload);
    setIsGradingModalOpen(false);
    setActionSuccessMessage(`Nilai Kelompok ${selectedGroup.groupNumber} berhasil disimpan (${total}/100)!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Reopen submission per Section W
  const handleReopen = async (groupId: string, groupNum: string) => {
    if (confirm(`Buka kembali pengerjaan Kelompok ${groupNum} untuk revisi? Siswa akan dapat mengedit jawaban mereka kembali.`)) {
      await reopenGroupSubmission(groupId);
      setActionSuccessMessage(`Pengerjaan Kelompok ${groupNum} telah dibuka kembali (Status: Revisi).`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  // Image Upload handler per Section V
  const handleFileUpload = async (groupNumber: GroupNumber, file: File) => {
    setUploadingGroup(groupNumber);
    try {
      await uploadGroupImageFile(groupNumber, file);
      setActionSuccessMessage(`Citra wilayah Kelompok ${groupNumber} berhasil diunggah.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (err) {
      alert('Gagal mengunggah citra: ' + (err as Error).message);
    } finally {
      setUploadingGroup(null);
    }
  };

  // Image Remove handler per Section V
  const handleRemoveImage = async (groupNumber: GroupNumber) => {
    if (confirm(`Hapus citra untuk Kelompok ${groupNumber}?`)) {
      await removeGroupImage(groupNumber);
      setActionSuccessMessage(`Citra Kelompok ${groupNumber} telah dihapus.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  // Export CSV per Section U
  const handleExportCSV = () => {
    const headers = [
      'Nomor Kelompok',
      'Nama Kelompok',
      'Kelas',
      'Wilayah Pengamatan',
      'Status',
      'Identifikasi (Max 30)',
      'Ciri & Alasan (Max 25)',
      'Kelengkapan Tabel (Max 20)',
      'Presentasi (Max 15)',
      'Refleksi (Max 10)',
      'Nilai Akhir (100)',
      'Feedback Guru',
      'Waktu Submit'
    ];

    const rows = groupKeys.map((k) => {
      const g = groups[`group${k}`];
      const s = scores[`group${k}`];
      return [
        `Kelompok ${k}`,
        `"${g?.groupName || '-'}"`,
        `"${g?.className || '-'}"`,
        `"${GROUP_AREAS[k].regionName}"`,
        g?.status || 'not_started',
        s?.objectIdentification ?? '-',
        s?.visualReasoning ?? '-',
        s?.completeness ?? '-',
        s?.presentation ?? '-',
        s?.reflection ?? '-',
        s?.totalScore ?? '-',
        `"${(s?.teacherFeedback || '').replace(/"/g, '""')}"`,
        g?.submittedAt ? new Date(g.submittedAt).toLocaleString('id-ID') : '-'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_LKPD_Geografi_X_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print recap
  const handlePrintRecap = () => {
    window.print();
  };

  // Calculate Class Recap Stats (Section U)
  const gradedScores = groupKeys
    .map((k) => scores[`group${k}`]?.totalScore)
    .filter((s): s is number => typeof s === 'number');

  const classAverage =
    gradedScores.length > 0
      ? (gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length).toFixed(1)
      : '-';
  const highestScore = gradedScores.length > 0 ? Math.max(...gradedScores) : '-';
  const lowestScore = gradedScores.length > 0 ? Math.min(...gradedScores) : '-';

  const currentTotalCalculated =
    (Number(scoreForm.objectIdentification) || 0) +
    (Number(scoreForm.visualReasoning) || 0) +
    (Number(scoreForm.completeness) || 0) +
    (Number(scoreForm.presentation) || 0) +
    (Number(scoreForm.reflection) || 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-200">
      {/* Teacher Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 block leading-tight font-mono">
                GEOEXPLORE • OPERATOR
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                Dashboard Operator – LKPD Detektif Citra
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px]">
                {operatorEmail}
              </span>
              <span className="text-[10px] text-slate-500">Guru / Penguji Terautentikasi</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {actionSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-3 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Section N: DASHBOARD OPERATOR Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Jumlah Kelompok
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
              {totalGroups}
            </div>
            <span className="text-[11px] text-slate-500">Total rombel kelas</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 block">
              🔴 Belum Mulai
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 font-mono">
              {notStartedCount}
            </div>
            <span className="text-[11px] text-slate-500">Belum buka LKPD</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              🟡 Sedang Mengerjakan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono">
              {inProgressCount}
            </div>
            <span className="text-[11px] text-slate-500">Aktif berdiskusi</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
              🟢 Sudah Mengumpulkan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-mono">
              {submittedCount}
            </div>
            <span className="text-[11px] text-slate-500">Menunggu penilaian</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
              🔵 Sudah Dinilai
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 font-mono">
              {gradedCount}
            </div>
            <span className="text-[11px] text-slate-500">Nilai & feedback tersimpan</span>
          </div>
        </div>

        {/* Class Progress Bar per Section N */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Progress Pengumpulan Kelas: {totalCompletedOrSubmitted} dari {totalGroups} kelompok telah mengumpulkan
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Data sinkron otomatis secara real-time dari Firebase Firestore.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-linear-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(totalCompletedOrSubmitted / totalGroups) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 font-semibold">
              <span>0%</span>
              <span>{Math.round((totalCompletedOrSubmitted / totalGroups) * 100)}% Selesai</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'monitoring'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Monitoring & Penilaian Kelompok</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recap')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'recap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekap Nilai Kelas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'images'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Kelola Citra Wilayah</span>
          </button>
        </div>

        {/* ================= TAB 1: MONITORING & DAFTAR KELOMPOK (Section O & P) ================= */}
        {activeTab === 'monitoring' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Pengerjaan 6 Kelompok Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  Pantau progres pengerjaan, buka jawaban lengkap, berikan nilai rubrik 100 poin, atau buka kembali revisi.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Kelompok</th>
                    <th className="py-3 px-4">Area Pengamatan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Waktu Submit</th>
                    <th className="py-3 px-4 text-center">Nilai</th>
                    <th className="py-3 px-4 text-center">Aksi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groupKeys.map((k) => {
                    const g = groups[`group${k}`];
                    const s = scores[`group${k}`];
                    const area = GROUP_AREAS[k];

                    return (
                      <tr key={k} className="hover:bg-slate-50/80 transition">
                        {/* Kelompok */}
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          <div className="font-bold text-blue-900 font-mono text-sm">
                            Kelompok {k}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-[140px]">
                            {g?.groupName || 'Belum mendaftar'}
                          </div>
                        </td>

                        {/* Area */}
                        <td className="py-3.5 px-4 text-slate-700 max-w-[200px]">
                          <div className="font-medium text-xs truncate" title={area.regionName}>
                            {area.regionName}
                          </div>
                          <span className="text-[10px] text-slate-400">Malang</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {g?.status === 'graded' && (
                            <span className="px-2.5 py-1 rounded-full bg-blue-900 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs">
                              🔵 Sudah Dinilai
                            </span>
                          )}
                          {g?.status === 'submitted' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs">
                              🟢 Sudah Dikumpulkan
                            </span>
                          )}
                          {g?.status === 'revision' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] inline-flex items-center gap-1">
                              🟠 Revisi
                            </span>
                          )}
                          {g?.status === 'in_progress' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] inline-flex items-center gap-1">
                              🟡 Sedang Mengerjakan
                            </span>
                          )}
                          {(!g?.status || g.status === 'not_started') && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px] inline-flex items-center gap-1">
                              🔴 Belum Mulai
                            </span>
                          )}
                        </td>

                        {/* Progress */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${g?.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {g?.progress || 0}%
                            </span>
                          </div>
                        </td>

                        {/* Waktu Submit */}
                        <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                          {g?.submittedAt
                            ? new Date(g.submittedAt).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-'}
                        </td>

                        {/* Nilai */}
                        <td className="py-3.5 px-4 text-center">
                          {s?.totalScore !== undefined ? (
                            <span className="font-bold font-mono text-sm px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                              {s.totalScore}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>

                        {/* Aksi Guru (Section O: Lihat Jawaban, Nilai, Beri Komentar, Buka Kembali) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleOpenView(g || { ...GROUP_AREAS[k], id: `group${k}`, groupNumber: k } as any)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                              title="Lihat Jawaban Lengkap"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Lihat Jawaban</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenGrading(g || { ...GROUP_AREAS[k], id: `group${k}`, groupNumber: k } as any)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Beri Nilai & Komentar"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Nilai</span>
                            </button>

                            {g?.status === 'submitted' || g?.status === 'graded' ? (
                              <button
                                type="button"
                                onClick={() => handleReopen(g.id, k)}
                                className="px-2 py-1 rounded-lg border border-amber-300 hover:bg-amber-50 text-amber-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                                title="Buka Kembali untuk Siswa Revisi"
                              >
                                <RotateCcw className="w-3 h-3 text-amber-600" />
                                <span>Buka Kembali</span>
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 2: REKAP NILAI KELAS (Section U) ================= */}
        {activeTab === 'recap' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  REKAP NILAI KELAS
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ringkasan nilai seluruh kelompok berdasarkan 5 kriteria rubrik penginderaan jauh.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintRecap}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Rekap</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards per Section U */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Rata-rata Kelas
                </span>
                <div className="text-3xl font-black text-blue-900 font-mono mt-1">
                  {classAverage}
                </div>
                <span className="text-[11px] text-blue-600">dari kelompok yang telah dinilai</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Nilai Tertinggi
                </span>
                <div className="text-3xl font-black text-emerald-900 font-mono mt-1">
                  {highestScore}
                </div>
                <span className="text-[11px] text-emerald-600">Skor maksimum kelas</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  Nilai Terendah
                </span>
                <div className="text-3xl font-black text-amber-900 font-mono mt-1">
                  {lowestScore}
                </div>
                <span className="text-[11px] text-amber-600">Skor minimum kelas</span>
              </div>
            </div>

            {/* Section U Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3">Kelompok</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-3 text-center">Identifikasi (30)</th>
                    <th className="py-3 px-3 text-center">Alasan (25)</th>
                    <th className="py-3 px-3 text-center">Tabel (20)</th>
                    <th className="py-3 px-3 text-center">Presentasi (15)</th>
                    <th className="py-3 px-3 text-center">Refleksi (10)</th>
                    <th className="py-3 px-4 text-center bg-blue-50/70 font-black">Nilai Akhir (100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groupKeys.map((k) => {
                    const g = groups[`group${k}`];
                    const s = scores[`group${k}`];
                    const area = GROUP_AREAS[k];

                    return (
                      <tr key={k} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          Kelompok {k}
                          <span className="block text-[11px] font-normal text-slate-500">
                            {g?.groupName || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 max-w-[200px] truncate" title={area.regionName}>
                          {area.regionName}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">{s?.objectIdentification ?? '-'}</td>
                        <td className="py-3 px-3 text-center font-mono">{s?.visualReasoning ?? '-'}</td>
                        <td className="py-3 px-3 text-center font-mono">{s?.completeness ?? '-'}</td>
                        <td className="py-3 px-3 text-center font-mono">{s?.presentation ?? '-'}</td>
                        <td className="py-3 px-3 text-center font-mono">{s?.reflection ?? '-'}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-sm bg-blue-50/70 text-blue-900">
                          {s?.totalScore ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Rekap nilai disajikan tanpa perangkingan otomatis untuk menjaga kenyamanan pedagogis siswa.
            </p>
          </div>
        )}

        {/* ================= TAB 3: KELOLA CITRA WILAYAH (Section V) ================= */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                KELOLA CITRA KELOMPOK
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah gambar citra resolusi tinggi untuk masing-masing Kelompok 1 sampai 6. Citra akan langsung dapat diamati oleh kelompok terkait.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupKeys.map((k) => {
                const area = GROUP_AREAS[k];
                const currentImg = settings.groupImages[k] || groups[`group${k}`]?.imageUrl;
                const isUploading = uploadingGroup === k;

                return (
                  <div
                    key={k}
                    className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-blue-900 font-mono">
                          Kelompok {k}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Area {k}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2" title={area.regionName}>
                        {area.regionName}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {area.description}
                      </p>
                    </div>

                    {/* Image Preview Box per Section V */}
                    <div className="w-full h-44 rounded-xl bg-slate-900 overflow-hidden border border-slate-300 relative flex items-center justify-center">
                      {currentImg ? (
                        <img
                          src={currentImg}
                          alt={`Citra Kelompok ${k}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-1.5" />
                          <span className="text-xs text-slate-400 block font-medium">
                            Citra belum diunggah
                          </span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                          Mengunggah...
                        </div>
                      )}
                    </div>

                    {/* Action buttons: Ganti Citra & Hapus Citra */}
                    <div className="flex items-center gap-2 pt-2">
                      <label className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{currentImg ? 'Ganti Citra' : 'Unggah Citra'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(k, file);
                          }}
                        />
                      </label>

                      {currentImg && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(k)}
                          className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition cursor-pointer"
                          title="Hapus Citra"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: DETAIL JAWABAN SISWA (Section P) ================= */}
      {isViewModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/80">
              <div>
                <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                  Detail Monitoring Pengerjaan
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Kelompok {selectedGroup.groupNumber} – {selectedGroup.groupName || 'Tanpa Nama'} ({selectedGroup.className})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Wilayah: {selectedGroup.assignedArea || GROUP_AREAS[selectedGroup.groupNumber]?.regionName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Members & Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">Anggota Kelompok:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {selectedGroup.members
                      .filter((m) => m && m.trim().length > 0)
                      .map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                  </ul>
                </div>
                <div className="space-y-1 text-slate-600 text-xs">
                  <p>
                    <strong>Waktu Mulai:</strong>{' '}
                    {selectedGroup.startedAt ? new Date(selectedGroup.startedAt).toLocaleString('id-ID') : '-'}
                  </p>
                  <p>
                    <strong>Waktu Submit:</strong>{' '}
                    {selectedGroup.submittedAt ? new Date(selectedGroup.submittedAt).toLocaleString('id-ID') : '-'}
                  </p>
                  <p>
                    <strong>Progres Pengerjaan:</strong> {selectedGroup.progress}%
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedGroup.status}
                  </p>
                </div>
              </div>

              {/* Answers 1-5 */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-1">
                  1. Jawaban Pertanyaan Detektif Citra
                </h4>
                <div className="space-y-2 text-slate-700">
                  <p>
                    <strong className="block text-slate-900">Objek apa saja yang kalian temukan?</strong>
                    {selectedGroup.answers?.objectsSeen || <span className="italic text-slate-400">Belum diisi</span>}
                  </p>
                  <p>
                    <strong className="block text-slate-900">Objek paling mudah dikenali:</strong>
                    {selectedGroup.answers?.easiestObject || <span className="italic text-slate-400">Belum diisi</span>}
                  </p>
                  <p>
                    <strong className="block text-slate-900">Alasan mengenali objek tersebut:</strong>
                    {selectedGroup.answers?.easiestReason || <span className="italic text-slate-400">Belum diisi</span>}
                  </p>
                  <p>
                    <strong className="block text-slate-900">Objek paling sulit dikenali:</strong>
                    {selectedGroup.answers?.hardestObject || <span className="italic text-slate-400">Belum diisi</span>}
                  </p>
                  <p>
                    <strong className="block text-slate-900">Objek yang masih diragukan:</strong>
                    {selectedGroup.answers?.doubtfulObject || <span className="italic text-slate-400">Belum diisi</span>}
                  </p>
                </div>
              </div>

              {/* Observation Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-1">
                  2. Tabel Hasil Pengamatan Siswa
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2.5 w-10">No</th>
                        <th className="p-2.5">Objek Ditemukan</th>
                        <th className="p-2.5">Ciri yang Terlihat</th>
                        <th className="p-2.5">Alasan / Dugaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedGroup.observations?.map((row, idx) => (
                        <tr key={row.id}>
                          <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-medium">{row.objectName || '-'}</td>
                          <td className="p-2.5">{row.visualFeature || '-'}</td>
                          <td className="p-2.5">{row.reasonOrConjecture || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Presentation Objects */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-1">
                  3. Dua Objek Pilihan Presentasi (±1 Menit)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-1">Objek 1: {selectedGroup.presentationObjects?.obj1?.objectName || '-'}</span>
                    <p className="text-xs text-slate-600"><strong>Ciri:</strong> {selectedGroup.presentationObjects?.obj1?.visualFeature || '-'}</p>
                    <p className="text-xs text-slate-600 mt-1"><strong>Alasan:</strong> {selectedGroup.presentationObjects?.obj1?.reasonOrEvidence || '-'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">Objek 2: {selectedGroup.presentationObjects?.obj2?.objectName || '-'}</span>
                    <p className="text-xs text-slate-600"><strong>Ciri:</strong> {selectedGroup.presentationObjects?.obj2?.visualFeature || '-'}</p>
                    <p className="text-xs text-slate-600 mt-1"><strong>Alasan:</strong> {selectedGroup.presentationObjects?.obj2?.reasonOrEvidence || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Reflection */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-1">
                  4. Refleksi Kelompok
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong>Hal Baru:</strong> {selectedGroup.reflection?.learnedToday || '-'}</p>
                  <p><strong>Paling Mudah:</strong> {selectedGroup.reflection?.easiestLearned || '-'}</p>
                  <p><strong>Paling Sulit:</strong> {selectedGroup.reflection?.hardestLearned || '-'}</p>
                  <p><strong>Apakah 1 ciri cukup?</strong> {selectedGroup.reflection?.canIdentifyByShapeOnly || '-'}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenGrading(selectedGroup);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Buka Form Penilaian Kelompok Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FORM PENILAIAN OPERATOR (Section Q, R, S) ================= */}
      {isGradingModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up my-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                  Form Penilaian Guru (Rubrik 100 Poin)
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Penilaian: Kelompok {selectedGroup.groupNumber} ({selectedGroup.groupName || 'Tanpa Nama'})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGradingModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rubrik Form Inputs */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Total Score Banner */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-sky-300">
                    Nilai Akhir Kelompok
                  </span>
                  <div className="text-3xl font-black text-amber-300 font-mono">
                    {currentTotalCalculated} / 100
                  </div>
                </div>
                <div className="text-right text-xs text-sky-200">
                  <span>Maksimal 100 Poin</span>
                  <br />
                  <span>Dihitung Otomatis</span>
                </div>
              </div>

              {/* 1. Ketepatan Mengidentifikasi Objek (max 30) */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    1. Ketepatan Identifikasi Objek (Maksimal 30)
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={scoreForm.objectIdentification}
                      onChange={(e) =>
                        setScoreForm((prev) => ({
                          ...prev,
                          objectIdentification: Math.min(30, Math.max(0, Number(e.target.value) || 0))
                        }))
                      }
                      className="w-16 px-2 py-1 text-center font-bold border border-slate-300 rounded-lg text-blue-900 focus:border-blue-500"
                    />
                    <span className="text-slate-400">/ 30</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pedoman: 26–30 = lima atau lebih tepat | 21–25 = sebagian besar tepat | 16–20 = beberapa kurang | 0–15 = banyak belum tepat.
                </p>
              </div>

              {/* 2. Ciri Visual dan Alasan (max 25) */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    2. Ciri Visual dan Alasan (Maksimal 25)
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={scoreForm.visualReasoning}
                      onChange={(e) =>
                        setScoreForm((prev) => ({
                          ...prev,
                          visualReasoning: Math.min(25, Math.max(0, Number(e.target.value) || 0))
                        }))
                      }
                      className="w-16 px-2 py-1 text-center font-bold border border-slate-300 rounded-lg text-blue-900 focus:border-blue-500"
                    />
                    <span className="text-slate-400">/ 25</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pedoman: 21–25 = alasan jelas logis | 16–20 = cukup jelas | 11–15 = masih umum | 0–10 = kurang sesuai/tidak lengkap.
                </p>
              </div>

              {/* 3. Kelengkapan Tabel (max 20) */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    3. Kelengkapan Tabel Pengamatan (Maksimal 20)
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={scoreForm.completeness}
                      onChange={(e) =>
                        setScoreForm((prev) => ({
                          ...prev,
                          completeness: Math.min(20, Math.max(0, Number(e.target.value) || 0))
                        }))
                      }
                      className="w-16 px-2 py-1 text-center font-bold border border-slate-300 rounded-lg text-blue-900 focus:border-blue-500"
                    />
                    <span className="text-slate-400">/ 20</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pedoman: 17–20 = lengkap & terisi baik | 13–16 = hampir lengkap | 9–12 = beberapa kosong | 0–8 = sebagian besar belum lengkap.
                </p>
              </div>

              {/* 4. Diskusi / Presentasi (max 15) */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    4. Hasil Diskusi / Presentasi (Maksimal 15)
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={scoreForm.presentation}
                      onChange={(e) =>
                        setScoreForm((prev) => ({
                          ...prev,
                          presentation: Math.min(15, Math.max(0, Number(e.target.value) || 0))
                        }))
                      }
                      className="w-16 px-2 py-1 text-center font-bold border border-slate-300 rounded-lg text-blue-900 focus:border-blue-500"
                    />
                    <span className="text-slate-400">/ 15</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pedoman: 13–15 = sangat jelas + bukti visual | 10–12 = cukup jelas | 7–9 = masih terbatas | 0–6 = belum mampu menjelaskan baik.
                </p>
              </div>

              {/* 5. Refleksi dan Kerja Kelompok (max 10) */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    5. Refleksi dan Kerja Kelompok (Maksimal 10)
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={scoreForm.reflection}
                      onChange={(e) =>
                        setScoreForm((prev) => ({
                          ...prev,
                          reflection: Math.min(10, Math.max(0, Number(e.target.value) || 0))
                        }))
                      }
                      className="w-16 px-2 py-1 text-center font-bold border border-slate-300 rounded-lg text-blue-900 focus:border-blue-500"
                    />
                    <span className="text-slate-400">/ 10</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pedoman: 9–10 = refleksi lengkap & paham | 7–8 = cukup lengkap | 5–6 = masih sederhana | 0–4 = belum lengkap.
                </p>
              </div>

              {/* Section S: Catatan / Feedback Guru */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Catatan / Feedback Guru
                </label>
                <textarea
                  rows={3}
                  value={scoreForm.teacherFeedback}
                  onChange={(e) => setScoreForm((prev) => ({ ...prev, teacherFeedback: e.target.value }))}
                  placeholder="Contoh: Identifikasi objek sudah baik. Perhatikan kembali alasan dalam membedakan jalan dan sungai..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsGradingModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveScore}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Simpan Nilai & Komentar (🔵 Sudah Dinilai)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
