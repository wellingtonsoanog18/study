import React, { useState } from 'react';
import { WeekPlan, DayPlan } from '../types';
import {
  X,
  Settings,
  Upload,
  Download,
  Plus,
  Trash2,
  Lock,
  Globe,
  FileCode,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  Mail
} from 'lucide-react';
import { validateAndNormalizeDayPlans } from '../utils/studyLogic';
import { SAMPLE_JSON_TEMPLATE } from '../data/initialWeeks';

interface ManageWeeksModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: WeekPlan[];
  onSaveWeeks: (weeks: WeekPlan[]) => Promise<void>;
  currentAdminEmail?: string | null;
}

export const ManageWeeksModal: React.FC<ManageWeeksModalProps> = ({
  isOpen,
  onClose,
  weeks,
  onSaveWeeks,
  currentAdminEmail
}) => {
  const [localWeeks, setLocalWeeks] = useState<WeekPlan[]>(weeks);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [jsonInputText, setJsonInputText] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const currentWeek = localWeeks[selectedWeekIndex] || localWeeks[0];

  const handleUpdateCurrentWeek = (updates: Partial<WeekPlan>) => {
    setLocalWeeks(prev =>
      prev.map((w, idx) => (idx === selectedWeekIndex ? { ...w, ...updates } : w))
    );
  };

  const handleAddNewWeek = () => {
    const nextNumber = localWeeks.length + 1;
    const newWeek: WeekPlan = {
      id: `semana-${nextNumber}`,
      weekNumber: nextNumber,
      title: `Semana ${nextNumber}: Novo Cronograma`,
      description: 'Cronograma semanal estruturado pela coordenação.',
      access: 'ALL',
      allowedEmails: currentAdminEmail ? [currentAdminEmail] : [],
      days: SAMPLE_JSON_TEMPLATE as DayPlan[]
    };
    const updated = [...localWeeks, newWeek];
    setLocalWeeks(updated);
    setSelectedWeekIndex(updated.length - 1);
    setStatusMessage({ text: `Semana ${nextNumber} criada com sucesso!`, type: 'success' });
  };

  const handleDeleteWeek = (indexToDelete: number) => {
    if (localWeeks.length <= 1) {
      setStatusMessage({ text: 'É necessário manter pelo menos uma semana no sistema.', type: 'error' });
      return;
    }
    if (confirm(`Tem certeza que deseja excluir a Semana ${localWeeks[indexToDelete].weekNumber}?`)) {
      const updated = localWeeks.filter((_, idx) => idx !== indexToDelete);
      setLocalWeeks(updated);
      setSelectedWeekIndex(Math.max(0, indexToDelete - 1));
      setStatusMessage({ text: 'Semana removida.', type: 'success' });
    }
  };

  const handleAddEmail = () => {
    const raw = emailInput.trim();
    if (!raw) return;

    // Support comma or space separated emails
    const emailsToAdd = raw.split(/[\s,;]+/).filter(e => e.includes('@'));
    if (emailsToAdd.length === 0) {
      setStatusMessage({ text: 'Por favor, insira um e-mail válido.', type: 'error' });
      return;
    }

    const currentEmails = currentWeek.allowedEmails || [];
    const merged = Array.from(new Set([...currentEmails, ...emailsToAdd]));
    handleUpdateCurrentWeek({ allowedEmails: merged });
    setEmailInput('');
    setStatusMessage({ text: `${emailsToAdd.length} e-mail(s) autorizado(s) adicionado(s).`, type: 'success' });
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const currentEmails = currentWeek.allowedEmails || [];
    handleUpdateCurrentWeek({
      allowedEmails: currentEmails.filter(e => e.toLowerCase() !== emailToRemove.toLowerCase())
    });
  };

  // Download Sample JSON
  const handleDownloadSampleJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `modelo-cronograma-estudos.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON via File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validatedDays = validateAndNormalizeDayPlans(parsed);
        handleUpdateCurrentWeek({ days: validatedDays });
        setStatusMessage({
          text: `Arquivo JSON importado com sucesso! ${validatedDays.length} dias carregados na ${currentWeek.title.split(':')[0]}.`,
          type: 'success'
        });
      } catch (err) {
        setStatusMessage({
          text: `Erro ao importar arquivo JSON: ${err instanceof Error ? err.message : 'Formato inválido.'}`,
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Import JSON via Paste Text
  const handleApplyPastedJson = () => {
    if (!jsonInputText.trim()) {
      setStatusMessage({ text: 'Cole o conteúdo JSON do DayPlan[] antes de aplicar.', type: 'error' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInputText);
      const validatedDays = validateAndNormalizeDayPlans(parsed);
      handleUpdateCurrentWeek({ days: validatedDays });
      setJsonInputText('');
      setStatusMessage({
        text: `JSON aplicado com sucesso! ${validatedDays.length} dias configurados na ${currentWeek.title.split(':')[0]}.`,
        type: 'success'
      });
    } catch (err) {
      setStatusMessage({
        text: `Erro de sintaxe JSON: ${err instanceof Error ? err.message : 'Formato incompatível.'}`,
        type: 'error'
      });
    }
  };

  // Save everything to Firestore
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setStatusMessage(null);
      await onSaveWeeks(localWeeks);
      setStatusMessage({
        text: 'Cronograma e permissões salvas com sucesso no banco de dados Firestore (system/weeks_plan)!',
        type: 'success'
      });
    } catch (err) {
      setStatusMessage({
        text: `Erro ao sincronizar com Firestore: ${err instanceof Error ? err.message : 'Falha desconhecida'}`,
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-weeks-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manage-weeks-modal-title" className="text-base font-bold text-white">
                  Painel da Coordenação: Gerenciar Semanas & Importador JSON
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Firestore Dynamic
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Crie novas semanas, controle permissões de acesso VIP e importe cronogramas via JSON em tempo real.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar painel de coordenação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification banner */}
        {statusMessage && (
          <div
            className={`px-5 py-2.5 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/50 border-b border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/50 border-b border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="flex-1 font-medium">{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Week Selector Tabs in Modal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selecione a Semana para Configurar:
              </span>
              <button
                type="button"
                onClick={handleAddNewWeek}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nova Semana</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {localWeeks.map((w, idx) => (
                <div key={w.id} className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedWeekIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      idx === selectedWeekIndex
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>Semana {w.weekNumber}</span>
                    {w.access === 'RESTRICTED' && <Lock className="w-2.5 h-2.5 text-amber-300" />}
                  </button>

                  {localWeeks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteWeek(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={`Excluir Semana ${w.weekNumber}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Week Metadata Form */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              1. Dados e Permissões de Acesso da Semana {currentWeek.weekNumber}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Título da Semana
                </label>
                <input
                  type="text"
                  value={currentWeek.title}
                  onChange={e => handleUpdateCurrentWeek({ title: e.target.value })}
                  placeholder="Ex: Semana 1: Direito Constitucional & Português"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nível de Acesso (RBAC)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateCurrentWeek({ access: 'ALL' })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      currentWeek.access === 'ALL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Pública (Livre)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateCurrentWeek({ access: 'RESTRICTED' })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      currentWeek.access === 'RESTRICTED'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Restrita (VIP)</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Descrição ou Orientação Pedagógica
              </label>
              <input
                type="text"
                value={currentWeek.description || ''}
                onChange={e => handleUpdateCurrentWeek({ description: e.target.value })}
                placeholder="Ex: Foco em resolução comentada e memorização de prazos constitucionais."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Email Whitelist (When Restricted) */}
            {currentWeek.access === 'RESTRICTED' && (
              <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Lista de E-mails Autorizados para esta Mentoria VIP:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(currentWeek.allowedEmails || []).length} aluno(s) com acesso liberado
                  </span>
                </div>

                {/* Add Email input */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                    placeholder="aluno@gmail.com (pressione Enter ou clique em Adicionar)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    + Autorizar
                  </button>
                </div>

                {/* Chips of Allowed Emails */}
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                  {(currentWeek.allowedEmails || []).map(email => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-900 text-amber-200 border border-amber-500/30"
                    >
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Remover autorização"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!currentWeek.allowedEmails || currentWeek.allowedEmails.length === 0) && (
                    <p className="text-[11px] text-amber-400/80 italic">
                      Nenhum e-mail adicionado ainda. Somente você (administrador) conseguirá visualizar esta semana.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* JSON Importer Section */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                2. Importador de Cronograma via JSON (DayPlan[])
              </h3>

              <button
                type="button"
                onClick={handleDownloadSampleJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Baixar arquivo JSON modelo com a estrutura DayPlan[] para editar no seu computador"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baixar Modelo JSON</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Option A: Upload JSON File */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 text-center flex flex-col items-center justify-center space-y-2 transition-all">
                <Upload className="w-7 h-7 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-white">Carregar Arquivo .JSON</p>
                  <p className="text-[11px] text-slate-400">Importe diretamente o cronograma dos dias</p>
                </div>
                <label className="cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all">
                  Selecionar Arquivo
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option B: Direct Paste JSON */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-400">
                  Ou cole o array JSON diretamente:
                </label>
                <textarea
                  value={jsonInputText}
                  onChange={e => setJsonInputText(e.target.value)}
                  placeholder={`[\n  {\n    "day": "Segunda-feira",\n    "b1": { "sub": "Direito Penal", "title": "Tipicidade" },\n    "b2": { "sub": "Português", "title": "Crase" },\n    "b3": { "sub": "Questões", "title": "30Q CEBRASPE" }\n  }\n]`}
                  className="w-full h-24 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPastedJson}
                  disabled={!jsonInputText.trim()}
                  className="w-full py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 transition-colors"
                >
                  Validar e Aplicar JSON na Semana {currentWeek.weekNumber}
                </button>
              </div>
            </div>

            {/* Current Days Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Dias configurados atualmente nesta semana: ({currentWeek.days?.length || 0} dias)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                {(currentWeek.days || []).map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-center"
                  >
                    <span className="text-xs font-bold text-white block truncate">{day.day}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {[day.b1, day.b2, day.b3].filter(Boolean).length} blocos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between gap-4 bg-slate-950/70">
          <p className="text-xs text-slate-400 hidden sm:block">
            As alterações são salvas em tempo real no Firestore e ficam disponíveis para todos os alunos.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Gravando no Firestore...' : 'Salvar no Firestore'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
