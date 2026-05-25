import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Eye, EyeOff, PenTool, HelpCircle } from 'lucide-react';

interface WritingCanvasProps {
  character: string;
  size?: number;
}

export const WritingCanvas = ({ character, size = 250 }: WritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'strokes'>('canvas');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Helper to determine if a character is a Hiragana or Katakana
  const isKana = (char: string) => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    // Hiragana (12352 to 12447) & Katakana (12448 to 12543)
    return code >= 12352 && code <= 12543;
  };

  // Build the CDN URL for stroke order diagram
  const getStrokeGuideUrl = (char: string) => {
    if (!char) return '';
    if (isKana(char)) {
      // Use AnimCJK open-source SVGs for Kanas (Hiragana and Katakana)
      return `https://raw.githubusercontent.com/parsimonhi/animCJK/master/svgsJaKana/${char.charCodeAt(0)}.svg`;
    } else {
      // Use KanjiVG SVGs served through Kan-G CDN for Kanjis
      return `https://kan-g.vnaka.dev/c/${char}`;
    }
  };

  // Clear drawing on canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Automatically clear canvas when character changes
  useEffect(() => {
    handleClear();
  }, [character]);

  // Unified pointer coordinate extractor
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale client coordinates to match canvas coordinate system
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  };

  // Start Drawing
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent scrolling on touch screens
    if (e.pointerType === 'touch') {
      canvas.style.touchAction = 'none';
    }

    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#136964'; // primary color
    ctx.stroke();

    setIsDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Continue Drawing
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // End Drawing
  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Restore default touch action
    canvas.style.touchAction = 'auto';
  };

  return (
    <div className="flex flex-col items-center select-none" style={{ width: size }}>
      
      {/* Sleek Minimal Tab Bar */}
      <div className="flex bg-surface-container-low p-1 rounded-full mb-4 w-full border border-surface-container-high shadow-inner">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full font-bold text-xs transition-all active:scale-[0.97] ${
            activeTab === 'canvas' 
              ? 'bg-surface-container-lowest shadow-sm text-primary' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <PenTool size={13} />
          <span>Lienzo</span>
        </button>
        <button
          onClick={() => setActiveTab('strokes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full font-bold text-xs transition-all active:scale-[0.97] ${
            activeTab === 'strokes' 
              ? 'bg-surface-container-lowest shadow-sm text-primary' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <HelpCircle size={13} />
          <span>Trazos</span>
        </button>
      </div>

      {activeTab === 'canvas' ? (
        /* TAB 1: DRAWING CANVAS */
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          {/* Visual Canvas Frame with guide background */}
          <div 
            className="relative bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl overflow-hidden shadow-sm"
            style={{ width: size, height: size }}
          >
            {/* Japanese Writing Grid (Dashed Crossed Lines) */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.08] pointer-events-none">
              <div className="border-r-2 border-b-2 border-dashed border-on-surface"></div>
              <div className="border-b-2 border-dashed border-on-surface"></div>
              <div className="border-r-2 border-dashed border-on-surface"></div>
              <div></div>
            </div>

            {/* Faint Reference Character Guide */}
            {showGuide && (
              <div 
                className="absolute inset-0 flex items-center justify-center text-on-surface-variant/10 font-light select-none pointer-events-none"
                style={{ fontSize: size * 0.65 }}
              >
                {character}
              </div>
            )}

            {/* Interactive Pointer Canvas */}
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
          </div>

          {/* Control Tools */}
          <div className="mt-4 flex gap-3 w-full">
            {/* Clear Button */}
            <button
              onClick={handleClear}
              className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-surface-container-high"
              title="Borrar lienzo"
            >
              <Trash2 size={14} />
              <span>Limpiar</span>
            </button>

            {/* Toggle Guide Button */}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`flex-1 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 border ${
                showGuide 
                  ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
                  : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container-high'
              }`}
              title={showGuide ? "Ocultar guía" : "Mostrar guía"}
            >
              {showGuide ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showGuide ? "Ocultar Guía" : "Mostrar Guía"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* TAB 2: STROKE ORDER DIAGRAM */
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          <div 
            className="relative bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-6"
            style={{ width: size, height: size }}
          >
            {/* Dashed background grid inside the strokes viewer too */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.03] pointer-events-none">
              <div className="border-r-2 border-b-2 border-dashed border-on-surface"></div>
              <div className="border-b-2 border-dashed border-on-surface"></div>
              <div className="border-r-2 border-dashed border-on-surface"></div>
              <div></div>
            </div>

            <img
              src={getStrokeGuideUrl(character)}
              alt={`Orden de trazos para ${character}`}
              className="w-[85%] h-[85%] object-contain pointer-events-none select-none z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            <div className="absolute bottom-3 text-center w-full z-10">
              <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest select-none">
                {isKana(character) ? 'GUÍA COLOREADA (AnimCJK)' : 'TRAZOS NUMERADOS (KanjiVG)'}
              </span>
            </div>
          </div>

          {/* Caligraphy Help Subtext */}
          <p className="mt-3 text-[11px] text-on-surface-variant text-center leading-relaxed font-medium bg-surface-container-low/30 border border-surface-container-high/40 rounded-xl px-4 py-2.5 w-full">
            {isKana(character) 
              ? 'Los colores indican el orden de los trazos (del primero al último). Sigue las curvas para un trazado correcto.'
              : 'Los números pequeños indican el punto de partida y dirección de cada trazo. Sigue el orden numérico.'
            }
          </p>
        </div>
      )}
    </div>
  );
};
