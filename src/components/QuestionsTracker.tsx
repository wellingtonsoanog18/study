import React from 'react';
import { X, HelpCircle, Check, Plus, Minus, RotateCcw, TrendingUp } from 'lucide-react';
import { calculateAccuracy } from '../utils/studyLogic';

interface QuestionsTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    total: number;
    correct: number;
    wrong: number;
  };
  onUpdateStats: (newStats: { total: number; correct: number; wrong: number }) => Promise<void>;
}

export const QuestionsTracker: React.FC<QuestionsTrackerProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats
}) => {
  if (!isOpen) return null;

  const { total, correct, wrong } = stats;
  const accuracy = calculateAccuracy(correct, total);

  const getAccuracyBadgeColor = (acc: number) => {
    if (acc >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (acc >= 65) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const handleAddQuestion = (isCorrect: boolean, amount: number = 1) => {
    const newCorrect = isCorrect ? correct + amount : correct;
    const newWrong = !isCorrect ? wrong + amount : wrong;
    const newTotal = total + amount;
    onUpdateStats({ total: newTotal, correct: newCorrect, wrong: newWrong });
  };

  const handleReset = () => {
    if (confirm('Zerar contador de questões da sessão?')) {
      onUpdateStats({ total: 0, correct: 0, wrong: 0 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="questions-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <h2 id="questions-modal-title" className="text-base font-bold text-white">
              Rastreador de Questões & Rendimento
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar rastreador de questões"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Main Accuracy Ring / Card */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Taxa de Aproveitamento
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-4xl font-extrabold font-mono ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 65 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {total > 0 ? `${accuracy}%` : '--%'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {accuracy >= 80 ? 'Excelente (Na faixa de aprovação)' : accuracy >= 65 ? 'Bom (Reforçar erros)' : 'Abaixo da meta (Revisar teoria)'}
                </span>
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${getAccuracyBadgeColor(accuracy)}`}>
              {correct}/{total} ACERTOS
            </div>
          </div>

          {/* Quick Counter Controllers */}
          <div className="grid grid-cols-2 gap-3">
            {/* Correct Column */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Acertos</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{correct}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion(true, 1)}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  +1 Acerto
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion(true, 5)}
                  className="px-2.5 py-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-emerald-200 font-bold text-xs"
                  title="+5 acertos"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Wrong Column */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">Erros</span>
                <span className="text-2xl font-black font-mono text-rose-400">{wrong}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion(false, 1)}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  +1 Erro
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion(false, 5)}
                  className="px-2.5 py-2 rounded-lg bg-rose-700/60 hover:bg-rose-700 text-rose-200 font-bold text-xs"
                  title="+5 erros"
                >
                  +5
                </button>
              </div>
            </div>
          </div>

          {/* Footer Reset */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Total resolvido: <strong className="text-white font-mono">{total}</strong> questões</span>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zerar Contador</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
