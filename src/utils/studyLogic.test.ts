import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canUserAccessWeek,
  calculateWeekProgress,
  isDayCompleted,
  calculateAccuracy,
  validateAndNormalizeDayPlans
} from './studyLogic.ts';
import type { WeekPlan } from './studyLogic.ts';

test('canUserAccessWeek allows all users when access is ALL', () => {
  const week = { access: 'ALL' as const, allowedEmails: [] };
  assert.equal(canUserAccessWeek(week, null, false), true);
  assert.equal(canUserAccessWeek(week, 'aluno@gmail.com', false), true);
});

test('canUserAccessWeek blocks unauthorized users when access is RESTRICTED', () => {
  const week = { access: 'RESTRICTED' as const, allowedEmails: ['vip@meta.com', 'aluno1@gmail.com'] };
  assert.equal(canUserAccessWeek(week, null, false), false);
  assert.equal(canUserAccessWeek(week, 'aluno2@gmail.com', false), false);
  assert.equal(canUserAccessWeek(week, 'VIP@META.COM', false), true); // case insensitive
});

test('canUserAccessWeek always allows admin regardless of restriction', () => {
  const week = { access: 'RESTRICTED' as const, allowedEmails: [] };
  assert.equal(canUserAccessWeek(week, 'admin@gmail.com', true), true);
});

test('calculateWeekProgress computes correct percentages and completion', () => {
  const sampleWeek: WeekPlan = {
    id: 'sem-1',
    weekNumber: 1,
    title: 'Semana 1',
    access: 'ALL',
    days: [
      {
        day: 'Segunda',
        b1: { sub: 'Dir. Const.', title: 'Princípios Fundamentais' },
        b2: { sub: 'Português', title: 'Crase' },
        b3: { sub: 'Questões', title: 'Bateria 30Q' }
      },
      {
        day: 'Terça',
        b1: { sub: 'Dir. Adm.', title: 'Atos Administrativos' }
      }
    ]
  };

  // 4 blocks total in this sample week
  const emptyProgress = calculateWeekProgress(sampleWeek, []);
  assert.equal(emptyProgress.totalBlocks, 4);
  assert.equal(emptyProgress.completedCount, 0);
  assert.equal(emptyProgress.percentage, 0);
  assert.equal(emptyProgress.isComplete, false);

  // Complete 2 blocks -> 50%
  const partial = calculateWeekProgress(sampleWeek, ['sem-1_Segunda_b1', 'sem-1_Segunda_b2']);
  assert.equal(partial.completedCount, 2);
  assert.equal(partial.percentage, 50);
  assert.equal(partial.isComplete, false);

  // Complete all 4 blocks -> 100%
  const full = calculateWeekProgress(sampleWeek, [
    'sem-1_Segunda_b1',
    'sem-1_Segunda_b2',
    'sem-1_Segunda_b3',
    'sem-1_Terça_b1'
  ]);
  assert.equal(full.completedCount, 4);
  assert.equal(full.percentage, 100);
  assert.equal(full.isComplete, true);
});

test('isDayCompleted checks whether all blocks in a day are finished', () => {
  const day = {
    day: 'Quarta',
    b1: { sub: 'Matemática', title: 'Regra de Três' },
    b2: { sub: 'Raciocínio Lógico', title: 'Tabela Verdade' }
  };

  assert.equal(isDayCompleted('sem-1', day, ['sem-1_Quarta_b1']), false);
  assert.equal(isDayCompleted('sem-1', day, ['sem-1_Quarta_b1', 'sem-1_Quarta_b2']), true);
});

test('calculateAccuracy returns correct percentage', () => {
  assert.equal(calculateAccuracy(15, 20), 75);
  assert.equal(calculateAccuracy(0, 10), 0);
  assert.equal(calculateAccuracy(0, 0), 0);
  assert.equal(calculateAccuracy(10, 10), 100);
});

test('validateAndNormalizeDayPlans handles valid JSON structure correctly', () => {
  const rawInput = [
    {
      day: 'Segunda-feira',
      b1: { sub: 'Direito Penal', title: 'Crimes Contra a Vida', t1: 'Homicídio', t2: 'Lesão' },
      b2: { sub: 'Português', title: 'Sintaxe', idx: 4 },
      b3: { sub: 'Treino', title: '30 Questões CEBRASPE' }
    }
  ];

  const normalized = validateAndNormalizeDayPlans(rawInput);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].day, 'Segunda-feira');
  assert.equal(normalized[0].b1?.sub, 'Direito Penal');
  assert.equal(normalized[0].b1?.t1, 'Homicídio');
  assert.equal(normalized[0].b3?.type, 'practice');
});

test('validateAndNormalizeDayPlans throws on non-array input', () => {
  assert.throws(() => {
    validateAndNormalizeDayPlans({ not: 'an array' });
  }, /O formato do arquivo JSON deve ser um array/);
});
