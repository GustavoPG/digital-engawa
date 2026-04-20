import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { n5KanjiData } from '../data/n5';

export const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKanji = useMemo(() => {
    if (!searchQuery.trim()) return n5KanjiData;

    const query = searchQuery.toLowerCase();
    return n5KanjiData.filter((entry) =>
      entry.kanji.includes(query) ||
      entry.romaji.toLowerCase().includes(query) ||
      entry.meaning.toLowerCase().includes(query) ||
      entry.onyomi.toLowerCase().includes(query) ||
      entry.kunyomi.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Diccionario JLPT N5</h2>

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
          <li key={entry.kanji} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex justify-between items-center hover:bg-surface-container-low transition-colors cursor-pointer">
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
              Kanji N5
            </div>
          </li>
        ))}
        {filteredKanji.length === 0 && (
          <div className="text-center text-on-surface-variant py-8">
            No se encontraron resultados para "{searchQuery}"
          </div>
        )}
      </ul>
    </div>
  );
};
