import React from 'react';
import { 
  BookOpen, 
  Dumbbell, 
  Languages, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Award, 
  Play, 
  Volume2, 
  ArrowRight, 
  Flame, 
  Layers, 
  Clock, 
  Zap,
  Plus,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';

const Sidebar = () => (
  <aside className="h-screen w-72 rounded-r-xl sticky top-0 left-0 bg-surface shadow-[40px_0_40px_rgba(0,0,0,0.02)] flex flex-col py-12 px-8 space-y-8 z-40">
    <div className="flex items-center space-x-3 px-2">
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary">
        <Leaf size={20} />
      </div>
      <h1 className="text-2xl font-bold text-primary">Digital Engawa</h1>
    </div>

    <nav className="flex flex-col space-y-2 pt-4 flex-grow">
      <NavItem icon={<BookOpen size={20} />} label="Lecciones" active />
      <NavItem icon={<Dumbbell size={20} />} label="Práctica" />
      <NavItem icon={<Languages size={20} />} label="Diccionario" />
      <NavItem icon={<BarChart3 size={20} />} label="Progreso" />
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
      <NavItem icon={<Settings size={20} />} label="Ajustes" />
      <NavItem icon={<LogOut size={20} />} label="Cerrar sesión" />
    </div>
  </aside>
);

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a 
    href="#" 
    className={`flex items-center space-x-4 py-4 px-6 rounded-full transition-all duration-300 active:scale-[0.97] ${
      active 
        ? 'text-primary font-bold bg-primary/5' 
        : 'text-on-surface-variant font-medium hover:bg-primary/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </a>
);

const StatCard = ({ icon, value, label, subValue, iconBg, iconColor }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-surface-container-low rounded-lg p-8 hover:bg-surface-container-high transition-colors duration-300"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-on-surface-variant/50">{subValue}</span>
    </div>
    <p className="text-4xl font-black mb-1">{value}</p>
    <p className="text-sm font-medium text-on-surface-variant">{label}</p>
  </motion.div>
);

export default function App() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto px-16 py-12">
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

        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-surface-container-lowest rounded-xl p-12 flex flex-col md:flex-row items-center gap-16 shadow-sm"
          >
            {/* Kanji Display */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="text-xs font-bold tracking-[0.2em] text-primary/40 uppercase mb-8">KANJI DEL DÍA</span>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-64 h-64 border border-primary/5 rounded-full animate-[spin_20s_linear_infinite]" />
                <h3 className="kanji-display font-light select-none">永</h3>
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
                <h4 className="text-5xl font-extrabold tracking-tighter mb-2">Eternity</h4>
                <p className="text-lg text-on-surface-variant leading-relaxed max-w-md">
                  Refleja el flujo constante e ininterrumpido del agua, simbolizando lo que no tiene fin.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase opacity-60">Onyomi</span>
                  <p className="text-2xl font-semibold">エイ (Ei)</p>
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase opacity-60">Kunyomi</span>
                  <p className="text-2xl font-semibold">なが.い (Naga-i)</p>
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
          </motion.div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-10">
            <h3 className="text-2xl font-bold tracking-tight">Tu Actividad</h3>
            <button className="text-sm font-bold text-primary hover:underline">Ver reporte detallado</button>
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
      </main>

      {/* FAB */}
      <div className="fixed bottom-12 right-12">
        <button className="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
}
