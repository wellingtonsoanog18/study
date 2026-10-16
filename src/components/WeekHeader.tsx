import React from 'react';
import { WeekPlan } from '../types';
import {
  Calendar,
  Lock,
  Globe,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Edit3
} from 'lucide-react';

interface WeekHeaderProps {
  week: WeekPlan;
  totalBlocks: number;
  completedBlocksCount: number;
  progressPercent: number;
  isAdmin: boolean;
  onOpenManageWeeks: () => void;
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({
  week,
  totalBlocks,
  completedBlocksCount,
  progressPercent,
  isAdmin,
  onOpenManageWeeks
}) => {
  // Calculate total estimated hours
  let totalMinutes = 0;
  week.days.forEach(d => {
    [d.b1, d.b2, d.b3].forEach(b => {
      if (b && b.durationMin) totalMinutes += b.durationMin;
    });
  });
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Info */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-3.5 h-3.5" />
              Semana {week.weekNumber}
            </span>

            {week.access === 'ALL' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Globe className="w-3.5 h-3.5" />
                Pública (Acesso Aberto)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="w-3.5 h-3.5" />
                Restrita (Mentoria VIP)
              </span>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={onOpenManageWeeks}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Editar esta semana no painel"
              >
                <Edit3 className="w-3 h-3 text-indigo-400" />
                Editar no Painel
              </button>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {week.title}
          </h1>

          {week.description && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {week.description}
            </p>
          )}
        </div>

        {/* Right Stats & Progress */}
        <div className="lg:w-80 flex-shrink-0 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Meta Semanal
            </span>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Micro metrics grid */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
                <Layers className="w-3 h-3" />
                Blocos
              </p>
              <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                {completedBlocksCount}/{totalBlocks}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Carga
              </p>
              <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                ~{totalHours}h
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Status
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${progressPercent === 100 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                {progressPercent === 100 ? 'Concluída!' : 'Em Curso'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
