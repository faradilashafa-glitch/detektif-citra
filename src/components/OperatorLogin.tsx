import React, { useState } from 'react';
import {
  signInTeacherWithGoogle,
  auth
} from '../services/firebase';
import {
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  LogIn,
  Lock,
  User
} from 'lucide-react';

interface OperatorLoginProps {
  onLoginSuccess: (email: string) => void;
  onBackToHome: () => void;
}

export function OperatorLogin({ onLoginSuccess, onBackToHome }: OperatorLoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Silakan masukkan username dan kata sandi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Verifikasi kredensial guru
    if (cleanUser === 'gurugeosmandasa' && cleanPass === 'citrajauh') {
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('gurugeosmandasa (Guru Geografi)');
      }, 400);
      return;
    }

    // Dukungan login alternatif email Firebase
    if (cleanUser.includes('@')) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanUser, cleanPass);
        onLoginSuccess(cred.user.email || cleanUser);
        setIsLoading(false);
        return;
      } catch (err: any) {
        console.warn('Firebase email auth fallback:', err);
      }
    }

    setIsLoading(false);
    setErrorMessage('Username atau kata sandi tidak valid. Akses hanya untuk guru.');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInTeacherWithGoogle();
      onLoginSuccess(user.email || 'gurugeosmandasa (Guru Geografi)');
    } catch (err: any) {
      console.warn('Google sign-in notice:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela login ditutup sebelum selesai.');
      } else {
        setErrorMessage('Login Google belum berhasil. Silakan gunakan username guru.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama GeoExplore</span>
        </button>

        {/* Card Box */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Akses Khusus Guru</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Operator
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Halaman ini diperuntukkan khusus bagi guru pengampu pembelajaran.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form Login Pribadi Guru */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk Dashboard'}</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
              atau
            </span>
          </div>

          {/* Alternate: Google Sign In via Firebase */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk dengan Akun Google</span>
          </button>
        </div>

        {/* Security notice */}
        <p className="text-center text-[11px] text-slate-400">
          Autentikasi aman melalui sistem sekolah. Siswa dilarang mencoba mengakses halaman ini.
        </p>
      </div>
    </div>
  );
}
