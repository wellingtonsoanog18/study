import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import confetti from 'canvas-confetti';
import { auth, googleProvider } from './firebase/config';
import { WeekPlan, StudyBlock, StudyMaterial, UserStudyData, DayPlan } from './types';
import { INITIAL_WEEKS } from './data/initialWeeks';
import {
  subscribeToWeeksPlan,
  saveWeeksPlanToFirestore,
  subscribeToOfficialMaterials,
  addOfficialMaterial,
  deleteOfficialMaterial,
  subscribeToUserData,
  saveUserData,
  getDefaultUserData
} from './services/studyService';
import {
  canUserAccessWeek,
  calculateWeekProgress,
  isDayCompleted
} from './utils/studyLogic';
import { Navbar } from './components/Navbar';
import { WeekSelector } from './components/WeekSelector';
import { WeekHeader } from './components/WeekHeader';
import { DayCard } from './components/DayCard';
import { VideoModal } from './components/VideoModal';
import { MaterialsModal } from './components/MaterialsModal';
import { NotesModal } from './components/NotesModal';
import { PomodoroTimer } from './components/PomodoroTimer';
import { QuestionsTracker } from './components/QuestionsTracker';
import { ManageWeeksModal } from './components/ManageWeeksModal';
import { RestrictedWeekNotice } from './components/RestrictedWeekNotice';
import { MementoGeneratorModal } from './components/MementoGeneratorModal';

