import React, { useState, useEffect } from 'react';
import {
  GroupNumber,
  GroupSubmission,
  RubricScore,
  StudentStepKey
} from '../types';
import { STEPS, GROUP_AREAS } from '../utils/constants';
import {
  saveGroupProgress,
  submitGroupLKPD
} from '../services/firebase';
import { TimerWidget } from './TimerWidget';
import { StepIdentity } from './StepIdentity';
import { StepInstructions } from './StepInstructions';
import { StepMaterial } from './StepMaterial';
import { StepObservation } from './StepObservation';
import { StepTable } from './StepTable';
import { StepPresentation } from './StepPresentation';
import { StepReflection } from './StepReflection';
import { StepSummary } from './StepSummary';
import {
  MapPin,
  CheckCircle2,
  Clock,
  Home,
  Save,
  ChevronRight,
  Shield,
  Layers,
  Award
} from 'lucide-react';

interface StudentLKPDProps {
  initialSubmission: GroupSubmission;
  score?: RubricScore | null;
  onBackToHome: () => void;
}

export function StudentLKPD({
  initialSubmission,
  score,
  onBackToHome
}: StudentLKPDProps) {
  const [submission, setSubmission] = useState<GroupSubmission>(initialSubmission);
  const [currentStep, setCurrentStep] = useState<StudentStepKey>('identity');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Tersimpan di Cloud');

  // Keep submission synced with props if updated externally (e.g. status change to revision or graded)
  useEffect(() => {
    setSubmission((prev) => ({
      ...initialSubmission,
      // preserve local in-flight edits if same id
      answers: { ...initialSubmission.answers, ...prev.answers },
      observations: prev.observations.length > 0 ? prev.observations : initialSubmission.observations,
      presentationObjects: prev.presentationObjects || initialSubmission.presentationObjects,
      reflection: { ...initialSubmission.reflection, ...prev.reflection }
    }));
  }, [initialSubmission.status, initialSubmission.imageUrl]);

  // Calculate Progress Percentage dynamically (Section AA)
  const calculateProgress = (): number => {
    if (submission.status === 'submitted' || submission.status === 'graded') {
      return 100;
    }
    let p = 0;
    // Identity: groupName + at least 3 members
    const filledMembers = submission.members.filter((m) => m.trim().length > 0).length;
    if (submission.groupName.trim() && filledMembers >= 3) p += 15;

    // Initial questions (out of 5)
    const qCount = [
      submission.answers.objectsSeen,
      submission.answers.easiestObject,
      submission.answers.easiestReason,
      submission.answers.hardestObject,
      submission.answers.doubtfulObject
    ].filter((q) => q && q.trim().length > 0).length;
    p += Math.round((qCount / 5) * 25);

    // Observations table (target 5+ objects)
    const filledObs = submission.observations.filter(
      (o) => o.objectName.trim() && o.visualFeature.trim()
    ).length;
    p += Math.min(25, Math.round((filledObs / 5) * 25));

    // Presentation (2 objects)
    const presFilled =
      (submission.presentationObjects.obj1.objectName.trim() ? 7.5 : 0) +
      (submission.presentationObjects.obj2.objectName.trim() ? 7.5 : 0);
    p += Math.round(presFilled);

    // Reflection (4 questions)
    let refCount = 0;
    if (submission.reflection.learnedToday?.trim()) refCount++;
    if (submission.reflection.easiestLearned?.trim()) refCount++;
    if (submission.reflection.hardestLearned?.trim()) refCount++;
    if (submission.reflection.canIdentifyByShapeOnly !== null) refCount++;
    p += Math.round((refCount / 4) * 20);

    return Math.min(100, Math.max(0, p));
  };

  const progressPercent = calculateProgress();

  // Auto-save debounce whenever submission changes
  useEffect(() => {
    if (submission.status === 'submitted' || submission.status === 'graded') return;

    const timeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveGroupProgress({
          ...submission,
          progress: progressPercent
        });
        const now = new Date();
        setLastSavedTime(`Tersimpan ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`);
      } catch (err) {
        console.warn('Auto-save error notice:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [submission, progressPercent]);

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await saveGroupProgress({
        ...submission,
        progress: progressPercent
      });
      const now = new Date();
      setLastSavedTime(`Tersimpan ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    await submitGroupLKPD({
      ...submission,
      progress: 100
    });
    setSubmission((prev) => ({
      ...prev,
      status: 'submitted',
      progress: 100,
      submittedAt: new Date().toISOString()
    }));
  };

  const isReadOnly = submission.status === 'submitted' || submission.status === 'graded';
  const currentArea = GROUP_AREAS[submission.groupNumber];

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const goToStep = (key: StudentStepKey) => {
    setCurrentStep(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Status badge styling per Section AB
  const renderStatusBadge = () => {
    switch (submission.status) {
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900 text-white text-xs font-bold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>🔵 Sudah Dinilai</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>🟢 Sudah Dikumpulkan</span>
          </span>
        );
      case 'revision':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-2xs">
            <span>🟠 Revisi (Dapat Diedit)</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <span>🟡 Sedang Mengerjakan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold">
            <span>🔴 Belum Mulai</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/60 text-slate-800 flex flex-col font-sans selection:bg-blue-200">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Group & Home Link */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                title="Kembali ke Beranda"
              >
                <Home className="w-5 h-5" />
              </button>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-blue-900 font-mono">
                    Kelompok {submission.groupNumber}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate max-w-[140px] sm:max-w-[200px]">
                    {submission.groupName || 'Tanpa Nama'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[220px] sm:max-w-md">
                  <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="truncate">{currentArea.regionName}</span>
                </div>
              </div>
            </div>

            {/* Right: Status badge & Timer & Save State */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <TimerWidget initialSeconds={2700} startedAt={submission.startedAt} autoStart={true} compact={true} />
              </div>

              {renderStatusBadge()}

              <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                <Save className={`w-3 h-3 ${isSaving ? 'text-amber-500 animate-spin' : 'text-emerald-500'}`} />
                <span>{isSaving ? 'Menyimpan...' : lastSavedTime}</span>
              </div>
            </div>
          </div>

          {/* Section AA: Progress Bar Siswa */}
          <div className="pb-2.5 pt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">
                Progress Kelompok: <span className="text-blue-600 font-mono">{progressPercent}%</span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Tahap: {STEPS[currentStepIndex]?.label} ({currentStepIndex + 1}/8)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="flex items-center overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar border-t border-slate-100 gap-1 sm:gap-2">
            {STEPS.map((step) => {
              const isActive = step.key === currentStep;
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => goToStep(step.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center ${
                    isActive ? 'bg-white text-blue-600 font-bold' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.number}
                  </span>
                  <span>{step.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Form Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentStep === 'identity' && (
          <StepIdentity
            identity={{
              groupNumber: submission.groupNumber,
              groupName: submission.groupName,
              className: submission.className,
              members: submission.members,
              assignedArea: submission.assignedArea
            }}
            onChange={(updated) => setSubmission((prev) => ({ ...prev, ...updated }))}
            onNext={handleNextStep}
            isReadOnly={isReadOnly}
          />
        )}

        {currentStep === 'instructions' && (
          <StepInstructions startedAt={submission.startedAt} onPrev={handlePrevStep} onNext={handleNextStep} />
        )}

        {currentStep === 'material' && (
          <StepMaterial onPrev={handlePrevStep} onNext={handleNextStep} />
        )}

        {currentStep === 'image_observation' && (
          <StepObservation
            groupNumber={submission.groupNumber}
            imageSrc={submission.imageUrl}
            questions={submission.answers}
            onChangeQuestions={(updated) =>
              setSubmission((prev) => ({
                ...prev,
                answers: { ...prev.answers, ...updated }
              }))
            }
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            isReadOnly={isReadOnly}
          />
        )}

        {currentStep === 'table_objects' && (
          <StepTable
            rows={submission.observations}
            onChangeRows={(rows) =>
              setSubmission((prev) => ({ ...prev, observations: rows }))
            }
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            isReadOnly={isReadOnly}
          />
        )}

        {currentStep === 'presentation' && (
          <StepPresentation
            presentationObjects={submission.presentationObjects}
            detectedRows={submission.observations}
            onChange={(updated) =>
              setSubmission((prev) => ({ ...prev, presentationObjects: updated }))
            }
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            isReadOnly={isReadOnly}
          />
        )}

        {currentStep === 'reflection' && (
          <StepReflection
            reflection={submission.reflection}
            onChange={(updated) =>
              setSubmission((prev) => ({
                ...prev,
                reflection: { ...prev.reflection, ...updated }
              }))
            }
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            isReadOnly={isReadOnly}
          />
        )}

        {currentStep === 'summary_or_grade' && (
          <StepSummary
            submission={submission}
            score={score}
            onSaveDraft={handleManualSave}
            onSubmitLKPD={handleSubmit}
            onNavigateToStep={goToStep}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
  );
}
