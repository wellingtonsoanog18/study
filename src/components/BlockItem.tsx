import React from 'react';
import { StudyBlock, StudyMaterial } from '../types';
import {
  Play,
  FileText,
  FileEdit,
  Clock,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Paperclip,
  Sparkles
} from 'lucide-react';

interface BlockItemProps {
  block: StudyBlock;
  blockIdx: number; // 1, 2, 3
  blockKey: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPlayVideo: (block: StudyBlock) => void;
  onOpenMaterials: (blockIdx: number, blockTitle: string) => void;
  onOpenNotes: (blockKey: string, blockTitle: string) => void;
  onOpenMementos: (block: StudyBlock, blockKey: string) => void;
  hasNotes: boolean;
  materialsCount: number;
}

// Subject color theme helper
export function getSubjectColorClasses(sub: string = ''): {
  badge: string;
  border: string;
  icon: string;
} {
  const s = sub.toLowerCase();
  if (s.includes('constitucional')) {
    return {
      badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      border: 'hover:border-indigo-500/40',
      icon: 'text-indigo-400'
    };
  }
  if (s.includes('administrativo')) {
    return {
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      border: 'hover:border-emerald-500/40',
      icon: 'text-emerald-400'
    };
  }
  if (s.includes('portugu') || s.includes('gram') || s.includes('crase')) {
    return {
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      border: 'hover:border-amber-500/40',
      icon: 'text-amber-400'
    };
  }
  if (s.includes('lógico') || s.includes('matemát') || s.includes('rlm')) {
    return {
      badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      border: 'hover:border-cyan-500/40',
      icon: 'text-cyan-400'
    };
  }
  if (s.includes('penal') || s.includes('processo')) {
    return {
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      border: 'hover:border-purple-500/40',
      icon: 'text-purple-400'
    };
  }
  if (s.includes('informát') || s.includes('ti') || s.includes('redes')) {
    return {
      badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      border: 'hover:border-teal-500/40',
      icon: 'text-teal-400'
    };
  }
  if (s.includes('quest') || s.includes('simulado') || s.includes('bateria') || s.includes('prática')) {
    return {
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      border: 'hover:border-blue-500/40',
      icon: 'text-blue-400'
    };
  }
  if (s.includes('redação') || s.includes('discursiva')) {
    return {
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      border: 'hover:border-rose-500/40',
      icon: 'text-rose-400'
    };
  }
  return {
    badge: 'bg-slate-700/50 text-slate-300 border-slate-600',
    border: 'hover:border-slate-600',
    icon: 'text-slate-400'
  };
}

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  blockIdx,
  blockKey,
  isCompleted,
  onToggleComplete,
  onPlayVideo,
  onOpenMaterials,
  onOpenNotes,
  onOpenMementos,
  hasNotes,
  materialsCount
}) => {
  const colors = getSubjectColorClasses(block.sub);
  const isPractice = block.type === 'practice' || block.type === 'review';

  return (
    <div
      className={`relative rounded-xl p-3.5 sm:p-4 border transition-all duration-200 group ${
        isCompleted
          ? 'bg-slate-900/40 border-slate-800/60 opacity-85'
          : `bg-slate-900/90 border-slate-800 shadow-sm ${colors.border}`
      }`}
    >
      {/* Top Header inside Block */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Block Number Tag */}
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
            {isPractice ? 'BLOCO 3 • PRÁTICA' : `BLOCO ${blockIdx}`}
          </span>

          {/* Subject Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border tracking-tight ${colors.badge}`}
          >
            {isPractice ? <HelpCircle className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
            {block.sub}
          </span>
        </div>

        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggleComplete}
          aria-label={isCompleted ? `Desmarcar ${block.title}` : `Concluir ${block.title}`}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30'
              : 'border-slate-700 hover:border-emerald-400/80 bg-slate-950/70 text-transparent hover:text-emerald-500/40'
          }`}
        >
          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Title */}
      <h3
        className={`text-sm sm:text-base font-bold tracking-tight mb-2 transition-colors ${
          isCompleted ? 'line-through text-slate-500 font-medium' : 'text-slate-100 group-hover:text-white'
        }`}
      >
        {block.title}
      </h3>

      {/* Subtopics List (t1, t2, t3) */}
      {(block.t1 || block.t2 || block.t3) && (
        <ul className="space-y-1 mb-3 text-xs text-slate-400">
          {block.t1 && (
            <li className="flex items-baseline gap-1.5 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0 mt-1" />
              <span className={isCompleted ? 'text-slate-500' : 'text-slate-300'}>{block.t1}</span>
            </li>
          )}
          {block.t2 && (
            <li className="flex items-baseline gap-1.5 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0 mt-1" />
              <span className={isCompleted ? 'text-slate-500' : 'text-slate-300'}>{block.t2}</span>
            </li>
          )}
          {block.t3 && (
            <li className="flex items-baseline gap-1.5 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0 mt-1" />
              <span className={isCompleted ? 'text-slate-500' : 'text-slate-300'}>{block.t3}</span>
            </li>
          )}
        </ul>
      )}

      {/* Footer Actions: Video Play, PDF Materials, Notes, Duration */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {/* Play Video Button */}
          {block.videoUrl ? (
            <button
              type="button"
              onClick={() => onPlayVideo(block)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-colors shadow-sm"
              title="Assistir Videoaula Embutida"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Videoaula</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onPlayVideo(block)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors"
              title="Pesquisar / Assistir Aula do Tema"
            >
              <Play className="w-3 h-3" />
              <span>Aula</span>
            </button>
          )}

          {/* PDF / Materials Button */}
          <button
            type="button"
            onClick={() => onOpenMaterials(blockIdx, block.title)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
              materialsCount > 0
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title="Ver e Anexar Materiais / PDFs do Google Drive"
          >
            <Paperclip className="w-3 h-3" />
            <span className="hidden sm:inline">PDFs</span>
            {materialsCount > 0 && (
              <span className="px-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                {materialsCount}
              </span>
            )}
          </button>

          {/* Notes Button */}
          <button
            type="button"
            onClick={() => onOpenNotes(blockKey, block.title)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
              hasNotes
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title="Anotações & Resumos deste tema"
          >
            <FileEdit className="w-3 h-3" />
            <span className="hidden sm:inline">Notas</span>
          </button>

          {/* Mementos & AI Generator Button */}
          <button
            type="button"
            onClick={() => onOpenMementos(block, blockKey)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-colors"
            title="Gerar Mementos, PDFs e Questões com IA / Gemini"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Mementos</span>
          </button>
        </div>

        {/* Estimated Duration */}
        {block.durationMin && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            {block.durationMin}m
          </span>
        )}
      </div>
    </div>
  );
};
