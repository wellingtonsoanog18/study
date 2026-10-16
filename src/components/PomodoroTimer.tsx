import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Timer, Sparkles, CheckCircle2 } from 'lucide-react';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  totalStudyMinutes: number;
  onAddMinutes: (minutes: number) => Promise<void>;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  totalStudyMinutes,
  onAddMinutes
}) => {
  const [mode, setMode] = useState<'25' | '50' | 'free'>('25');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<string | null>(null);

  const initialTimeForMode = mode === '25' ? 25 * 60 : mode === '50' ? 50 * 60 : 0;

  // Synthesize pleasant gentle notification chime via Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime + 0.15);
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.9);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'free') {
          // Stopwatch counts up
          setTimeLeft(prev => prev + 1);
        } else {
          // Countdown
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              playChime();
              const mins = mode === '25' ? 25 : 50;
              onAddMinutes(mins);
              setSessionCompletedNotice(`Parabéns! Sessão de ${mins} minutos de estudo líquido concluída e registrada!`);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, onAddMinutes]);

  const switchMode = (newMode: '25' | '50' | 'free') => {
    setIsRunning(false);
    setMode(newMode);
    setSessionCompletedNotice(null);
    if (newMode === '25') setTimeLeft(25 * 60);
    else if (newMode === '50') setTimeLeft(50 * 60);
    else setTimeLeft(0);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionCompletedNotice(null);
    if (mode === '25') setTimeLeft(25 * 60);
    else if (mode === '50') setTimeLeft(50 * 60);
    else setTimeLeft(0);
  };

  const handleFinishFreeSession = () => {
    if (timeLeft >= 60) {
      const minutes = Math.floor(timeLeft / 60);
      onAddMinutes(minutes);
      setSessionCompletedNotice(`Sessão livre finalizada: +${minutes} min adicionados ao seu perfil!`);
    }
    resetTimer();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = mode === 'free'
    ? Math.min(100, Math.round((timeLeft / 3600) * 100))
    : Math.round(((initialTimeForMode - timeLeft) / initialTimeForMode) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pomodoro-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-indigo-400" />
            <h2 id="pomodoro-modal-title" className="text-base font-bold text-white">
              Cronômetro de Estudo Líquido
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar cronômetro"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-5 flex flex-col items-center">
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-6 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => switchMode('25')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === '25'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              25 min (Foco)
            </button>
            <button
              type="button"
              onClick={() => switchMode('50')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === '50'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              50 min (Profundo)
            </button>
            <button
              type="button"
              onClick={() => switchMode('free')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'free'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Livre (Cronômetro)
            </button>
          </div>

          {/* Big Time Display with Ring Glow */}
          <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/70 shadow-inner mb-6">
            <div
              className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-pulse pointer-events-none"
              style={{ opacity: isRunning ? 1 : 0.2 }}
            />
            <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-wider">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
              {isRunning ? 'Em Andamento' : timeLeft === 0 ? 'Concluído' : 'Pausado'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={resetTimer}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reiniciar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Iniciar Foco</span>
                </>
              )}
            </button>

            {mode === 'free' && timeLeft >= 60 && (
              <button
                type="button"
                onClick={handleFinishFreeSession}
                className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
                title="Salvar horas livres"
              >
                Salvar
              </button>
            )}
          </div>

          {sessionCompletedNotice && (
            <div className="w-full p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs text-center flex items-center justify-center gap-2 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{sessionCompletedNotice}</span>
            </div>
          )}

          {/* Accumulated Hours Pill */}
          <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Total de Estudo Líquido Acumulado:
            </span>
            <span className="font-mono font-bold text-white">
              {(totalStudyMinutes / 60).toFixed(1)} horas ({totalStudyMinutes} min)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
