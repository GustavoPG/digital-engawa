import React, { useRef, useState, useEffect } from 'react';
import { 
  Trash2, 
  Eye, 
  EyeOff, 
  PenTool, 
  HelpCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WritingCanvasProps {
  character: string;
  size?: number;
}

interface Point {
  x: number;
  y: number;
}

interface EvaluationResult {
  score: number;
  feedback: string;
  isPerfect: boolean;
}

export const WritingCanvas = ({ character, size = 250 }: WritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const activeTimeoutRef = useRef<any>(null);

  const [activeTab, setActiveTab] = useState<'canvas' | 'strokes'>('canvas');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Calligraphy data states
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);
  const [userStrokes, setUserStrokes] = useState<Point[][]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Animation states
  const [animationState, setAnimationState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);

  // Helper to determine if a character is a Hiragana or Katakana
  const isKana = (char: string) => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return code >= 12352 && code <= 12543;
  };

  // Build the CDN URL for stroke order diagram
  const getStrokeGuideUrl = (char: string) => {
    if (!char) return '';
    if (isKana(char)) {
      return `https://raw.githubusercontent.com/parsimonhi/animCJK/master/svgsJaKana/${char.charCodeAt(0)}.svg`;
    } else {
      return `https://kan-g.vnaka.dev/c/${char}`;
    }
  };

  // Fetch SVG on mount or character change
  useEffect(() => {
    if (!character) return;
    
    const fetchSvg = async () => {
      setIsLoadingSvg(true);
      setSvgXml(null);
      setUserStrokes([]);
      setEvaluation(null);

      try {
        const url = getStrokeGuideUrl(character);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch SVG");
        const xmlText = await res.text();
        setSvgXml(xmlText);
      } catch (err) {
        console.error("Error fetching stroke guide SVG:", err);
      } finally {
        setIsLoadingSvg(false);
      }
    };

    fetchSvg();
  }, [character]);

  // Clear canvas drawing
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset calligraphy capture states
    setUserStrokes([]);
    setEvaluation(null);
  };

  // Reset drawing when character changes
  useEffect(() => {
    handleClear();
  }, [character]);

  // Unified pointer coordinate extractor
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
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

    if (e.pointerType === 'touch') {
      canvas.style.touchAction = 'none';
    }

    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#136964'; // primary teal
    ctx.stroke();

    setIsDrawing(true);
    
    // Start recording a new stroke
    setUserStrokes(prev => [...prev, [{ x, y }]]);
    
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

    // Record point in the current stroke
    setUserStrokes(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = [...updated[updated.length - 1], { x, y }];
      }
      return updated;
    });
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
    
    canvas.style.touchAction = 'auto';
  };

  // ================= ANIMATION SYSTEM =================

  const resetAnimation = () => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    setAnimationState('idle');
    setCurrentStrokeIndex(0);

    const paths = svgContainerRef.current?.querySelectorAll('path');
    if (paths) {
      paths.forEach((p) => {
        const path = p as SVGPathElement;
        path.style.transition = 'none';
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = 'none';
        path.style.opacity = '1';
        path.style.stroke = '#475569';
        path.style.strokeWidth = '3.5';
      });
    }
  };

  // Sync animation reset with tab mounts and XML changes
  useEffect(() => {
    // Small timeout to let React finish rendering the DOM ref before styling it
    const t = setTimeout(resetAnimation, 30);
    return () => clearTimeout(t);
  }, [svgXml, activeTab]);

  const animateNextStroke = (index: number, paths: SVGPathElement[]) => {
    if (index >= paths.length) {
      setAnimationState('idle');
      setCurrentStrokeIndex(0);
      return;
    }

    setCurrentStrokeIndex(index);
    setAnimationState('playing');

    const path = paths[index];
    let length = path.getTotalLength();
    if (!length || length === 0) {
      length = 250; // robust fallback for unrendered/collapsed paths
    }

    // Prepare path style for animation
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.opacity = '1';
    path.style.stroke = '#136964'; // highlight active stroke in teal
    path.style.strokeWidth = '6';

    // Force reflow
    path.getBoundingClientRect();

    // Trigger transition
    path.style.transition = 'stroke-dashoffset 0.8s linear';
    path.style.strokeDashoffset = '0';

    const handleEnd = () => {
      // Completed style
      path.style.stroke = '#1e293b'; // dark slate
      path.style.strokeWidth = '4';
      animateNextStroke(index + 1, paths);
    };

    activeTimeoutRef.current = setTimeout(handleEnd, 850);
  };

  // Helper to extract active stroke paths (excluding defs and masks)
  const getStrokePaths = (): SVGPathElement[] => {
    const allPaths = svgContainerRef.current?.querySelectorAll('path');
    const filtered: SVGPathElement[] = [];
    
    if (allPaths) {
      allPaths.forEach((p) => {
        const path = p as SVGPathElement;
        // Exclude paths inside definitions or clipPaths
        if (path.closest('defs') || path.closest('clipPath')) {
          return;
        }
        
        // For AnimCJK Kanas, select only the clipping skeleton stroke paths
        if (isKana(character)) {
          if (!path.getAttribute('clip-path')) {
            return;
          }
        }
        
        filtered.push(path);
      });
    }
    return filtered;
  };

  const handlePlay = () => {
    const paths = getStrokePaths();
    if (paths.length === 0) return;

    if (animationState === 'idle') {
      // Prepare all paths by making them semi-transparent guides
      paths.forEach((path) => {
        path.style.transition = 'none';
        path.style.opacity = '0.1'; // Faint reference outline
        path.style.stroke = '#94a3b8';
      });

      animateNextStroke(0, paths);
    } else if (animationState === 'paused') {
      animateNextStroke(currentStrokeIndex, paths);
    }
  };

  const handlePause = () => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    
    // Freeze the current stroke dashoffset
    const paths = getStrokePaths();
    if (paths[currentStrokeIndex]) {
      const path = paths[currentStrokeIndex];
      const computedStyle = window.getComputedStyle(path);
      const currentOffset = computedStyle.strokeDashoffset;
      path.style.transition = 'none';
      path.style.strokeDashoffset = currentOffset;
    }
    
    setAnimationState('paused');
  };

  // ================= CALLIGRAPHY EVALUATION ALGORITHM =================

  const evaluateCalligraphy = () => {
    const paths = getStrokePaths();
    if (paths.length === 0) {
      setEvaluation({
        score: 0,
        feedback: "Error al cargar la plantilla de referencia. Intenta de nuevo.",
        isPerfect: false
      });
      return;
    }

    const templateCount = paths.length;
    const userCount = userStrokes.length;

    if (userCount === 0) {
      setEvaluation({
        score: 0,
        feedback: "Dibuja el carácter en el lienzo antes de evaluarlo.",
        isPerfect: false
      });
      return;
    }

    // Get SVG viewBox to normalize coordinates
    const svgElement = svgContainerRef.current?.querySelector('svg');
    let viewBox = { x: 0, y: 0, width: 109, height: 109 }; // standard KanjiVG default
    if (svgElement) {
      const viewBoxStr = svgElement.getAttribute('viewBox');
      if (viewBoxStr) {
        const parts = viewBoxStr.split(' ').map(Number);
        if (parts.length === 4) {
          viewBox = { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
        }
      }
    }

    // Euclidean distance helper
    const getDistance = (p1: Point, p2: Point) => {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };

    let totalScore = 0;
    let wrongDirectionCount = 0;
    const strokesToCompare = Math.min(templateCount, userCount);

    for (let i = 0; i < strokesToCompare; i++) {
      const path = paths[i];
      const userStroke = userStrokes[i];

      // Sample template points (normalized to 0..1)
      let pathLen = path.getTotalLength();
      if (!pathLen || pathLen === 0) pathLen = 250;
      const tStartRaw = path.getPointAtLength(0);
      const tMidRaw = path.getPointAtLength(pathLen / 2);
      const tEndRaw = path.getPointAtLength(pathLen);

      const tStart = { x: (tStartRaw.x - viewBox.x) / viewBox.width, y: (tStartRaw.y - viewBox.y) / viewBox.height };
      const tMid = { x: (tMidRaw.x - viewBox.x) / viewBox.width, y: (tMidRaw.y - viewBox.y) / viewBox.height };
      const tEnd = { x: (tEndRaw.x - viewBox.x) / viewBox.width, y: (tEndRaw.y - viewBox.y) / viewBox.height };

      // Sample user points (normalized to 0..1 using size)
      const uStart = { x: userStroke[0].x / size, y: userStroke[0].y / size };
      const uMid = { x: userStroke[Math.floor(userStroke.length / 2)].x / size, y: userStroke[Math.floor(userStroke.length / 2)].y / size };
      const uEnd = { x: userStroke[userStroke.length - 1].x / size, y: userStroke[userStroke.length - 1].y / size };

      // Check distance in standard direction
      const dStart = getDistance(tStart, uStart);
      const dMid = getDistance(tMid, uMid);
      const dEnd = getDistance(tEnd, uEnd);
      const avgDist = (dStart + dMid + dEnd) / 3;

      // Check distance in reverse direction (to detect wrong stroke direction)
      const dStartRev = getDistance(tStart, uEnd);
      const dEndRev = getDistance(tEnd, uStart);
      const avgDistRev = (dStartRev + dMid + dEndRev) / 3;

      let strokeScore = Math.max(0, 100 - avgDist * 280);

      // If the reverse drawing is significantly better, they drew it in the wrong direction
      if (avgDistRev < avgDist && (dStartRev < 0.15 && dEndRev < 0.15)) {
        wrongDirectionCount++;
        strokeScore = Math.max(0, strokeScore - 35); // 35% penalty for wrong direction
      }

      totalScore += strokeScore;
    }

    // Average the score of compared strokes
    let finalScore = totalScore / templateCount;

    // Apply strict penalty for stroke count mismatch (12% penalty per extra/missing stroke)
    const countMismatch = Math.abs(templateCount - userCount);
    finalScore = Math.max(0, finalScore - countMismatch * 12);

    finalScore = Math.round(finalScore);

    // Dynamic Feedback in Spanish
    let feedback = "";
    if (finalScore >= 90) {
      feedback = "¡Perfecto! Tu caligrafía es excelente y has seguido el orden y dirección de los trazos de forma impecable. 🌸";
    } else if (finalScore >= 75) {
      feedback = "¡Muy bien! Los trazos son bastante precisos y la estructura general del carácter es sólida. Sigue practicando para perfeccionarlo. ✨";
    } else if (finalScore >= 50) {
      feedback = "Buen intento. Sin embargo, asegúrate de mantener el número correcto de trazos y de dibujarlos en la dirección indicada. ✍️";
    } else {
      feedback = "Sigue practicando. Te sugerimos ir a la pestaña 'Trazos' y reproducir la animación para ver el orden y la dirección correctos de cada línea. 📚";
    }

    // Detailed notifications in feedback
    let detailMsg = [];
    if (userCount !== templateCount) {
      detailMsg.push(`El carácter requiere exactamente ${templateCount} trazos, pero dibujaste ${userCount}.`);
    }
    if (wrongDirectionCount > 0) {
      detailMsg.push(`Detectamos ${wrongDirectionCount} trazo(s) dibujado(s) en la dirección opuesta.`);
    }

    if (detailMsg.length > 0) {
      feedback += "\n\n⚠️ Detalles:\n• " + detailMsg.join("\n• ");
    }

    setEvaluation({
      score: finalScore,
      feedback: feedback,
      isPerfect: finalScore >= 95
    });
  };

  return (
    <div className="flex flex-col items-center select-none" style={{ width: size }}>
      
      {/* Scope-contained Calligraphy Styles */}
      <style>{`
        .kanjivg-svg svg {
          width: 100%;
          height: 100%;
        }
        .kanjivg-svg path {
          stroke: #475569; /* slate 600 */
          stroke-width: 3.5px;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .kanjivg-svg text {
          fill: #136964; /* primary teal */
          font-size: 5px;
          font-family: sans-serif;
          font-weight: bold;
          opacity: 0.65;
        }
      `}</style>

      {/* Sleek Minimal Tab Bar */}
      <div className="flex bg-surface-container-low p-1 rounded-full mb-4 w-full border border-surface-container-high shadow-inner">
        <button
          onClick={() => {
            setActiveTab('canvas');
            resetAnimation();
          }}
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
          onClick={() => {
            setActiveTab('strokes');
            handleClear();
          }}
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
        /* TAB 1: DRAWING CANVAS WITH REAL-TIME EVALUATION */
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
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
          <div className="mt-4 flex flex-col gap-3 w-full">
            <div className="flex gap-3 w-full">
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

            {/* Calligraphy Evaluation Button */}
            <button
              onClick={evaluateCalligraphy}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm"
            >
              <Sparkles size={14} />
              <span>Evaluar Caligrafía</span>
            </button>
          </div>

          {/* Calligraphy Evaluation Modal/Result Card */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 w-full bg-surface-container-low border border-surface-container-high rounded-2xl p-5 shadow-md flex flex-col gap-4 text-left relative overflow-hidden"
              >
                {evaluation.isPerfect && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center -translate-y-8 translate-x-8">
                    <Check size={28} className="text-primary translate-y-3 -translate-x-3 opacity-30 animate-ping" />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant/55 uppercase tracking-wider">RESULTADO</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-2xl font-black ${evaluation.score >= 80 ? 'text-primary' : evaluation.score >= 50 ? 'text-amber-500' : 'text-error'}`}>
                      {evaluation.score}%
                    </span>
                  </div>
                </div>

                <div className="h-[2px] w-full bg-surface-container-high" />

                <div className="flex gap-3">
                  <div className="mt-0.5 text-primary">
                    {evaluation.score >= 75 ? (
                      <Check size={18} className="text-primary bg-primary/10 rounded-full p-0.5" />
                    ) : (
                      <AlertCircle size={18} className="text-amber-500 bg-amber-500/10 rounded-full p-0.5" />
                    )}
                  </div>
                  <p className="text-xs text-on-surface font-medium leading-relaxed whitespace-pre-line">
                    {evaluation.feedback}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* TAB 2: ACTIVE STROKE ANIMATION PLAYER */
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          <div 
            className="relative bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-6"
            style={{ width: size, height: size }}
          >
            {/* Dashed background grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.03] pointer-events-none">
              <div className="border-r-2 border-b-2 border-dashed border-on-surface"></div>
              <div className="border-b-2 border-dashed border-on-surface"></div>
              <div className="border-r-2 border-dashed border-on-surface"></div>
              <div></div>
            </div>

            {isLoadingSvg ? (
              <div className="text-xs text-on-surface-variant/50 animate-pulse font-medium">
                Cargando guía...
              </div>
            ) : svgXml ? (
              /* Inline SVG Container */
              <div 
                ref={svgContainerRef}
                dangerouslySetInnerHTML={{ __html: svgXml }}
                className="kanjivg-svg w-[85%] h-[85%] object-contain z-10"
              />
            ) : (
              <div className="text-xs text-error/60 font-medium">
                No se pudo cargar la guía
              </div>
            )}

            <div className="absolute bottom-3 text-center w-full z-10">
              <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest select-none">
                {isKana(character) ? 'ORDEN ANIMADO (AnimCJK)' : 'ORDEN ANIMADO (KanjiVG)'}
              </span>
            </div>
          </div>

          {/* Animation Controls */}
          {svgXml && (
            <div className="mt-4 flex gap-3 w-full">
              {animationState === 'playing' ? (
                <button
                  onClick={handlePause}
                  className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-surface-container-high"
                >
                  <Pause size={14} />
                  <span>Pausar</span>
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="flex-1 bg-primary hover:bg-primary/95 text-on-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Play size={14} />
                  <span>{animationState === 'paused' ? 'Reanudar' : 'Animar'}</span>
                </button>
              )}

              <button
                onClick={resetAnimation}
                className="bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-surface-container-high"
                title="Reiniciar trazado"
              >
                <RotateCcw size={14} />
                <span>Reiniciar</span>
              </button>
            </div>
          )}

          {/* Calligraphy Help Subtext */}
          <p className="mt-3 text-[11px] text-on-surface-variant text-center leading-relaxed font-medium bg-surface-container-low/30 border border-surface-container-high/40 rounded-xl px-4 py-2.5 w-full">
            {isKana(character) 
              ? 'Haz clic en "Animar" para ver los trazos dibujarse en su orden de colores exacto (primero al último).'
              : 'Haz clic en "Animar" para ver cómo fluye la dirección de las líneas según el número de trazos oficial.'
            }
          </p>
        </div>
      )}
    </div>
  );
};
