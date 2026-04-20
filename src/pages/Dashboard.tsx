import React, { useState, useEffect } from 'react';
import { Play, Volume2, ArrowRight, Layers, Flame, Clock, Zap, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from '../components/StatCard';
import { n5KanjiData, KanjiEntry } from '../data/n5';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [kanjiDelDia, setKanjiDelDia] = useState<KanjiEntry | null>(null);

  useEffect(() => {
    // Select a random kanji on mount
    const randomIndex = Math.floor(Math.random() * n5KanjiData.length);
    setKanjiDelDia(n5KanjiData[randomIndex]);
  }, []);

  return (
    <>
      <section className="mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-surface-container-lowest rounded-xl p-12 flex flex-col md:flex-row items-center gap-16 shadow-sm min-h-[400px]"
        >
          {kanjiDelDia ? (
            <>
              {/* Kanji Display */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <span className="text-xs font-bold tracking-[0.2em] text-primary/40 uppercase mb-8">KANJI DEL DÍA</span>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-64 h-64 border border-primary/5 rounded-full animate-[spin_20s_linear_infinite]" />
                  <h3 className="kanji-display font-light select-none">{kanjiDelDia.kanji}</h3>
                </div>
                <div className="mt-8 flex gap-4">
                  <button className="p-4 rounded-full bg-surface-container-low text-primary hover:bg-primary/10 transition-colors">
                    <Play size={20} fill="currentColor" />
                  </button>
                  <button className="p-4 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <Volume2 size={20} />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="flex-grow space-y-10">
                <div>
                  <h4 className="text-5xl font-extrabold tracking-tighter mb-2">{kanjiDelDia.meaning}</h4>
                  <p className="text-lg text-on-surface-variant leading-relaxed max-w-md">
                    Romaji: {kanjiDelDia.romaji}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-primary tracking-widest uppercase opacity-60">Onyomi</span>
                    <p className="text-2xl font-semibold">{kanjiDelDia.onyomi}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-primary tracking-widest uppercase opacity-60">Kunyomi</span>
                    <p className="text-2xl font-semibold">{kanjiDelDia.kunyomi}</p>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold flex items-center space-x-3 hover:scale-[1.02] transition-transform">
                    <span>Dominar este Kanji</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Stroke Analysis Placeholder */}
              <div className="hidden lg:block w-72 h-72 rounded-lg bg-surface-container-low relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Layers size={120} />
                </div>
                <img
                  src="https://picsum.photos/seed/ink/400/400?grayscale"
                  alt="Texture"
                  className="w-full h-full object-cover opacity-5"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs font-bold text-on-surface-variant/40">ANÁLISIS DE TRAZOS</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center text-on-surface-variant">Cargando...</div>
          )}
        </motion.div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-10">
          <h3 className="text-2xl font-bold tracking-tight">Tu Actividad</h3>
          <button
            className="text-sm font-bold text-primary hover:underline"
            onClick={() => onNavigate('progress')}
          >
            Ver reporte detallado
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
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
      </section>

      {/* FAB */}
      <div className="fixed bottom-12 right-12">
        <button className="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <Plus size={32} />
        </button>
      </div>
    </>
  );
};
