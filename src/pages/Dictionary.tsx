import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { n5KanjiData } from '../data/n5';
import { n4KanjiData } from '../data/n4';
import { KanjiEntry } from '../types/kanji';

export const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'ALL'>('ALL');
  const [selectedKanji, setSelectedKanji] = useState<KanjiEntry | null>(null);

  const filteredKanji = useMemo(() => {
    let baseData: KanjiEntry[] = [];
    if (selectedLevel === 'N5') baseData = n5KanjiData;
    else if (selectedLevel === 'N4') baseData = n4KanjiData;
    else baseData = [...n5KanjiData, ...n4KanjiData];

    if (!searchQuery.trim()) return baseData;

    const query = searchQuery.toLowerCase();
    return baseData.filter((entry) =>
      entry.kanji.includes(query) ||
      entry.romaji.toLowerCase().includes(query) ||
      entry.meaning.toLowerCase().includes(query) ||
      entry.onyomi.toLowerCase().includes(query) ||
      entry.kunyomi.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedLevel]);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Diccionario JLPT</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedLevel('ALL')}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedLevel === 'ALL' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedLevel('N5')}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedLevel === 'N5' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
        >
          N5
        </button>
        <button
          onClick={() => setSelectedLevel('N4')}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedLevel === 'N4' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
        >
          N4
        </button>
      </div>

      <div className="relative mb-10 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar kanji, romaji o significado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-container-lowest border-2 border-surface-container-low rounded-full py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-lg"
        />
      </div>

      <ul className="space-y-4 max-w-2xl">
        {filteredKanji.map((entry) => (
          <li
            key={entry.kanji}
            onClick={() => setSelectedKanji(entry)}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex justify-between items-center hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-6">
              <span className="text-4xl font-light w-12 text-center">{entry.kanji}</span>
              <div>
                <p className="text-xl font-semibold">{entry.romaji}</p>
                <p className="text-on-surface-variant">{entry.meaning}</p>
                <div className="text-xs text-on-surface-variant/70 mt-1 flex gap-3">
                  <span>ON: {entry.onyomi}</span>
                  <span>KUN: {entry.kunyomi}</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant whitespace-nowrap">
              {entry.level}
            </div>
          </li>
        ))}
        {filteredKanji.length === 0 && (
          <div className="text-center text-on-surface-variant py-8">
            No se encontraron resultados para "{searchQuery}"
          </div>
        )}
      </ul>

      {selectedKanji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedKanji(null)}>
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="text-8xl font-light mb-4 select-none">{selectedKanji.kanji}</div>
              <p className="text-2xl font-bold">{selectedKanji.meaning}</p>
              <p className="text-on-surface-variant">Romaji: {selectedKanji.romaji}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-container-low p-4 rounded-xl">
                <span className="text-xs font-bold text-primary tracking-widest uppercase opacity-60 block mb-1">Onyomi</span>
                <p className="font-semibold text-lg">{selectedKanji.onyomi}</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl">
                <span className="text-xs font-bold text-primary tracking-widest uppercase opacity-60 block mb-1">Kunyomi</span>
                <p className="font-semibold text-lg">{selectedKanji.kunyomi || '-'}</p>
              </div>
            </div>

            {selectedKanji.examples && selectedKanji.examples.length > 0 && (
              <div>
                <h4 className="font-bold text-lg mb-4">Ejemplos de Vocabulario</h4>
                <div className="space-y-3">
                  {selectedKanji.examples.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center bg-surface-container-lowest border border-surface-container-low p-3 rounded-lg">
                      <div>
                        <p className="font-bold text-lg">{ex.word}</p>
                        <p className="text-xs text-on-surface-variant">{ex.reading}</p>
                      </div>
                      <span className="text-sm text-right max-w-[50%]">{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
