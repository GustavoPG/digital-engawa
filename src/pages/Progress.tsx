import React from 'react';
import { Flame, Layers, Clock, Zap } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const Progress = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Tu Progreso Detallado</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        <StatCard
          icon={<Flame size={24} />}
          value="14"
          label="Racha de días"
          subValue="+2 hoy"
          iconBg="bg-error-container/20"
          iconColor="text-error"
        />
        <StatCard
          icon={<Layers size={24} />}
          value="284"
          label="Kanjis aprendidos"
          subValue="N3: 45%"
          iconBg="bg-primary-container/30"
          iconColor="text-primary"
        />
        <StatCard
          icon={<Clock size={24} />}
          value="12.5h"
          label="Tiempo de estudio"
          subValue="Avg 45m"
          iconBg="bg-surface-container-high"
          iconColor="text-on-surface-variant"
        />
        <StatCard
          icon={<Zap size={24} />}
          value="92%"
          label="Precisión"
          subValue="↑ 4%"
          iconBg="bg-primary-container/20"
          iconColor="text-primary"
        />
      </div>

      <h3 className="text-2xl font-bold tracking-tight mb-6">Actividad Reciente</h3>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-surface-container-high">
          <li className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div>
                <p className="font-semibold">Completaste la lección "Hiragana Básico"</p>
                <p className="text-sm text-on-surface-variant">Hace 2 horas</p>
              </div>
            </div>
            <span className="font-bold text-primary">+50 XP</span>
          </li>
          <li className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div>
                <p className="font-semibold">Practicaste 20 flashcards de Kanji</p>
                <p className="text-sm text-on-surface-variant">Ayer</p>
              </div>
            </div>
            <span className="font-bold text-primary">+30 XP</span>
          </li>
          <li className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-on-surface-variant/30 rounded-full"></div>
              <div>
                <p className="font-semibold">Buscaste "Gato" en el diccionario</p>
                <p className="text-sm text-on-surface-variant">Ayer</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
