import React from 'react';
import { StudyBlock } from '../types';
import { X, ExternalLink, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { getSubjectColorClasses } from './BlockItem';

interface VideoModalProps {
  isOpen: boolean;
  block: StudyBlock | null;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

// Convert various YouTube links to an embed URL
function getEmbedUrl(url?: string, defaultSearch?: string): string {
  if (!url) {
    const query = encodeURIComponent(defaultSearch || 'videoaula concurso');
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${query}`;
  }

  // Already an embed URL
  if (url.includes('/embed/')) {
    return url;
  }

  // Standard watch?v=ID
  const watchMatch = url.match(/(?:watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
  }

  return url;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  block,
  onClose,
  isCompleted,
  onToggleComplete
}) => {
  if (!isOpen || !block) return null;

  const colors = getSubjectColorClasses(block.sub);
  const embedUrl = getEmbedUrl(block.videoUrl, `${block.sub} ${block.title}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded border flex-shrink-0 ${colors.badge}`}
            >
              <BookOpen className="w-3 h-3" />
              {block.sub}
            </span>
            <h2
              id="video-modal-title"
              className="text-sm sm:text-base font-bold text-white truncate"
            >
              {block.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {block.videoUrl && (
              <a
                href={block.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Abrir no YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Fechar videoaula"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Embed Container */}
        <div className="relative w-full aspect-video bg-black flex-shrink-0">
          <iframe
            src={embedUrl}
            title={block.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Content Details & Completion Action */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Aula de Referência {block.idx ? `(Aula #${block.idx})` : ''}
              </p>
              <h3 className="text-lg font-bold text-white">{block.title}</h3>
            </div>

            <div className="flex items-center gap-3">
              {block.durationMin && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {block.durationMin} min
                </span>
              )}

              <button
                type="button"
                onClick={onToggleComplete}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCompleted ? 'Bloco Concluído!' : 'Marcar como Assistido'}</span>
              </button>
            </div>
          </div>

          {/* Subtopics Checklist in Lecture */}
          {(block.t1 || block.t2 || block.t3) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Tópicos Abordados nesta Aula:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {block.t1 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <span>{block.t1}</span>
                  </div>
                )}
                {block.t2 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <span>{block.t2}</span>
                  </div>
                )}
                {block.t3 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <span>{block.t3}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
