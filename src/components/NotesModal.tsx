import React, { useState, useEffect } from 'react';
import { X, FileEdit, Check, Copy, Trash2 } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockKey: string;
  blockTitle: string;
  initialNote: string;
  onSaveNote: (blockKey: string, text: string) => Promise<void>;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  blockKey,
  blockTitle,
  initialNote,
  onSaveNote
}) => {
  const [text, setText] = useState(initialNote);
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setText(initialNote || '');
    setIsSaved(true);
  }, [initialNote, blockKey]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsSaved(false);
  };

  const handleSave = async () => {
    await onSaveNote(blockKey, text);
    setIsSaved(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm('Deseja realmente limpar as anotações deste bloco?')) {
      setText('');
      setIsSaved(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-amber-400" />
            <div>
              <h2 id="notes-modal-title" className="text-sm sm:text-base font-bold text-white">
                Caderno de Anotações & Dúvidas
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">{blockTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar notas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Area */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Digite aqui seus resumos, artigos de lei importantes, mnemônicos ou dúvidas para revisar depois..."
            className="w-full flex-1 min-h-[220px] p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 resize-none font-sans leading-relaxed"
          />

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80 mt-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{text.length} caracteres</span>
              {isSaved ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Salvo
                </span>
              ) : (
                <span className="text-amber-400 font-medium">• Alterações não salvas</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {text && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
                    title="Copiar anotações"
                  >
                    {copied ? 'Copiado!' : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                    title="Limpar texto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaved}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-md shadow-indigo-600/20 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Nota</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
