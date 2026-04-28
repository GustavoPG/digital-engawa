import React, { useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { gojuonData, KanaEntry } from '../data/kana';

export const Syllabary = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaEntry | null>(null);

  const playAudio = (romaji: string) => {
    if (!romaji) return;
    const utterance = new SpeechSynthesisUtterance(romaji);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="pb-12">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Silabarios (Kana)</h2>
        <div className="bg-surface-container-low p-1 rounded-full flex">
          <button
            onClick={() => setActiveTab('hiragana')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'hiragana' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setActiveTab('katakana')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'katakana' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Katakana
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-5 gap-4">
          {gojuonData.map((entry, index) => {
            const char = activeTab === 'hiragana' ? entry.hiragana : entry.katakana;
            if (!char) {
              return <div key={`empty-${index}`} className="aspect-square"></div>;
            }
            return (
              <button
                key={`${char}-${index}`}
                onClick={() => setSelectedKana(entry)}
                className="aspect-square flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-4xl font-light mb-2">{char}</span>
                <span className="text-sm font-semibold text-on-surface-variant">{entry.romaji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal / Detail View */}
      {selectedKana && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-surface-container-high">
              <h3 className="text-xl font-bold tracking-tight">Detalle del Kana</h3>
              <button
                onClick={() => setSelectedKana(null)}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-12 flex flex-col items-center">
              <div className="relative w-48 h-48 border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center mb-8 bg-primary/5">
                 {/* Representación visual para el orden de trazos */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="border-r border-b border-primary/10"></div>
                  <div className="border-b border-primary/10"></div>
                  <div className="border-r border-primary/10"></div>
                  <div></div>
                </div>
                <span className="text-[8rem] font-light z-10 select-none text-primary">
                  {activeTab === 'hiragana' ? selectedKana.hiragana : selectedKana.katakana}
                </span>
              </div>

              <p className="text-3xl font-bold mb-8">{selectedKana.romaji}</p>

              <button
                onClick={() => playAudio(selectedKana.romaji)}
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                <Volume2 size={24} />
                <span>Reproducir Sonido</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
