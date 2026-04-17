import React from 'react';
import { Bell, Award } from 'lucide-react';

export const Header = () => (
  <header className="flex justify-between items-center mb-16">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Bienvenido, Alex</h2>
      <p className="text-on-surface-variant mt-1">Tu camino hacia la fluidez continúa hoy.</p>
    </div>
    <div className="flex items-center space-x-6">
      <div className="relative p-2 hover:bg-surface-container-low rounded-full cursor-pointer transition-colors">
        <Bell size={24} className="text-on-surface-variant" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
      </div>
      <div className="p-2 hover:bg-surface-container-low rounded-full cursor-pointer transition-colors">
        <Award size={24} className="text-on-surface-variant" />
      </div>
      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-surface-container-high">
        <img
          src="https://picsum.photos/seed/alex/100/100"
          alt="Profile"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);
