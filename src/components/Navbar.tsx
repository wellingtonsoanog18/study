import React from 'react';
import {
  Sparkles,
  Timer,
  CheckCircle2,
  Settings,
  LogIn,
  LogOut,
  User as UserIcon,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentUser: User | null;
  isAdmin: boolean;
  totalProgress: number;
  pomodoroActive: boolean;
  pomodoroTimeDisplay: string;
  onOpenPomodoro: () => void;
  onOpenQuestions: () => void;
  onOpenMementos: () => void;
  onOpenManageWeeks: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onToggleCoordinatorDemo?: () => void;
  isCoordinatorDemo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isAdmin,
  totalProgress,
  pomodoroActive,
  pomodoroTimeDisplay,
  onOpenPomodoro,
  onOpenQuestions,
  onOpenMementos,
  onOpenManageWeeks,
  onLogin,
  onLogout,
  onToggleCoordinatorDemo,
  isCoordinatorDemo
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                StudyFlow<span className="text-indigo-400 font-bold">Pro</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MetaEstudos 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Gestão Dinâmica de Estudos & Mentoria Semanal
            </p>
          </div>
        </div>

        {/* Center Progress Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Progresso Geral:</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">{totalProgress}%</span>
        </div>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer Trigger */}
          <button
            type="button"
            onClick={onOpenPomodoro}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              pomodoroActive
                ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
            title="Abrir Cronômetro Pomodoro"
          >
            <Timer className={`w-4 h-4 ${pomodoroActive ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Pomodoro</span>
            {pomodoroActive && (
              <span className="font-mono text-indigo-300 font-semibold">{pomodoroTimeDisplay}</span>
            )}
          </button>

          {/* Question Tracker Trigger */}
          <button
            type="button"
            onClick={onOpenQuestions}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            title="Rastreador de Questões & Rendimento"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Questões</span>
          </button>

          {/* AI Mementos & PDFs Generator */}
          <button
            type="button"
            onClick={onOpenMementos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 hover:text-white hover:border-indigo-400 transition-all shadow-sm"
            title="Gerador de Mementos, PDFs e Questões com IA"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">IA & Mementos</span>
          </button>

          {/* Admin / Coordination Management */}
          {(isAdmin || isCoordinatorDemo) && (
            <button
              type="button"
              onClick={onOpenManageWeeks}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
              title="Gerenciar Semanas & Importar Cronogramas JSON"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Coordenação</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-800 text-[10px] uppercase font-bold tracking-wider">
                Admin
              </span>
            </button>
          )}

          {/* Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg bg-slate-900 border border-slate-800">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Aluno'}
                    className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs text-slate-300 max-w-[100px] truncate hidden md:inline">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sair da conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Entrar com Google</span>
            </button>
          )}

          {/* Demo toggle for coordinator mode preview if visitor */}
          {!isAdmin && onToggleCoordinatorDemo && (
            <button
              type="button"
              onClick={onToggleCoordinatorDemo}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isCoordinatorDemo
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={
                isCoordinatorDemo
                  ? 'Modo Demonstração de Coordenador Ativo'
                  : 'Testar Painel de Coordenação (Demo Coordenador)'
              }
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
