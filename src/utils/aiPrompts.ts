/**
 * Utility functions for generating study mementos, prompts, and exam questions
 */

export interface MementoGenerationOptions {
  subject: string;
  topic: string;
  subtopics?: string[];
  bankStyle?: 'CEBRASPE' | 'FGV' | 'VUNESP' | 'FCC';
  targetExam?: string;
}

/**
 * Builds an engineered prompt for generating Mementos (Mnemônicos, Resumos Esquemáticos, Pegadinhas)
 */
export function buildMementoPrompt(opts: MementoGenerationOptions): string {
  const subtopicsText = opts.subtopics && opts.subtopics.length > 0
    ? `\nSubtemas específicos a abordar:\n${opts.subtopics.map(t => `- ${t}`).join('\n')}`
    : '';

  return `Você é um mentor especialista em preparação para concursos públicos e vestibulares de alta performance.

Por favor, elabore um MEMENTO COMPLETO E ESQUEMATIZADO para revisão acelerada do seguinte tema:
- Disciplina: ${opts.subject}
- Tema Principal: ${opts.topic}${subtopicsText}
- Estilo da Banca / Foco: ${opts.bankStyle || 'CEBRASPE / FGV'}

Estruture sua resposta estritamente nas seguintes seções:
1. 🧠 MNEMÔNICOS ESSENCIAIS (com significado detalhado de cada letra/palavra)
2. 📊 ESQUEMA RESUMIDO DOS CONCEITOS CHAVE (definições diretas, regras e exceções)
3. ⚖️ ARTIGOS / LEGISLAÇÃO / JURISPRUDÊNCIA MAIS COBRADA
4. ⚠️ PEGADINHAS CLÁSSICAS DE BANCA (o que o examinador costuma trocar para induzir ao erro)
5. 📌 MAPA MENTAL TEXTUAL (fluxograma passo a passo de raciocínio)

Seja extremamente objetivo, técnico e voltado para memorização de curto e longo prazo.`;
}

/**
 * Builds an engineered prompt for generating Exam Questions
 */
export function buildQuestionsPrompt(opts: MementoGenerationOptions, count: number = 5): string {
  const subtopicsText = opts.subtopics && opts.subtopics.length > 0
    ? `\nSubtemas focados:\n${opts.subtopics.map(t => `- ${t}`).join('\n')}`
    : '';

  const formatInstruction = opts.bankStyle === 'CEBRASPE'
    ? 'Formato: Questões no padrão CERTO ou ERRADO (estilo Cebraspe).'
    : 'Formato: Questões de Múltipla Escolha com 5 alternativas (A, B, C, D, E).';

  return `Você é um elaborador de questões de alto nível para bancas de concurso.

Gere uma bateria de ${count} QUESTÕES INÉDITAS E COMENTADAS sobre:
- Disciplina: ${opts.subject}
- Tema: ${opts.topic}${subtopicsText}
- Banca de Referência: ${opts.bankStyle || 'CEBRASPE'}
${formatInstruction}

Estrutura obrigatória para cada questão:
1. Enunciado claro com contextualização prática.
2. Alternativas (ou assertiva C/E).
3. Gabarito oficial.
4. Comentário detalhado e fundamentado explicando por que a resposta é correta e onde está o erro das demais.

Gere agora a bateria completa:`;
}

/**
 * Generates an instant offline fallback memento in case network/AI is unavailable
 */
export function getOfflineDemoMemento(subject: string, topic: string, subtopics?: string[]): string {
  const subList = (subtopics || []).filter(Boolean);
  return `### 🧠 MEMENTO DE REVISÃO RÁPIDA: ${subject.toUpperCase()}
**Tema:** ${topic}

---

#### 1. 🎯 Mnemônico de Fixação
- **C-O-M-P-E-T-Ê-N-C-I-A:** Regra geral de atribuição e legalidade estrita.
- **R-E-G-R-A:** Conexão direta entre fato gerador, fundamentação e consequência jurídica.

---

#### 2. 📊 Esquema Conceitual Síntese
${subList.length > 0 ? subList.map(s => `- **${s}:** Conceito basilar exigido em provas de nível superior. Atenção aos prazos e requisitos cumulativos.`).join('\n') : '- Conceitos estruturantes da matéria com incidência recorrente em provas.'}

---

#### 3. ⚠️ Pegadinhas Típicas de Prova
- ❌ **Erro clássico:** Confundir competência privativa com competência exclusiva ou discricionariedade com arbitrariedade.
- ✔️ **Atenção:** Verifique sempre se a assertiva exige regra geral ou exceção expressa.

---

#### 4. 📌 Checkpoint de Memorização
1. Definição do instituto.
2. Requisitos de validade.
3. Hipóteses de cessação ou extinção.`;
}

/**
 * Formats a clean printable HTML document for PDF generation
 */
export function generatePrintablePdfHtml(title: string, subject: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} - StudyFlow Pro</title>
  <style>
    @media print {
      body { margin: 15mm; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; }
      .no-print { display: none !important; }
      h1, h2, h3, h4 { page-break-after: avoid; }
      pre, blockquote { page-break-inside: avoid; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; color: #1e293b; }
    .header { border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 18px; font-weight: 800; color: #4338ca; }
    .meta { font-size: 12px; color: #64748b; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; background: #e0e7ff; color: #3730a3; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
    h1 { font-size: 22px; margin: 0 0 4px 0; color: #0f172a; }
    .content { font-size: 13px; line-height: 1.65; white-space: pre-wrap; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
    .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">StudyFlow Pro • Mentoria Semanal</div>
      <div class="badge">${subject}</div>
      <h1>${title}</h1>
    </div>
    <div class="meta">
      <div>Data: ${new Date().toLocaleDateString('pt-BR')}</div>
      <div>Material Oficial / Resumo de Apoio</div>
    </div>
  </div>
  <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <div class="footer">
    Gerado automaticamente por StudyFlow Pro / MetaEstudos 2026. Todos os direitos reservados.
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;
}
