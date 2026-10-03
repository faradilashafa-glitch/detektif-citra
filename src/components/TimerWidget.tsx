import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertTriangle } from 'lucide-react';

interface TimerWidgetProps {
  initialSeconds?: number; // default 2700 (45 mins)
  startedAt?: string | null;
  autoStart?: boolean;
  compact?: boolean;
}

export function TimerWidget({
  initialSeconds = 2700,
  startedAt,
  autoStart = true,
  compact = false
}: TimerWidgetProps) {
  // Hitung sisa waktu berdasarkan startedAt jika ada
  const calculateInitialSeconds = () => {
    if (startedAt) {
      const startTime = new Date(startedAt).getTime();
      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      return Math.max(0, initialSeconds - elapsedSeconds);
    }
    return initialSeconds;
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateInitialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  useEffect(() => {
    // Sinkronisasi jika startedAt berubah
    if (startedAt) {
      setSecondsLeft(calculateInitialSeconds());
      setIsRunning(true);
    }
  }, [startedAt]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeLow = secondsLeft <= 300 && secondsLeft > 0; // 5 menit terakhir

  const handleToggle = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
        isTimeLow
          ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
          : isRunning
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          : 'bg-slate-100/90 border-slate-200/80 text-slate-700'
      }`}>
        <Clock className={`w-3.5 h-3.5 ${isRunning ? (isTimeLow ? 'text-rose-600' : 'text-emerald-600 animate-pulse') : 'text-slate-400'}`} />
        <span className="font-mono font-bold">{timeFormatted}</span>
        <div className="flex items-center gap-1 ml-1 border-l border-slate-300/80 pl-1.5">
          <button
            type="button"
            onClick={handleToggle}
            className="p-0.5 hover:text-blue-600 rounded transition cursor-pointer"
            title={isRunning ? 'Jeda Timer' : 'Mulai Timer'}
          >
            {isRunning ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-0.5 hover:text-rose-600 rounded transition cursor-pointer"
            title="Reset Timer ke 45 Menit"
          >
            <RotateCcw className="w-2.5 h-2.5 text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-4 sm:p-5 border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
      isTimeLow
        ? 'bg-rose-50/90 border-rose-300'
        : 'bg-white border-blue-100'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-2xl ${
          isTimeLow
            ? 'bg-rose-500 text-white animate-bounce'
            : isRunning
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-blue-50 text-blue-600'
        }`}>
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Waktu Aktivitas Siswa
            </span>
            {isRunning && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Otomatis Berjalan
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              isTimeLow ? 'text-rose-700' : 'text-slate-800'
            }`}>
              {timeFormatted}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 45 Menit (1 JP)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <button
          type="button"
          onClick={handleToggle}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shadow-xs ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Jeda Sementara
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Lanjutkan Waktu
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset 45m
        </button>
      </div>
    </div>
  );
}
