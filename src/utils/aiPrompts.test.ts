import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMementoPrompt,
  buildQuestionsPrompt,
  getOfflineDemoMemento,
  generatePrintablePdfHtml
} from './aiPrompts.ts';

test('buildMementoPrompt generates structured instructions', () => {
  const prompt = buildMementoPrompt({
    subject: 'Direito Constitucional',
    topic: 'Princípios Fundamentais',
    subtopics: ['Art. 1º a 3º', 'Art. 4º']
  });

  assert.ok(prompt.includes('Direito Constitucional'));
  assert.ok(prompt.includes('Princípios Fundamentais'));
  assert.ok(prompt.includes('MNEMÔNICOS ESSENCIAIS'));
  assert.ok(prompt.includes('Art. 1º a 3º'));
});

test('buildQuestionsPrompt includes question count and format', () => {
  const prompt = buildQuestionsPrompt({
    subject: 'Português',
    topic: 'Crase',
    bankStyle: 'CEBRASPE'
  }, 10);

  assert.ok(prompt.includes('10 QUESTÕES'));
  assert.ok(prompt.includes('CERTO ou ERRADO'));
  assert.ok(prompt.includes('Gabarito oficial'));
});

test('getOfflineDemoMemento returns clean structured markdown', () => {
  const memento = getOfflineDemoMemento('Direito Penal', 'Teoria do Crime', ['Fato Típico', 'Ilicitude']);
  assert.ok(memento.includes('DIREITO PENAL'));
  assert.ok(memento.includes('Fato Típico'));
  assert.ok(memento.includes('Pegadinhas'));
});

test('generatePrintablePdfHtml creates valid HTML document with print script', () => {
  const html = generatePrintablePdfHtml('Resumo Crase', 'Português', 'Regras de crase...');
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes('Resumo Crase'));
  assert.ok(html.includes('window.print()'));
});
