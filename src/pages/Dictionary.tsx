import React from 'react';
import { Search } from 'lucide-react';

export const Dictionary = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Diccionario</h2>

      <div className="relative mb-10 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar kanji, romaji o significado..."
          className="w-full bg-surface-container-lowest border-2 border-surface-container-low rounded-full py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-lg"
        />
      </div>

      <ul className="space-y-4 max-w-2xl">
        <li className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex justify-between items-center hover:bg-surface-container-low transition-colors cursor-pointer">
          <div className="flex items-center space-x-6">
            <span className="text-4xl font-light">猫</span>
            <div>
              <p className="text-xl font-semibold">ねこ (Neko)</p>
              <p className="text-on-surface-variant">Gato</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant">
            Sustantivo
          </div>
        </li>
        <li className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex justify-between items-center hover:bg-surface-container-low transition-colors cursor-pointer">
          <div className="flex items-center space-x-6">
            <span className="text-4xl font-light">水</span>
            <div>
              <p className="text-xl font-semibold">みず (Mizu)</p>
              <p className="text-on-surface-variant">Agua</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant">
            Sustantivo
          </div>
        </li>
      </ul>
    </div>
  );
};