// Bootstrapped Admin specified in requirements
const PRIMARY_ADMIN_EMAIL = 'wellington.nogueira18@gmail.com';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [weeks, setWeeks] = useState<WeekPlan[]>(INITIAL_WEEKS);
  const [selectedWeekId, setSelectedWeekId] = useState<string>('semana-1');
  const [officialMaterials, setOfficialMaterials] = useState<StudyMaterial[]>([]);
  const [userData, setUserData] = useState<UserStudyData>(
    getDefaultUserData('guest', 'visitante@studyflow.local')
  );

  // Modals state
  const [activeVideoBlock, setActiveVideoBlock] = useState<StudyBlock | null>(null);
  const [activeMaterialsTarget, setActiveMaterialsTarget] = useState<{
    day: string;
    blockIdx: number;
    title: string;
  } | null>(null);
  const [activeNotesTarget, setActiveNotesTarget] = useState<{
    blockKey: string;
    title: string;
  } | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState<boolean>(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [isManageWeeksOpen, setIsManageWeeksOpen] = useState<boolean>(false);
  const [isCoordinatorDemo, setIsCoordinatorDemo] = useState<boolean>(false);
  const [activeMementoTarget, setActiveMementoTarget] = useState<{
    subject: string;
    topic: string;
    subtopics?: string[];
    blockKey?: string;
  } | null>(null);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Subscribe to weeks plan in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToWeeksPlan((loadedWeeks) => {
      if (loadedWeeks && loadedWeeks.length > 0) {
        setWeeks(loadedWeeks);
        // Ensure selected week exists
        if (!loadedWeeks.some(w => w.id === selectedWeekId)) {
          setSelectedWeekId(loadedWeeks[0].id);
        }
      }
    });
    return unsubscribe;
  }, [selectedWeekId]);

  // Subscribe to official materials in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToOfficialMaterials((mats) => {
      setOfficialMaterials(mats || []);
    });
    return unsubscribe;
  }, []);

  // Subscribe to user study progress in Firestore or LocalStorage
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToUserData(
        currentUser.uid,
        currentUser.email || 'aluno@meta.com',
        (data) => {
          setUserData(data);
        }
      );
      return unsubscribe;
    } else {
      // Guest local storage
      const guestKey = 'studyflow_guest_user_data';
      try {
        const cached = localStorage.getItem(guestKey);
        if (cached) {
          setUserData(JSON.parse(cached));
        } else {
          setUserData(getDefaultUserData('guest', 'visitante@studyflow.local'));
        }
      } catch {
        setUserData(getDefaultUserData('guest', 'visitante@studyflow.local'));
      }
    }
  }, [currentUser]);

  // Check if current user has admin status
  const isAdmin = useMemo(() => {
    if (!currentUser) return isCoordinatorDemo;
    const isEmailAdmin = currentUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
    return isEmailAdmin || isCoordinatorDemo;
  }, [currentUser, isCoordinatorDemo]);

  // Active week object
  const currentWeek = useMemo(() => {
    return weeks.find(w => w.id === selectedWeekId) || weeks[0] || INITIAL_WEEKS[0];
  }, [weeks, selectedWeekId]);

  // Completed block keys set
  const completedBlockKeys = useMemo(() => {
    return new Set(userData.completedBlocks || []);
  }, [userData.completedBlocks]);

  // Access check for active week
  const hasAccessToCurrentWeek = useMemo(() => {
    return canUserAccessWeek(currentWeek, currentUser?.email, isAdmin);
  }, [currentWeek, currentUser?.email, isAdmin]);

  // Week progress calculation
  const weekProgress = useMemo(() => {
    return calculateWeekProgress(currentWeek, completedBlockKeys);
  }, [currentWeek, completedBlockKeys]);

  // Overall progress calculation across all accessible weeks
  const totalProgress = useMemo(() => {
    let totalAll = 0;
    let completedAll = 0;

    weeks.forEach(w => {
      const p = calculateWeekProgress(w, completedBlockKeys);
      totalAll += p.totalBlocks;
      completedAll += p.completedCount;
    });

    if (totalAll === 0) return 0;
    return Math.round((completedAll / totalAll) * 100);
  }, [weeks, completedBlockKeys]);

  // Helper to trigger confetti celebration
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Update study data in Firestore / LocalStorage
  const persistUserData = useCallback(async (updated: Partial<UserStudyData>) => {
    const merged = { ...userData, ...updated };
    setUserData(merged);

    if (currentUser) {
      await saveUserData(currentUser.uid, updated);
    } else {
      localStorage.setItem('studyflow_guest_user_data', JSON.stringify(merged));
    }
  }, [currentUser, userData]);

  // Toggle individual block
  const handleToggleBlock = useCallback(async (blockKey: string) => {
    const currentList = userData.completedBlocks || [];
    const isAlready = currentList.includes(blockKey);

    let nextList: string[];
    if (isAlready) {
      nextList = currentList.filter(k => k !== blockKey);
    } else {
      nextList = [...currentList, blockKey];
    }

    await persistUserData({ completedBlocks: nextList });

    // Check if whole day was completed with this click
    if (!isAlready) {
      // Find the day this block belongs to
      for (const day of currentWeek.days) {
        if (isDayCompleted(currentWeek.id, day, nextList) && !isDayCompleted(currentWeek.id, day, currentList)) {
          triggerConfetti();
          break;
        }
      }
    }
  }, [userData.completedBlocks, persistUserData, currentWeek, triggerConfetti]);

  // Toggle whole day
  const handleToggleWholeDay = useCallback(async (day: DayPlan, currentlyComplete: boolean) => {
    const blocks = [day.b1, day.b2, day.b3];
    const dayKeys: string[] = [];

    blocks.forEach((b, idx) => {
      if (b && b.title) {
        dayKeys.push(`${currentWeek.id}_${day.day}_b${idx + 1}`);
      }
    });

    const currentList = new Set(userData.completedBlocks || []);

    if (currentlyComplete) {
      // Uncheck all in this day
      dayKeys.forEach(k => currentList.delete(k));
    } else {
      // Check all in this day
      dayKeys.forEach(k => currentList.add(k));
      triggerConfetti();
    }

    await persistUserData({ completedBlocks: Array.from(currentList) });
  }, [currentWeek.id, userData.completedBlocks, persistUserData, triggerConfetti]);

  // Save notes
  const handleSaveNote = useCallback(async (blockKey: string, text: string) => {
    const nextNotes = { ...(userData.notes || {}), [blockKey]: text };
    await persistUserData({ notes: nextNotes });
  }, [userData.notes, persistUserData]);

  // Add pomodoro minutes
  const handleAddPomodoroMinutes = useCallback(async (minutes: number) => {
    const total = (userData.pomodoroMinutes || 0) + minutes;
    await persistUserData({ pomodoroMinutes: total });
    triggerConfetti();
  }, [userData.pomodoroMinutes, persistUserData, triggerConfetti]);

  // Update questions statistics
  const handleUpdateQuestionsStats = useCallback(async (newStats: { total: number; correct: number; wrong: number }) => {
    await persistUserData({ questionsStats: newStats });
  }, [persistUserData]);

  // Materials handlers
  const handleAddOfficialMaterial = async (mat: Omit<StudyMaterial, 'id' | 'createdAt'>) => {
    await addOfficialMaterial(mat);
  };

  const handleDeleteOfficialMaterial = async (id: string) => {
    await deleteOfficialMaterial(id);
  };

  const handleAddPersonalMaterial = async (mat: Omit<StudyMaterial, 'id' | 'createdAt'>) => {
    const currentList = userData.personalMaterials || [];
    const newMat: StudyMaterial = {
      ...mat,
      id: `pmat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    await persistUserData({ personalMaterials: [newMat, ...currentList] });
  };

  const handleDeletePersonalMaterial = async (id: string) => {
    const currentList = userData.personalMaterials || [];
    const filtered = currentList.filter(m => m.id !== id);
    await persistUserData({ personalMaterials: filtered });
  };

  // Save weeks to Firestore
  const handleSaveWeeks = async (updatedWeeks: WeekPlan[]) => {
    setWeeks(updatedWeeks);
    await saveWeeksPlanToFirestore(updatedWeeks);
  };

  // Google Login / Logout
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in error:', err);
      // Helpful fallback notice for sandbox iframe if popup is blocked
      alert('Autenticação com Google iniciada. Certifique-se de permitir janelas pop-up no seu navegador para conectar sua conta.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        isAdmin={isAdmin}
        totalProgress={totalProgress}
        pomodoroActive={false}
        pomodoroTimeDisplay="25:00"
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenQuestions={() => setIsQuestionsOpen(true)}
        onOpenMementos={() =>
          setActiveMementoTarget({
            subject: 'Revisão Geral',
            topic: currentWeek.title,
            subtopics: currentWeek.days.map(d => d.day)
          })
        }
        onOpenManageWeeks={() => setIsManageWeeksOpen(true)}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onToggleCoordinatorDemo={() => setIsCoordinatorDemo(!isCoordinatorDemo)}
        isCoordinatorDemo={isCoordinatorDemo}
      />

      {/* Week Selector Bar */}
      <WeekSelector
        weeks={weeks}
        selectedWeekId={selectedWeekId}
        onSelectWeek={(id) => setSelectedWeekId(id)}
        userEmail={currentUser?.email}
        isAdmin={isAdmin}
        getWeekProgressPercent={(w) => calculateWeekProgress(w, completedBlockKeys).percentage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Week Header */}
        <WeekHeader
          week={currentWeek}
          totalBlocks={weekProgress.totalBlocks}
          completedBlocksCount={weekProgress.completedCount}
          progressPercent={weekProgress.percentage}
          isAdmin={isAdmin}
          onOpenManageWeeks={() => setIsManageWeeksOpen(true)}
        />

        {/* Schedule or Restricted Notice */}
        {!hasAccessToCurrentWeek ? (
          <RestrictedWeekNotice
            week={currentWeek}
            currentUser={currentUser}
            onLogin={handleGoogleLogin}
            onOpenManageWeeks={() => setIsManageWeeksOpen(true)}
            isCoordinatorDemo={isCoordinatorDemo}
          />
        ) : (
          <div>
            {/* Grid of Days (6 or 7 days) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentWeek.days.map((day) => (
                <DayCard
                  key={day.day}
                  day={day}
                  weekId={currentWeek.id}
                  completedBlockKeys={completedBlockKeys}
                  onToggleBlock={handleToggleBlock}
                  onToggleWholeDay={handleToggleWholeDay}
                  onPlayVideo={(block) => setActiveVideoBlock(block)}
                  onOpenMaterials={(dayName, blockIdx, blockTitle) =>
                    setActiveMaterialsTarget({ day: dayName, blockIdx, title: blockTitle })
                  }
                  onOpenNotes={(blockKey, blockTitle) =>
                    setActiveNotesTarget({ blockKey, title: blockTitle })
                  }
                  onOpenMementos={(block, blockKey) =>
                    setActiveMementoTarget({
                      subject: block.sub,
                      topic: block.title,
                      subtopics: [block.t1, block.t2, block.t3].filter(Boolean) as string[],
                      blockKey
                    })
                  }
                  notes={userData.notes || {}}
                  allMaterials={[
                    ...officialMaterials,
                    ...(userData.personalMaterials || [])
                  ]}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Video Modal */}
      <VideoModal
        isOpen={Boolean(activeVideoBlock)}
        block={activeVideoBlock}
        onClose={() => setActiveVideoBlock(null)}
        isCompleted={Boolean(
          activeVideoBlock &&
            completedBlockKeys.has(
              `${currentWeek.id}_${activeVideoBlock.title}_b${activeVideoBlock.idx}`
            )
        )}
        onToggleComplete={() => {
          if (activeVideoBlock) {
            // Find key
            for (const day of currentWeek.days) {
              const blocks = [day.b1, day.b2, day.b3];
              blocks.forEach((b, idx) => {
                if (b && b.title === activeVideoBlock.title) {
                  handleToggleBlock(`${currentWeek.id}_${day.day}_b${idx + 1}`);
                }
              });
            }
          }
        }}
      />

      {/* Materials & Drive Modal */}
      <MaterialsModal
        isOpen={Boolean(activeMaterialsTarget)}
        onClose={() => setActiveMaterialsTarget(null)}
        weekId={currentWeek.id}
        day={activeMaterialsTarget?.day || ''}
        blockIdx={activeMaterialsTarget?.blockIdx || 1}
        blockTitle={activeMaterialsTarget?.title || ''}
        officialMaterials={officialMaterials}
        personalMaterials={userData.personalMaterials || []}
        isAdmin={isAdmin}
        onAddOfficialMaterial={handleAddOfficialMaterial}
        onDeleteOfficialMaterial={handleDeleteOfficialMaterial}
        onAddPersonalMaterial={handleAddPersonalMaterial}
        onDeletePersonalMaterial={handleDeletePersonalMaterial}
      />

      {/* Notes Modal */}
      <NotesModal
        isOpen={Boolean(activeNotesTarget)}
        onClose={() => setActiveNotesTarget(null)}
        blockKey={activeNotesTarget?.blockKey || ''}
        blockTitle={activeNotesTarget?.title || ''}
        initialNote={
          activeNotesTarget ? (userData.notes || {})[activeNotesTarget.blockKey] || '' : ''
        }
        onSaveNote={handleSaveNote}
      />

      {/* Pomodoro Timer Modal */}
      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        totalStudyMinutes={userData.pomodoroMinutes || 0}
        onAddMinutes={handleAddPomodoroMinutes}
      />

      {/* Questions Tracker Modal */}
      <QuestionsTracker
        isOpen={isQuestionsOpen}
        onClose={() => setIsQuestionsOpen(false)}
        stats={userData.questionsStats || { total: 0, correct: 0, wrong: 0 }}
        onUpdateStats={handleUpdateQuestionsStats}
      />

      {/* Coordination Manage Weeks & JSON Importer Modal */}
      <ManageWeeksModal
        isOpen={isManageWeeksOpen}
        onClose={() => setIsManageWeeksOpen(false)}
        weeks={weeks}
        onSaveWeeks={handleSaveWeeks}
        currentAdminEmail={currentUser?.email || PRIMARY_ADMIN_EMAIL}
      />

      {/* Mementos, PDFs & Exam Questions AI Generator Modal */}
      <MementoGeneratorModal
        isOpen={Boolean(activeMementoTarget)}
        onClose={() => setActiveMementoTarget(null)}
        defaultSubject={activeMementoTarget?.subject || 'Direito Constitucional'}
        defaultTopic={activeMementoTarget?.topic || 'Princípios Fundamentais'}
        defaultSubtopics={activeMementoTarget?.subtopics || []}
        blockKey={activeMementoTarget?.blockKey}
        onSaveToNotes={handleSaveNote}
        onLogQuestions={(count) => {
          const prev = userData.questionsStats || { total: 0, correct: 0, wrong: 0 };
          handleUpdateQuestionsStats({
            total: prev.total + count,
            correct: prev.correct,
            wrong: prev.wrong
          });
        }}
      />
    </div>
  );
}
