import React from 'react';
import {
  BookOpen,
  Dumbbell,
  Languages,
  BarChart3,
  Settings,
  LogOut,
  Leaf
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active = false, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 py-4 px-6 rounded-full transition-all duration-300 active:scale-[0.97] ${
      active
        ? 'text-primary font-bold bg-primary/5'
        : 'text-on-surface-variant font-medium hover:bg-primary/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => (
  <aside className="h-screen w-72 rounded-r-xl sticky top-0 left-0 bg-surface shadow-[40px_0_40px_rgba(0,0,0,0.02)] flex flex-col py-12 px-8 space-y-8 z-40">
    <div className="flex items-center space-x-3 px-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary">
        <Leaf size={20} />
      </div>
      <h1 className="text-2xl font-bold text-primary">Digital Engawa</h1>
    </div>

    <nav className="flex flex-col space-y-2 pt-4 flex-grow">
      <NavItem icon={<BookOpen size={20} />} label="Lecciones" active={currentPage === 'lessons'} onClick={() => onNavigate('lessons')} />
      <NavItem icon={<Dumbbell size={20} />} label="Práctica" active={currentPage === 'practice'} onClick={() => onNavigate('practice')} />
      <NavItem icon={<Languages size={20} />} label="Diccionario" active={currentPage === 'dictionary'} onClick={() => onNavigate('dictionary')} />
      <NavItem icon={<BarChart3 size={20} />} label="Progreso" active={currentPage === 'progress'} onClick={() => onNavigate('progress')} />
    </nav>

    <div className="flex flex-col space-y-2">
      <div className="p-5 bg-surface-container-low rounded-lg mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src="https://picsum.photos/seed/user1/100/100"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="text-sm font-bold">Nivel N3</p>
            <p className="text-xs text-on-surface-variant">Progresando</p>
          </div>
        </div>
        <button className="w-full bg-primary text-on-primary py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
          Estudiar ahora
        </button>
      </div>
      <NavItem icon={<Settings size={20} />} label="Ajustes" onClick={() => {}} />
      <NavItem icon={<LogOut size={20} />} label="Cerrar sesión" onClick={() => {}} />
    </div>
  </aside>
);
