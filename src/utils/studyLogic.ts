/**
 * Core pure logic for StudyFlow Pro:
 * - Week Access Check (RBAC: ALL vs RESTRICTED with authorized email list)
 * - Study Progress Calculation (block completion, day completion, week completion)
 * - Question Tracker Metrics (accuracy, rates)
 * - JSON Plan Validator and Normalizer
 */

export interface StudyBlock {
  sub: string;
  title: string;
  idx?: number | string;
  videoUrl?: string;
  t1?: string;
  t2?: string;
  t3?: string;
  durationMin?: number;
  type?: 'theory' | 'practice' | 'review';
}

export interface DayPlan {
  day: string; // e.g. "Segunda-feira" or "Segunda"
  shortDay?: string; // e.g. "SEG"
  dateLabel?: string;
  b1?: StudyBlock;
  b2?: StudyBlock;
  b3?: StudyBlock;
}

export interface WeekPlan {
  id: string; // e.g. "semana-1"
  weekNumber: number;
  title: string;
  description?: string;
  access: 'ALL' | 'RESTRICTED';
  allowedEmails?: string[];
  days: DayPlan[];
}

/**
 * Checks if a user has access to a given week
 */
export function canUserAccessWeek(
  week: { access: 'ALL' | 'RESTRICTED'; allowedEmails?: string[] },
  userEmail?: string | null,
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;
  if (week.access === 'ALL') return true;
  if (!userEmail) return false;
  
  const normalizedUserEmail = userEmail.trim().toLowerCase();
  const allowed = (week.allowedEmails || []).map(e => e.trim().toLowerCase());
  return allowed.includes(normalizedUserEmail);
}

/**
 * Calculates progress for a week given completed block keys (e.g. ['semana-1_Segunda_b1', ...])
 */
export function calculateWeekProgress(
  week: WeekPlan,
  completedBlockKeys: Set<string> | string[]
): {
  totalBlocks: number;
  completedCount: number;
  percentage: number;
  isComplete: boolean;
} {
  const completedSet = completedBlockKeys instanceof Set ? completedBlockKeys : new Set(completedBlockKeys);
  let totalBlocks = 0;
  let completedCount = 0;

  for (const day of week.days) {
    const blocks: (StudyBlock | undefined)[] = [day.b1, day.b2, day.b3];
    blocks.forEach((block, idx) => {
      if (block && block.title) {
        totalBlocks++;
        const blockKey = `${week.id}_${day.day}_b${idx + 1}`;
        if (completedSet.has(blockKey)) {
          completedCount++;
        }
      }
    });
  }

  const percentage = totalBlocks === 0 ? 0 : Math.round((completedCount / totalBlocks) * 100);
  return {
    totalBlocks,
    completedCount,
    percentage,
    isComplete: totalBlocks > 0 && completedCount === totalBlocks
  };
}

/**
 * Checks if all blocks in a specific day are completed
 */
export function isDayCompleted(
  weekId: string,
  day: DayPlan,
  completedBlockKeys: Set<string> | string[]
): boolean {
  const completedSet = completedBlockKeys instanceof Set ? completedBlockKeys : new Set(completedBlockKeys);
  const blocks: (StudyBlock | undefined)[] = [day.b1, day.b2, day.b3];
  let hasAtLeastOne = false;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b && b.title) {
      hasAtLeastOne = true;
      const key = `${weekId}_${day.day}_b${i + 1}`;
      if (!completedSet.has(key)) {
        return false;
      }
    }
  }

  return hasAtLeastOne;
}

/**
 * Calculates accuracy percentage for question sessions
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total <= 0 || correct < 0) return 0;
  if (correct > total) return 100;
  return Math.round((correct / total) * 100);
}

/**
 * Validates and normalizes DayPlan[] imported from JSON
 */
export function validateAndNormalizeDayPlans(importedData: unknown): DayPlan[] {
  if (!Array.isArray(importedData)) {
    throw new Error('O formato do arquivo JSON deve ser um array de dias (DayPlan[]).');
  }

  if (importedData.length === 0) {
    throw new Error('O cronograma importado não contém nenhum dia.');
  }

  return importedData.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Dia no índice ${index} inválido.`);
    }

    const raw = item as Record<string, unknown>;
    const day = typeof raw.day === 'string' && raw.day.trim() ? raw.day.trim() : `Dia ${index + 1}`;

    const normalizeBlock = (b: unknown, defaultType: 'theory' | 'practice' = 'theory'): StudyBlock | undefined => {
      if (!b || typeof b !== 'object') return undefined;
      const rb = b as Record<string, unknown>;
      const title = typeof rb.title === 'string' ? rb.title.trim() : '';
      if (!title) return undefined;

      return {
        sub: typeof rb.sub === 'string' ? rb.sub.trim() : 'Geral',
        title,
        idx: typeof rb.idx === 'number' || typeof rb.idx === 'string' ? rb.idx : index + 1,
        videoUrl: typeof rb.videoUrl === 'string' ? rb.videoUrl : undefined,
        t1: typeof rb.t1 === 'string' ? rb.t1.trim() : undefined,
        t2: typeof rb.t2 === 'string' ? rb.t2.trim() : undefined,
        t3: typeof rb.t3 === 'string' ? rb.t3.trim() : undefined,
        durationMin: typeof rb.durationMin === 'number' ? rb.durationMin : 60,
        type: rb.type === 'practice' || rb.type === 'review' ? rb.type : defaultType
      };
    };

    return {
      day,
      shortDay: typeof raw.shortDay === 'string' ? raw.shortDay : day.slice(0, 3).toUpperCase(),
      dateLabel: typeof raw.dateLabel === 'string' ? raw.dateLabel : undefined,
      b1: normalizeBlock(raw.b1, 'theory'),
      b2: normalizeBlock(raw.b2, 'theory'),
      b3: normalizeBlock(raw.b3, 'practice')
    };
  });
}
