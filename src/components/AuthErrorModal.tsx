import React, { useState } from 'react';
import { X, ShieldAlert, Copy, Check, ExternalLink, Globe } from 'lucide-react';

interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorInfo: {
    title: string;
    desc: string;
    domain?: string;
  } | null;
  projectId?: string;
}

export const AuthErrorModal: React.FC<AuthErrorModalProps> = ({
  isOpen,
  onClose,
  errorInfo,
  projectId = 'gen-lang-client-0511672091'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !errorInfo) return null;

  const currentDomain = errorInfo.domain || window.location.hostname;
  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-error-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-rose-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 id="auth-error-title" className="text-base font-bold text-white">
                {errorInfo.title}
              </h2>
              <span className="text-[11px] text-rose-300 font-mono">auth/unauthorized-domain</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar aviso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {errorInfo.desc}
          </p>

          {errorInfo.domain && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Domínio a ser adicionado no Firebase:
              </span>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-700">
                <code className="text-xs sm:text-sm font-mono font-bold text-emerald-400 truncate">
                  {currentDomain}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors flex-shrink-0"
                  title="Copiar domínio"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Steps Guide */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2 text-xs text-slate-300">
            <span className="font-bold text-indigo-300 block">Passo a passo rápido (30 segundos):</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Acesse o <strong>Firebase Console</strong> &gt; <strong>Authentication</strong>.</li>
              <li>Clique na aba <strong>Configurações (Settings)</strong> &gt; <strong>Domínios Autorizados</strong>.</li>
              <li>Clique em <strong>Adicionar domínio</strong> e cole: <code className="text-emerald-400 font-mono font-bold">{currentDomain}</code>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/50">
          <a
            href={firebaseConsoleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Abrir Firebase Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Entendi, vou adicionar
          </button>
        </div>
      </div>
    </div>
  );
};
