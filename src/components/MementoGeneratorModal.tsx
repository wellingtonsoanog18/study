import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Printer,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Download,
  BookOpen,
  ArrowRight,
  Loader2,
  BookmarkPlus
} from 'lucide-react';
import {
  buildMementoPrompt,
  buildQuestionsPrompt,
  getOfflineDemoMemento,
  generatePrintablePdfHtml
} from '../utils/aiPrompts';

interface MementoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject: string;
  defaultTopic: string;
  defaultSubtopics?: string[];
  blockKey?: string;
  onSaveToNotes?: (blockKey: string, text: string) => Promise<void>;
  onLogQuestions?: (amount: number) => void;
}

export const MementoGeneratorModal: React.FC<MementoGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultSubject,
  defaultTopic,
  defaultSubtopics = [],
  blockKey,
  onSaveToNotes,
  onLogQuestions
}) => {
  const [activeTab, setActiveTab] = useState<'mementos' | 'questions' | 'paste'>('mementos');
  const [subject, setSubject] = useState(defaultSubject);
  const [topic, setTopic] = useState(defaultTopic);
  const [bankStyle, setBankStyle] = useState<'CEBRASPE' | 'FGV' | 'VUNESP' | 'FCC'>('CEBRASPE');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [pastedGeminiContent, setPastedGeminiContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [isSavedToNotes, setIsSavedToNotes] = useState<boolean>(false);

  useEffect(() => {
    setSubject(defaultSubject || 'Direito Constitucional');
    setTopic(defaultTopic || 'Princípios Fundamentais');
    setIsSavedToNotes(false);
  }, [defaultSubject, defaultTopic, isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 4500);
  };

  // Auto-copy to clipboard helper
  const copyPromptToClipboard = (promptText: string) => {
    try {
      navigator.clipboard.writeText(promptText);
      showToast('📋 Prompt copiado com sucesso! Você pode colar no seu Gemini (gemini.google.com).');
    } catch {
      showToast('Prompt gerado. Copie o texto para levar ao Gemini.');
    }
  };

  // Generate Mementos (Auto-copy prompt + server call)
  const handleGenerateMementos = async () => {
    const prompt = buildMementoPrompt({
      subject,
      topic,
      subtopics: defaultSubtopics,
      bankStyle
    });

    // CRITICAL REQUIREMENT: Auto-copy prompt to clipboard on click
    copyPromptToClipboard(prompt);
    setIsLoading(true);
    setIsSavedToNotes(false);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setGeneratedResult(data.text);
          return;
        }
      }
      // If server has no key or fails, load engineered template and invite user
      const fallback = getOfflineDemoMemento(subject, topic, defaultSubtopics);
      setGeneratedResult(fallback);
    } catch {
      const fallback = getOfflineDemoMemento(subject, topic, defaultSubtopics);
      setGeneratedResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Questions (Auto-copy prompt + server call)
  const handleGenerateQuestions = async () => {
    const prompt = buildQuestionsPrompt(
      {
        subject,
        topic,
        subtopics: defaultSubtopics,
        bankStyle
      },
      questionCount
    );

    // CRITICAL REQUIREMENT: Auto-copy prompt to clipboard on click
    copyPromptToClipboard(prompt);
    setIsLoading(true);
    setIsSavedToNotes(false);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setGeneratedResult(data.text);
          if (onLogQuestions) {
            onLogQuestions(questionCount);
          }
          return;
        }
      }

      // Offline sample questions
      const fallback = `### 📝 BATERIA DE QUESTÕES: ${subject.toUpperCase()} (${bankStyle})
**Tema:** ${topic}

---

**Questão 1 (${bankStyle})**
Julgue o item a seguir referente a ${topic}:
A República Federativa do Brasil rege-se nas suas relações internacionais pelo princípio da prevalência dos direitos humanos e da não intervenção.

( ) CERTO   ( ) ERRADO

**Gabarito:** CERTO
**Comentário:** O art. 4º da Constituição Federal de 1988 estabelece expressamente a prevalência dos direitos humanos (inciso II) e a não-intervenção (inciso IV) como princípios fundamentais das relações internacionais.

---

**Questão 2 (${bankStyle})**
No que concerne aos princípios estruturantes, a soberania e a cidadania constituem objetivos fundamentais da República.

( ) CERTO   ( ) ERRADO

**Gabarito:** ERRADO
**Comentário:** Pegadinha clássica! Soberania e Cidadania são FUNDAMENTOS (Art. 1º, I e II), enquanto os OBJETIVOS fundamentais estão no Art. 3º (iniciados com verbos no infinitivo: construir, garantir, erradicar, promover).`;

      setGeneratedResult(fallback);
      if (onLogQuestions) {
        onLogQuestions(questionCount);
      }
    } catch {
      const fallback = getOfflineDemoMemento(subject, topic, defaultSubtopics);
      setGeneratedResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Print to PDF
  const handlePrintPdf = () => {
    const contentToPrint = activeTab === 'paste' && pastedGeminiContent ? pastedGeminiContent : generatedResult;
    if (!contentToPrint) return;

    const html = generatePrintablePdfHtml(`Memento & Questões - ${topic}`, subject, contentToPrint);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  // Download Markdown/Text file
  const handleDownloadText = () => {
    const content = activeTab === 'paste' && pastedGeminiContent ? pastedGeminiContent : generatedResult;
    if (!content) return;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `memento-${topic.toLowerCase().replace(/\s+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Save to block study notes
  const handleSaveToNotesClick = async () => {
    if (!blockKey || !onSaveToNotes) return;
    const content = activeTab === 'paste' && pastedGeminiContent ? pastedGeminiContent : generatedResult;
    if (!content) return;

    await onSaveToNotes(blockKey, content);
    setIsSavedToNotes(true);
    showToast('💾 Memento salvo nas anotações deste bloco de estudos!');
  };

  const activeContent = activeTab === 'paste' ? pastedGeminiContent : generatedResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="memento-generator-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="memento-generator-title" className="text-base font-bold text-white">
                  Gerador de Mementos, PDFs & Questões com IA
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gere mnemônicos, simulados e PDFs com 1 clique ou copie o prompt para o seu Gemini particular.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar gerador de mementos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notice */}
        {copyToast && (
          <div className="px-5 py-2.5 bg-emerald-950/70 border-b border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{copyToast}</span>
            </div>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-white text-[11px] font-bold flex items-center gap-1 border border-emerald-500/30 transition-colors"
            >
              <span>Abrir Gemini</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('mementos')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'mementos'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mementos & Mnemônicos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'questions'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Bateria de Questões</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'paste'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Colar Resposta do Gemini</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Disciplina
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Tema / Assunto
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Estilo da Banca
                </label>
                <select
                  value={bankStyle}
                  onChange={e => setBankStyle(e.target.value as 'CEBRASPE' | 'FGV' | 'VUNESP' | 'FCC')}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="CEBRASPE">CEBRASPE (Certo/Errado)</option>
                  <option value="FGV">FGV (Múltipla Escolha)</option>
                  <option value="VUNESP">VUNESP</option>
                  <option value="FCC">FCC</option>
                </select>
              </div>
            </div>

            {/* Subtopics Chips */}
            {defaultSubtopics.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400 overflow-x-auto">
                <span className="font-semibold text-slate-300">Subtemas vinculados:</span>
                {defaultSubtopics.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                {activeTab === 'mementos' && (
                  <button
                    type="button"
                    onClick={handleGenerateMementos}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Gerar Mementos & Copiar Prompt</span>
                  </button>
                )}

                {activeTab === 'questions' && (
                  <button
                    type="button"
                    onClick={handleGenerateQuestions}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Gerar Questões & Copiar Prompt</span>
                  </button>
                )}

                {/* Direct link to external Gemini */}
                <a
                  href="https://gemini.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title="Abrir o Gemini no navegador para colar o prompt gerado"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Abrir Gemini (Manual)</span>
                </a>
              </div>

              {/* Export Actions if Content Exists */}
              {activeContent && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-colors"
                    title="Exportar PDF pronto para impressão ou salvar"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Gerar PDF / Imprimir</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    title="Baixar como arquivo Markdown/Texto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar .MD</span>
                  </button>

                  {blockKey && onSaveToNotes && (
                    <button
                      type="button"
                      onClick={handleSaveToNotesClick}
                      disabled={isSavedToNotes}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 transition-colors disabled:opacity-60"
                      title="Salvar este conteúdo no bloco de notas deste tema"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>{isSavedToNotes ? 'Salvo nas Notas!' : 'Salvar nas Notas'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Paste Tab Input */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                Cole abaixo a resposta gerada no seu Gemini:
              </label>
              <textarea
                value={pastedGeminiContent}
                onChange={e => setPastedGeminiContent(e.target.value)}
                placeholder="Cole aqui o texto ou mementos gerados no gemini.google.com para formatar e gerar o PDF..."
                className="w-full h-48 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono resize-none leading-relaxed"
              />
            </div>
          )}

          {/* Generated or Pasted Content Display */}
          {activeContent ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Visualização do Conteúdo Formatado:
                </span>
                <span className="text-[11px] text-slate-500">
                  Pronto para estudo, cópia ou impressão em PDF
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
                {activeContent}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-500/40 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-300">
                  Nenhum memento gerado no momento
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Clique no botão acima para gerar os mementos e questões. O prompt será copiado automaticamente para sua área de transferência para você colar no seu Gemini!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
