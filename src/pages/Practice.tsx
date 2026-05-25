import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  BookOpen, 
  Award, 
  RotateCcw, 
  Brain, 
  Check, 
  X, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { n5KanjiData } from '../data/n5';
import { n4KanjiData } from '../data/n4';
import { KanjiEntry } from '../types/kanji';

interface SrsRecord {
  kanji: string;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
}

type SessionMode = 'DUE_REVIEW' | 'LEARN_NEW' | 'FREE_STUDY' | null;

export const Practice = () => {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'ALL'>('ALL');
  
  // SRS data loaded from localStorage
  const [srsData, setSrsData] = useState<Record<string, SrsRecord>>({});
  
  // Current Session States
  const [sessionMode, setSessionMode] = useState<SessionMode>(null);
  const [sessionQueue, setSessionQueue] = useState<KanjiEntry[]>([]);
  const [initialQueueSize, setInitialQueueSize] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Load SRS data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('digital-engawa-srs');
    if (saved) {
      try {
        setSrsData(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing SRS data:', e);
      }
    }
  }, []);

  // Save SRS data to state and localStorage
  const saveSrsRecord = (record: SrsRecord) => {
    const updated = { ...srsData, [record.kanji]: record };
    setSrsData(updated);
    localStorage.setItem('digital-engawa-srs', JSON.stringify(updated));
  };

  // SM-2 Spaced Repetition Algorithm
  const calculateSM2 = (quality: number, easiness: number, repetitions: number, interval: number) => {
    let newEasiness = easiness;
    let newRepetitions = repetitions;
    let newInterval = interval;

    if (quality < 3) {
      // Incorrect answer, reset interval
      newRepetitions = 0;
      newInterval = 1;
    } else {
      if (newRepetitions === 0) {
        newInterval = 1; // 1 day
      } else if (newRepetitions === 1) {
        newInterval = 4; // 4 days (fast review)
      } else {
        newInterval = Math.round(interval * easiness);
      }
      newRepetitions++;
    }

    // Calculate new easiness factor (SM-2 standard formula)
    newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEasiness < 1.3) {
      newEasiness = 1.3;
    }

    return {
      easiness: Number(newEasiness.toFixed(2)),
      interval: newInterval,
      repetitions: newRepetitions,
      nextReviewDate: Date.now() + newInterval * 24 * 60 * 60 * 1000 // future timestamp in milliseconds
    };
  };

  // Get full Kanji list according to the level
  const fullLevelData = useMemo(() => {
    if (selectedLevel === 'N5') return n5KanjiData;
    if (selectedLevel === 'N4') return n4KanjiData;
    return [...n5KanjiData, ...n4KanjiData];
  }, [selectedLevel]);

  // Classify Kanjis into SRS states
  const srsStats = useMemo(() => {
    const now = Date.now();
    let dueCount = 0;
    let learnedCount = 0;
    let newCount = 0;

    const dueList: KanjiEntry[] = [];
    const newList: KanjiEntry[] = [];

    fullLevelData.forEach(item => {
      const record = srsData[item.kanji];
      if (!record) {
        newCount++;
        newList.push(item);
      } else if (record.nextReviewDate <= now) {
        dueCount++;
        dueList.push(item);
      } else {
        learnedCount++;
      }
    });

    return {
      dueCount,
      learnedCount,
      newCount,
      dueList,
      newList
    };
  }, [fullLevelData, srsData]);

  // Start Session: Repaso Diario (Due cards)
  const startDueReview = () => {
    if (srsStats.dueList.length === 0) return;
    // Shuffle due cards to avoid learning bias
    const shuffled = [...srsStats.dueList].sort(() => Math.random() - 0.5);
    setSessionQueue(shuffled);
    setInitialQueueSize(shuffled.length);
    setSessionMode('DUE_REVIEW');
    setShowAnswer(false);
    setShowSuccessScreen(false);
  };

  // Start Session: Aprender Kanjis Nuevos (Take up to 5 new cards)
  const startLearnNew = () => {
    if (srsStats.newList.length === 0) return;
    // Take first 5 new cards
    const newCards = srsStats.newList.slice(0, 5);
    setSessionQueue(newCards);
    setInitialQueueSize(newCards.length);
    setSessionMode('LEARN_NEW');
    setShowAnswer(false);
    setShowSuccessScreen(false);
  };

  // Start Session: Práctica Libre
  const startFreeStudy = () => {
    if (fullLevelData.length === 0) return;
    // Take 15 random cards
    const randomCards = [...fullLevelData].sort(() => Math.random() - 0.5).slice(0, 15);
    setSessionQueue(randomCards);
    setInitialQueueSize(randomCards.length);
    setSessionMode('FREE_STUDY');
    setShowAnswer(false);
    setShowSuccessScreen(false);
  };

  // Handle User Rating
  const handleRating = (quality: number) => {
    const currentKanji = sessionQueue[0];
    if (!currentKanji) return;

    // Retrieve or initialize the permanent SRS record
    const existingRecord = srsData[currentKanji.kanji] || {
      kanji: currentKanji.kanji,
      easiness: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: Date.now()
    };

    // Calculate updated SM-2 values
    const updated = calculateSM2(
      quality, 
      existingRecord.easiness, 
      existingRecord.repetitions, 
      existingRecord.interval
    );

    // Save record persistently in state and localStorage
    saveSrsRecord({
      kanji: currentKanji.kanji,
      ...updated
    });

    // Rotate or advance the session queue
    if (quality < 3) {
      // "No lo sé": Rotate card to the back of the queue so they practice it again
      setSessionQueue(prev => {
        const rotated = [...prev];
        const first = rotated.shift();
        if (first) rotated.push(first);
        return rotated;
      });
    } else {
      // "Difícil" or "Fácil": Remove card from this active session queue
      setSessionQueue(prev => prev.slice(1));
    }

    setShowAnswer(false);

    // Check if session has finished
    // (If quality was >=3, the next length will be 0)
    if (quality >= 3 && sessionQueue.length === 1) {
      setShowSuccessScreen(true);
    }
  };

  const handleFinishSession = () => {
    setSessionMode(null);
    setSessionQueue([]);
    setShowSuccessScreen(false);
  };

  const currentKanji = sessionQueue[0];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <AnimatePresence mode="wait">
        {!sessionMode ? (
          /* SRS Welcome & Status Dashboard */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Práctica Inteligente (SRS)</h2>
                <p className="text-on-surface-variant mt-2">
                  Optimiza tu memoria con el algoritmo de repetición espaciada SM-2. Repasa las palabras en su momento exacto de olvido.
                </p>
              </div>

              {/* Level Selector */}
              <div className="bg-surface-container-low p-1 rounded-full flex self-start">
                <button
                  onClick={() => setSelectedLevel('ALL')}
                  className={`px-5 py-2 rounded-full font-bold text-xs transition-colors ${selectedLevel === 'ALL' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedLevel('N5')}
                  className={`px-5 py-2 rounded-full font-bold text-xs transition-colors ${selectedLevel === 'N5' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  N5
                </button>
                <button
                  onClick={() => setSelectedLevel('N4')}
                  className={`px-5 py-2 rounded-full font-bold text-xs transition-colors ${selectedLevel === 'N4' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  N4
                </button>
              </div>
            </div>

            {/* SRS Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-6 flex items-center space-x-5 shadow-sm">
                <div className="p-4 rounded-xl bg-error-container/20 text-error">
                  <Flame size={22} />
                </div>
                <div>
                  <span className="text-sm text-on-surface-variant block font-medium">Pendientes hoy</span>
                  <span className="text-3xl font-extrabold">{srsStats.dueCount}</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-6 flex items-center space-x-5 shadow-sm">
                <div className="p-4 rounded-xl bg-primary-container/20 text-primary">
                  <Award size={22} />
                </div>
                <div>
                  <span className="text-sm text-on-surface-variant block font-medium">Kanjis aprendidos</span>
                  <span className="text-3xl font-extrabold">{srsStats.learnedCount}</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-6 flex items-center space-x-5 shadow-sm">
                <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant">
                  <BookOpen size={22} />
                </div>
                <div>
                  <span className="text-sm text-on-surface-variant block font-medium">Kanjis nuevos</span>
                  <span className="text-3xl font-extrabold">{srsStats.newCount}</span>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                <div className="space-y-2 max-w-xl">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Brain size={20} />
                    Repaso Diario Programado
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Repasa los kanjis que vencen hoy en tu curva de aprendizaje. Este modo mantiene activos tus conocimientos a largo plazo.
                  </p>
                </div>
                <button
                  onClick={startDueReview}
                  disabled={srsStats.dueCount === 0}
                  className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:scale-100 flex-shrink-0"
                >
                  <span>Iniciar Repaso ({srsStats.dueCount})</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      Aprender Kanjis Nuevos
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Añade 5 caracteres nuevos a tu base de datos de repasos para continuar expandiendo tu vocabulario de nivel {selectedLevel}.
                    </p>
                  </div>
                  <button
                    onClick={startLearnNew}
                    disabled={srsStats.newCount === 0}
                    className="w-full bg-surface-container-low border-2 border-surface-container-high text-on-surface hover:bg-surface-container-high px-6 py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>Aprender 5 Nuevos</span>
                  </button>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-500" />
                      Sesión de Práctica Libre
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Práctica libre y sin presiones. Te presentaremos 15 kanjis al azar de tu nivel actual. No afectará tu mazo programado diario.
                    </p>
                  </div>
                  <button
                    onClick={startFreeStudy}
                    className="w-full bg-surface-container-low border-2 border-surface-container-high text-on-surface hover:bg-surface-container-high px-6 py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Iniciar Práctica Libre</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : showSuccessScreen ? (
          /* Session Completed Success View */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-container-lowest border-2 border-surface-container-high shadow-lg rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-sm">
              <Award size={48} />
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-extrabold tracking-tight">¡Estás al día! 🌸</h3>
              <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                {sessionMode === 'DUE_REVIEW' 
                  ? 'Felicidades, Alex. Has completado tus repasos programados para el día de hoy. Tu memoria a largo plazo te lo agradecerá.'
                  : sessionMode === 'LEARN_NEW'
                    ? '¡Nuevos conocimientos desbloqueados! Estos 5 kanjis han sido añadidos a tu agenda y aparecerán pronto en tus repasos programados.'
                    : 'Has completado con éxito tu sesión de práctica libre libre de presiones.'
                }
              </p>
            </div>

            <button
              onClick={handleFinishSession}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-[1.02] transition-transform shadow-md"
            >
              Volver al Panel de Práctica
            </button>
          </motion.div>
        ) : (
          /* Active Flashcard Study View */
          <motion.div
            key="session"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-6"
          >
            {/* Header / Session Details */}
            <div className="w-full flex items-center justify-between mb-8 max-w-2xl">
              <div>
                <button
                  onClick={handleFinishSession}
                  className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={14} />
                  <span>Salir de la sesión</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 text-sm font-semibold text-on-surface-variant">
                <span className="px-3 py-1 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-wider">
                  {sessionMode === 'DUE_REVIEW' ? 'Repaso Diario' : sessionMode === 'LEARN_NEW' ? 'Aprender Nuevos' : 'Estudio Libre'}
                </span>
                <span>
                  {initialQueueSize - sessionQueue.length} / {initialQueueSize} completados
                </span>
              </div>
            </div>

            {/* Flashcard Frame */}
            <div className="bg-surface-container-lowest shadow-lg border-2 border-surface-container-high rounded-3xl p-16 flex flex-col items-center w-full max-w-2xl min-h-[440px] justify-center relative overflow-hidden">
              {/* Level Badge */}
              <div className="absolute top-6 left-6 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
                {currentKanji.level}
              </div>

              {/* Visual Stroke Grid Background */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.03] pointer-events-none">
                <div className="border-r border-b border-on-surface"></div>
                <div className="border-b border-on-surface"></div>
                <div className="border-r border-on-surface"></div>
                <div></div>
              </div>

              {/* Kanji Card display */}
              <div className="z-10 flex flex-col items-center">
                <h2 className="text-[9rem] font-light leading-none select-none text-on-surface mb-8 tracking-tighter">
                  {currentKanji.kanji}
                </h2>
              </div>

              {/* Revealed Answer Panel */}
              <div className="w-full h-32 flex items-center justify-center z-10">
                <AnimatePresence mode="wait">
                  {showAnswer ? (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center space-y-3"
                    >
                      <p className="text-3xl font-extrabold tracking-tight text-primary">{currentKanji.romaji}</p>
                      <p className="text-xl text-on-surface font-semibold">{currentKanji.meaning}</p>
                      <div className="flex gap-6 justify-center text-xs font-bold tracking-wider text-on-surface-variant uppercase bg-surface-container-low px-4 py-2 rounded-full">
                        <span>Onyomi: {currentKanji.onyomi}</span>
                        <span>Kunyomi: {currentKanji.kunyomi || '-'}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="hidden" exit={{ opacity: 0 }} className="h-full" />
                  )}
                </AnimatePresence>
              </div>

              {/* Interactive Grading Controls */}
              <div className="mt-12 w-full z-10">
                <AnimatePresence mode="wait">
                  {!showAnswer ? (
                    <motion.button
                      key="btn-reveal"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAnswer(true)}
                      className="w-full bg-primary text-on-primary py-4.5 rounded-full font-bold hover:scale-[1.01] transition-transform shadow-md text-base"
                    >
                      Mostrar respuesta
                    </motion.button>
                  ) : (
                    <motion.div
                      key="btn-srs"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 w-full"
                    >
                      {/* Quality 1: No lo sé */}
                      <button
                        onClick={() => handleRating(1)}
                        className="flex-1 bg-red-500/10 border-2 border-red-500/20 hover:bg-red-500/20 text-red-700 py-4.5 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <X size={16} />
                        <span>No lo sé</span>
                      </button>

                      {/* Quality 3: Difícil */}
                      <button
                        onClick={() => handleRating(3)}
                        className="flex-1 bg-amber-500/10 border-2 border-amber-500/20 hover:bg-amber-500/20 text-amber-700 py-4.5 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Brain size={16} />
                        <span>Difícil</span>
                      </button>

                      {/* Quality 5: Fácil */}
                      <button
                        onClick={() => handleRating(5)}
                        className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 py-4.5 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                      >
                        <Check size={16} />
                        <span>Fácil</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
