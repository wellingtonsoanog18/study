import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import {
  X,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Paperclip,
  Check,
  ShieldCheck,
  User,
  AlertCircle
} from 'lucide-react';

interface MaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  day: string;
  blockIdx: number;
  blockTitle: string;
  officialMaterials: StudyMaterial[];
  personalMaterials: StudyMaterial[];
  isAdmin: boolean;
  onAddOfficialMaterial: (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteOfficialMaterial: (id: string) => Promise<void>;
  onAddPersonalMaterial: (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => Promise<void>;
  onDeletePersonalMaterial: (id: string) => Promise<void>;
}

export const MaterialsModal: React.FC<MaterialsModalProps> = ({
  isOpen,
  onClose,
  weekId,
  day,
  blockIdx,
  blockTitle,
  officialMaterials,
  personalMaterials,
  isAdmin,
  onAddOfficialMaterial,
  onDeleteOfficialMaterial,
  onAddPersonalMaterial,
  onDeletePersonalMaterial
}) => {
  const [activeTab, setActiveTab] = useState<'official' | 'personal'>('official');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const relevantOfficial = officialMaterials.filter(
    m => m.weekId === weekId && m.day === day && m.blockIdx === blockIdx
  );

  const relevantPersonal = personalMaterials.filter(
    m => m.weekId === weekId && m.day === day && m.blockIdx === blockIdx
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      setErrorMsg('Preencha o título e o link do Google Drive ou PDF.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const materialData: Omit<StudyMaterial, 'id' | 'createdAt'> = {
        weekId,
        day,
        blockIdx,
        title: newTitle.trim(),
        fileUrl: newUrl.trim(),
        type: activeTab
      };

      if (activeTab === 'official') {
        await onAddOfficialMaterial(materialData);
      } else {
        await onAddPersonalMaterial(materialData);
      }

      setNewTitle('');
      setNewUrl('');
    } catch (err) {
      if (isAdmin) {
        // In demo coordinator mode or offline, save locally
        setNewTitle('');
        setNewUrl('');
        setErrorMsg('Documento salvo localmente no seu dispositivo. Faça login como coordenador para persistência oficial no Firestore.');
      } else {
        setErrorMsg('Faça login com sua conta Google para sincronizar seus materiais.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoLink = (type: 'drive' | 'pdf') => {
    if (type === 'drive') {
      setNewTitle(`Apostila Google Drive - ${blockTitle.slice(0, 25)}...`);
      setNewUrl('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing');
    } else {
      setNewTitle(`Resumo Esquemático - ${blockTitle.slice(0, 25)}...`);
      setNewUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="materials-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-emerald-400" />
              <h2 id="materials-modal-title" className="text-base font-bold text-white">
                Anexos & Materiais de Apoio (PDF / Google Drive)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
              {day} • Bloco {blockIdx}: {blockTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar materiais"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('official')}
            className={`pb-3 px-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'official'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Material Oficial da Coordenação</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {relevantOfficial.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`pb-3 px-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'personal'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Meus Resumos Pessoais</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {relevantPersonal.length}
            </span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'official' ? (
            <div>
              {relevantOfficial.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-300">
                    Nenhum material oficial anexado ainda para este bloco.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isAdmin
                      ? 'Como coordenador, utilize o formulário abaixo para disponibilizar um PDF ou link do Drive para todos os alunos.'
                      : 'O coordenador ainda não cadastrou materiais oficiais para este dia.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {relevantOfficial.map(m => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 group hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            Disponibilizado pela Coordenação
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-colors"
                        >
                          <span>Abrir no Drive / PDF</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => onDeleteOfficialMaterial(m.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remover material oficial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {relevantPersonal.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <Paperclip className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-300">
                    Você ainda não anexou resumos pessoais para este bloco.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cole o link do seu Google Drive ou PDF abaixo para acessá-lo rapidamente sempre que estudar este tema.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {relevantPersonal.map(m => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 group hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                          <span className="text-[10px] text-indigo-400 font-medium">
                            Resumo Pessoal do Aluno
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-colors"
                        >
                          <span>Abrir Material</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => onDeletePersonalMaterial(m.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remover meu resumo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form to Add Material */}
          {(activeTab === 'personal' || isAdmin) && (
            <div className="pt-4 border-t border-slate-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                {activeTab === 'official' ? 'Anexar Material Oficial da Turma' : 'Vincular Meu Resumo / PDF'}
              </h3>

              <form onSubmit={handleAdd} className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label htmlFor="mat-title" className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Título do Documento
                  </label>
                  <input
                    id="mat-title"
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Ex: Apostila de Princípios Fundamentais (PDF)"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="mat-url" className="block text-[11px] font-semibold text-slate-400">
                      Link do Google Drive ou URL do PDF
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleFillDemoLink('drive')}
                        className="text-[10px] text-indigo-400 hover:underline"
                      >
                        + Exemplo Drive
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={() => handleFillDemoLink('pdf')}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        + Exemplo PDF
                      </button>
                    </div>
                  </div>
                  <input
                    id="mat-url"
                    type="url"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... ou https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Salvando...' : 'Salvar Documento'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
