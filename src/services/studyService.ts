import {
  doc,
  onSnapshot,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase/config';
import { WeekPlan, UserStudyData, StudyMaterial } from '../types';
import { INITIAL_WEEKS } from '../data/initialWeeks';

const STORAGE_KEYS = {
  WEEKS: 'studyflow_weeks_cache',
  OFFICIAL_MATERIALS: 'studyflow_official_materials_cache',
  USER_DATA_PREFIX: 'studyflow_user_data_'
};

/**
 * Subscribes to the global weeks plan from Firestore (system/weeks_plan)
 */
export function subscribeToWeeksPlan(
  onData: (weeks: WeekPlan[]) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, 'system', 'weeks_plan');

  // Load from local storage cache initially
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.WEEKS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onData(parsed);
      }
    } else {
      onData(INITIAL_WEEKS);
    }
  } catch (e) {
    console.warn('Could not read cached weeks:', e);
    onData(INITIAL_WEEKS);
  }

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.weeks) && data.weeks.length > 0) {
          localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(data.weeks));
          onData(data.weeks as WeekPlan[]);
          return;
        }
      }
      // If document doesn't exist yet, we keep initial weeks
      onData(INITIAL_WEEKS);
    },
    (error) => {
      console.warn('Firestore snapshot error on system/weeks_plan:', error.message);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, 'system/weeks_plan');
      } catch {
        // Handled via fallback
      }
    }
  );

  return unsubscribe;
}

/**
 * Saves weeks plan to Firestore (coordination/admin only)
 */
export async function saveWeeksPlanToFirestore(weeks: WeekPlan[]): Promise<void> {
  const path = 'system/weeks_plan';
  const currentUser = auth.currentUser;

  // Always update local cache immediately
  localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(weeks));

  try {
    const docRef = doc(db, 'system', 'weeks_plan');
    await setDoc(docRef, {
      weeks,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.email || currentUser?.uid || 'coordinator'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to official coordination materials from Firestore (system/official_materials)
 */
export function subscribeToOfficialMaterials(
  onData: (materials: StudyMaterial[]) => void
): () => void {
  const docRef = doc(db, 'system', 'official_materials');

  try {
    const cached = localStorage.getItem(STORAGE_KEYS.OFFICIAL_MATERIALS);
    if (cached) {
      onData(JSON.parse(cached));
    }
  } catch {
    // ignore
  }

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.materials)) {
          localStorage.setItem(STORAGE_KEYS.OFFICIAL_MATERIALS, JSON.stringify(data.materials));
          onData(data.materials as StudyMaterial[]);
          return;
        }
      }
      onData([]);
    },
    (error) => {
      console.warn('Official materials snapshot warning:', error.message);
      try {
        handleFirestoreError(error, OperationType.GET, 'system/official_materials');
      } catch {
        // Fallback
      }
    }
  );

  return unsubscribe;
}

/**
 * Adds an official material (coordinator)
 */
export async function addOfficialMaterial(material: Omit<StudyMaterial, 'id' | 'createdAt'>): Promise<void> {
  const path = 'system/official_materials';
  const docRef = doc(db, 'system', 'official_materials');
  const snap = await getDoc(docRef);
  const current: StudyMaterial[] = snap.exists() ? (snap.data().materials || []) : [];

  const newMaterial: StudyMaterial = {
    ...material,
    id: `mat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString()
  };

  const updated = [newMaterial, ...current];
  localStorage.setItem(STORAGE_KEYS.OFFICIAL_MATERIALS, JSON.stringify(updated));

  try {
    await setDoc(docRef, {
      materials: updated,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.email || 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes an official material (coordinator)
 */
export async function deleteOfficialMaterial(materialId: string): Promise<void> {
  const path = 'system/official_materials';
  const docRef = doc(db, 'system', 'official_materials');
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;

  const current: StudyMaterial[] = snap.data().materials || [];
  const updated = current.filter(m => m.id !== materialId);
  localStorage.setItem(STORAGE_KEYS.OFFICIAL_MATERIALS, JSON.stringify(updated));

  try {
    await setDoc(docRef, {
      materials: updated,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.email || 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Default empty student state
 */
export function getDefaultUserData(uid: string, email: string): UserStudyData {
  return {
    uid,
    email,
    completedBlocks: [],
    completedDays: [],
    notes: {},
    pomodoroMinutes: 0,
    questionsStats: {
      total: 0,
      correct: 0,
      wrong: 0
    },
    personalMaterials: []
  };
}

/**
 * Subscribes to student study progress in Firestore (users/{uid})
 */
export function subscribeToUserData(
  uid: string,
  userEmail: string,
  onData: (data: UserStudyData) => void
): () => void {
  const userDocRef = doc(db, 'users', uid);
  const cacheKey = `${STORAGE_KEYS.USER_DATA_PREFIX}${uid}`;

  // Read local storage immediately
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      onData(JSON.parse(cached));
    } else {
      onData(getDefaultUserData(uid, userEmail));
    }
  } catch {
    onData(getDefaultUserData(uid, userEmail));
  }

  const unsubscribe = onSnapshot(
    userDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserStudyData;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        onData(data);
      } else {
        // Create initial user doc
        const initial = getDefaultUserData(uid, userEmail);
        setDoc(userDocRef, {
          ...initial,
          updatedAt: new Date().toISOString()
        }).catch(() => {});
        onData(initial);
      }
    },
    (error) => {
      console.warn('User progress snapshot error:', error.message);
      try {
        handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      } catch {
        // Fallback to cache
      }
    }
  );

  return unsubscribe;
}

/**
 * Saves full or partial user study data to users/{uid}
 */
export async function saveUserData(uid: string, data: Partial<UserStudyData>): Promise<void> {
  const path = `users/${uid}`;
  const userDocRef = doc(db, 'users', uid);
  const cacheKey = `${STORAGE_KEYS.USER_DATA_PREFIX}${uid}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    const prev = cached ? JSON.parse(cached) : {};
    const updated = { ...prev, ...data, uid, updatedAt: new Date().toISOString() };
    localStorage.setItem(cacheKey, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    await setDoc(userDocRef, {
      ...data,
      uid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
