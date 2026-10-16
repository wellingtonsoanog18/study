import React from 'react';
import { WeekPlan } from '../types';
import { Lock, Sparkles, LogIn, Mail, ShieldAlert } from 'lucide-react';
import { User } from 'firebase/auth';

interface RestrictedWeekNoticeProps {
  week: WeekPlan;
  currentUser: User | null;
  onLogin: () => void;
  onOpenManageWeeks: () => void;
  isCoordinatorDemo: boolean;
}

export const RestrictedWeekNotice: React.FC<RestrictedWeekNoticeProps> = ({
  week,
  currentUser,
  onLogin,
  onOpenManageWeeks,
  isCoordinatorDemo
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lock Icon */}
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Mentoria VIP Restrita
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {week.title}
        </h2>

        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Este módulo avançado contém cronogramas exclusivos, simulados inéditos e materiais direcionados da Mentoria VIP. O acesso é liberado apenas para contas autorizadas pela coordenação.
        </p>
      </div>

      {/* Auth / Action Section */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 max-w-md mx-auto space-y-3">
        {!currentUser ? (
          <div>
            <p className="text-xs text-slate-400 mb-3">
              Já é um aluno matriculado? Faça login com a sua conta Google cadastrada para liberar o cronograma:
            </p>
            <button
              type="button"
              onClick={onLogin}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar com Google para Acessar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              Você está conectado como: <strong className="text-slate-200">{currentUser.email}</strong>
            </p>
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-300">
              Seu e-mail ainda não foi adicionado à lista de permissões da Semana {week.weekNumber}. Entre em contato com a coordenação para solicitar liberação.
            </div>

            {isCoordinatorDemo && (
              <button
                type="button"
                onClick={onOpenManageWeeks}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Painel da Coordenação: Autorizar E-mails nesta Semana</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
