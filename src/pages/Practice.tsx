import React, { useState } from 'react';
import { n5KanjiData } from '../data/n5';

export const Practice = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const kanji = n5KanjiData[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < n5KanjiData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Restart when finished
    }
  };

  if (!kanji) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-3xl font-bold tracking-tight mb-8 self-start w-full">Práctica Diaria</h2>

      <div className="bg-surface-container-lowest shadow-sm rounded-xl p-16 flex flex-col items-center w-full max-w-2xl min-h-[400px] justify-center relative">
        <div className="absolute top-6 right-6 text-sm font-bold text-on-surface-variant/50">
          {currentIndex + 1} / {n5KanjiData.length}
        </div>

        <h2 className="text-8xl font-light mb-8 select-none">{kanji.kanji}</h2>

        {showAnswer ? (
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <p className="text-3xl font-semibold">{kanji.romaji}</p>
            <p className="text-xl text-on-surface-variant">{kanji.meaning}</p>
            <div className="flex gap-4 justify-center text-sm text-on-surface-variant/70 mt-2">
              <span>ON: {kanji.onyomi}</span>
              <span>KUN: {kanji.kunyomi}</span>
            </div>
          </div>
        ) : (
          <div className="h-[124px]"></div>
        )}

        <div className="mt-16 flex gap-4 w-full">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="flex-1 bg-primary text-on-primary py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              Mostrar respuesta
            </button>
          ) : (
            <>
              <button
                onClick={handleNext}
                className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-full font-bold hover:bg-surface-container-highest transition-colors"
              >
                Incorrecto
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-primary text-on-primary py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Correcto
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
