import React from 'react';
import { DayPlan, StudyBlock, StudyMaterial } from '../types';
import { BlockItem } from './BlockItem';
import { CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { isDayCompleted } from '../utils/studyLogic';

interface DayCardProps {
  day: DayPlan;
  weekId: string;
  completedBlockKeys: Set<string>;
  onToggleBlock: (blockKey: string) => void;
  onToggleWholeDay: (day: DayPlan, currentlyComplete: boolean) => void;
  onPlayVideo: (block: StudyBlock) => void;
  onOpenMaterials: (dayName: string, blockIdx: number, blockTitle: string) => void;
  onOpenNotes: (blockKey: string, blockTitle: string) => void;
  onOpenMementos: (block: StudyBlock, blockKey: string) => void;
  notes: Record<string, string>;
  allMaterials: StudyMaterial[];
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  weekId,
  completedBlockKeys,
  onToggleBlock,
  onToggleWholeDay,
  onPlayVideo,
  onOpenMaterials,
  onOpenNotes,
  onOpenMementos,
  notes,
  allMaterials
}) => {
  const blocks = [
    { block: day.b1, idx: 1 },
    { block: day.b2, idx: 2 },
    { block: day.b3, idx: 3 }
  ].filter((b): b is { block: StudyBlock; idx: number } => Boolean(b.block && b.block.title));

  const completedCount = blocks.filter(b => {
    const key = `${weekId}_${day.day}_b${b.idx}`;
    return completedBlockKeys.has(key);
  }).length;

  const isComplete = blocks.length > 0 && completedCount === blocks.length;

  return (
    <div
      className={`flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
        isComplete
          ? 'bg-slate-900/60 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Day Header */}
      <div
        className={`px-4 py-3.5 border-b flex items-center justify-between gap-3 ${
          isComplete
            ? 'bg-emerald-950/20 border-emerald-500/20'
            : 'bg-slate-900/80 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs tracking-wider font-mono border ${
              isComplete
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {day.shortDay || day.day.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              {day.day}
              {isComplete && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            </h2>
            {day.dateLabel && (
              <p className="text-[11px] text-slate-400 font-medium">{day.dateLabel}</p>
            )}
          </div>
        </div>

        {/* Day Completion Toggle & Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-400">
            <span className={isComplete ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
              {completedCount}
            </span>
            /{blocks.length}
          </span>

          <button
            type="button"
            onClick={() => onToggleWholeDay(day, isComplete)}
            aria-label={isComplete ? `Desmarcar ${day.day}` : `Fechar ${day.day}`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isComplete
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isComplete ? 'Desmarcar dia completo' : 'Marcar todos os blocos do dia como concluídos'}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isComplete ? 'Concluído' : 'Fechar Dia'}</span>
          </button>
        </div>
      </div>

      {/* Blocks Container */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-start">
        {blocks.map(({ block, idx }) => {
          const blockKey = `${weekId}_${day.day}_b${idx}`;
          const isBlockCompleted = completedBlockKeys.has(blockKey);
          const hasNotes = Boolean(notes[blockKey] && notes[blockKey].trim());
          const materialsCount = allMaterials.filter(
            m => m.weekId === weekId && m.day === day.day && m.blockIdx === idx
          ).length;

          return (
            <BlockItem
              key={blockKey}
              block={block}
              blockIdx={idx}
              blockKey={blockKey}
              isCompleted={isBlockCompleted}
              onToggleComplete={() => onToggleBlock(blockKey)}
              onPlayVideo={onPlayVideo}
              onOpenMaterials={(bIdx, bTitle) => onOpenMaterials(day.day, bIdx, bTitle)}
              onOpenNotes={(bKey, bTitle) => onOpenNotes(bKey, bTitle)}
              onOpenMementos={onOpenMementos}
              hasNotes={hasNotes}
              materialsCount={materialsCount}
            />
          );
        })}
      </div>
    </div>
  );
};
