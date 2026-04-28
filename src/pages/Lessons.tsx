import React from 'react';
import { BookOpen } from 'lucide-react';

interface LessonsProps {
  onNavigate: (page: string) => void;
}

export const Lessons = ({ onNavigate }: LessonsProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Lecciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="bg-surface-container-low rounded-lg p-8 hover:bg-surface-container-high transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary-container/30 text-primary rounded-2xl">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold">Hiragana y Katakana Básico</h3>
          </div>
          <p className="text-on-surface-variant mb-6">
            Aprende y practica los caracteres básicos de los silabarios japoneses, con sonido y guías de escritura.
          </p>
          <button
            onClick={() => onNavigate('syllabary')}
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Comenzar
          </button>
        </div>

        <div className="bg-surface-container-low rounded-lg p-8 hover:bg-surface-container-high transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary-container/30 text-primary rounded-2xl">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold">Vocabulario N5</h3>
          </div>
          <p className="text-on-surface-variant mb-6">
            Palabras esenciales para comenzar tu viaje y prepararte para el JLPT N5.
          </p>
          <button
            onClick={() => onNavigate('practice')}
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
};
