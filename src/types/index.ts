import { StudyBlock, DayPlan, WeekPlan } from '../utils/studyLogic';

export type { StudyBlock, DayPlan, WeekPlan };

export interface StudyMaterial {
  id: string;
  weekId: string;
  day: string;
  blockIdx: number; // 1, 2 or 3
  title: string;
  fileUrl: string; // Direct link or Google Drive link
  driveFileId?: string;
  type: 'official' | 'personal';
  uploadedBy?: string;
  uploadedByName?: string;
  createdAt: string;
}

export interface UserStudyData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  completedBlocks: string[]; // List of block keys, e.g. "semana-1_Segunda_b1"
  completedDays: string[];   // List of day keys, e.g. "semana-1_Segunda"
  notes: Record<string, string>; // blockKey -> text
  pomodoroMinutes: number;
  questionsStats: {
    total: number;
    correct: number;
    wrong: number;
  };
  personalMaterials: StudyMaterial[];
  updatedAt?: string;
}

export interface SystemWeeksDoc {
  weeks: WeekPlan[];
  updatedAt: string;
  updatedBy: string;
}

export interface SystemMaterialsDoc {
  materials: StudyMaterial[];
  updatedAt: string;
  updatedBy: string;
}
