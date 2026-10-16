import React from 'react';
import { WeekPlan } from '../types';
import { Lock, Check, Sparkles } from 'lucide-react';
import { canUserAccessWeek } from '../utils/studyLogic';

interface WeekSelectorProps {
  weeks: WeekPlan[];
  selectedWeekId: string;
  onSelectWeek: (weekId: string) => void;
  userEmail?: string | null;
  isAdmin: boolean;
  getWeekProgressPercent: (week: WeekPlan) => number;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  weeks,
  selectedWeekId,
  onSelectWeek,
  userEmail,
  isAdmin,
  getWeekProgressPercent
}) => {
  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Semanas:
        </span>

        {weeks.map((week) => {
          const isSelected = week.id === selectedWeekId;
          const hasAccess = canUserAccessWeek(week, userEmail, isAdmin);
          const progress = getWeekProgressPercent(week);
          const isDone = progress === 100;

          return (
            <button
              key={week.id}
              type="button"
              onClick={() => onSelectWeek(week.id)}
              className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <span className="font-semibold">{week.title.split(':')[0] || `Semana ${week.weekNumber}`}</span>

              {/* Status Indicator */}
              {week.access === 'RESTRICTED' && !hasAccess ? (
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-indigo-900/80 text-amber-300' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                  title="Conteúdo Restrito à Mentoria VIP"
                >
                  <Lock className="w-2.5 h-2.5" />
                  VIP
                </span>
              ) : isDone ? (
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${
                    isSelected ? 'bg-white text-indigo-700' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                  title="Semana 100% Concluída"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              ) : progress > 0 ? (
                <span
                  className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {progress}%
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
