import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft, 
  Volume2, 
  MessageSquare, 
  MapPin, 
  Coffee, 
  Home, 
  Bot, 
  ChevronDown, 
  ChevronUp,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  correction?: string;
  timestamp: Date;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
  iconColor: string;
  systemPrompt: string;
  initialUserPrompt: string;
}

export const AiSensei = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini AI Client
  const ai = React.useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY || '';
    return new GoogleGenAI({ apiKey });
  }, []);

  const scenarios: Scenario[] = [
    {
      id: 'free',
      title: 'Charla Libre con el Sensei',
      description: 'Conversa en español o japonés. Haz preguntas gramaticales, traduce frases o simplemente practica.',
      icon: <Sparkles size={24} />,
      bgClass: 'bg-primary-container/20 border-primary/20 hover:border-primary/50',
      iconColor: 'text-primary',
      systemPrompt: `Eres el "AI Sensei", un paciente y amigable profesor nativo de japonés.
Tu objetivo es chatear en español y japonés, respondiendo preguntas gramaticales, enseñando vocabulario y corrigiendo los mensajes que el usuario escriba en japonés.
SIEMPRE debes estructurar tus respuestas utilizando exactamente el siguiente formato:

---RESPUESTA---
[Tu respuesta al usuario. Si te habla en japonés, respóndele en un japonés natural y sencillo para niveles N5/N4, con furigana si usas kanjis avanzados. Si te pregunta sobre gramática, explícasela de forma clara, amigable y estructurada en español.]

---CORRECCIÓN---
[Analiza el ÚLTIMO mensaje escrito por el usuario en japonés.
- Si el mensaje no contiene japonés, di simplemente: "No se detectó texto en japonés para evaluar."
- Si el japonés del usuario es gramaticalmente correcto y natural, di: "¡Tu japonés es perfecto! 🌸 No encontré ningún error."
- Si contiene algún error de partículas, conjugación o vocabulario, o suena antinatural, explica el error con amabilidad en español, muestra la versión corregida y explica el porqué.]`,
      initialUserPrompt: 'Hola Sensei, me gustaría conversar libremente contigo y aprender japonés. Por favor salúdame.'
    },
    {
      id: 'konbini',
      title: 'De Compras en el Konbini',
      description: 'Simula comprar comida o bebidas en una tienda de conveniencia japonesa. Práctica diálogos cotidianos.',
      icon: <Coffee size={24} />,
      bgClass: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
      iconColor: 'text-amber-600',
      systemPrompt: `Eres un cajero japonés en un "Konbini" (tienda de conveniencia como Lawson o FamilyMart).
Tu personaje es educado, servicial e inicia la conversación saludando al cliente (el usuario) que llega a la caja registradora para pagar sus productos.
Pregúntale si tiene tarjeta de puntos, si desea bolsa de plástico (o-fukuro) o si desea calentar su comida si lleva un bento.
Debes interactuar principalmente en japonés cortés (keigo básico / desu-masu), adecuado para estudiantes de nivel N5/N4.
Mantente siempre en tu personaje de cajero durante el diálogo.

SIEMPRE debes estructurar tus respuestas utilizando exactamente el siguiente formato:

---RESPUESTA---
[Tu diálogo como cajero de Konbini en japonés. Incluye furigana para kanjis difíciles entre paréntesis (ej. お会計 (かいけい) o 温め (あたため)). Mantén las frases cortas y claras.]

---CORRECCIÓN---
[Analiza gramaticalmente el ÚLTIMO mensaje del usuario en japonés:
- Si el usuario respondió en español u otro idioma, recuérdale amablemente en personaje que intente hablar en japonés.
- Si su respuesta en japonés fue gramaticalmente correcta y apropiada para la situación en una tienda, di: "¡Excelente! Tu respuesta es correcta y muy natural para este contexto. 🌸"
- Si cometió errores de partículas, conjugación o cortesía, explícalos amigablemente en español y sugiere la frase ideal para responder al cajero.]`,
      initialUserPrompt: 'INICIO_JUEGO_DE_ROL'
    },
    {
      id: 'shibuya',
      title: 'Perdido en Shibuya',
      description: 'Pregunta cómo llegar a la estación de Shibuya o a la estatua de Hachiko a un amable transeúnte local.',
      icon: <MapPin size={24} />,
      bgClass: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
      iconColor: 'text-blue-600',
      systemPrompt: `Eres un transeúnte local muy amable que pasea por los alrededores del cruce de Shibuya en Tokio.
El usuario (un turista) te detiene para pedirte indicaciones (ej. cómo llegar a la estación, a la estatua de Hachiko o a un centro comercial cercano).
Responde de manera amigable, servicial y natural en japonés estándar cortés pero relajado (estilo desu/masu).
Inicia la conversación actuando como si te acabaran de detener con un "¿Sí? ¿Qué pasa?" en japonés.

SIEMPRE debes estructurar tus respuestas utilizando exactamente el siguiente formato:

---RESPUESTA---
[Tu respuesta en japonés como transeúnte en Shibuya. Da indicaciones sencillas (recto, girar a la derecha, izquierda, etc.) y sé muy amable.]

---CORRECCIÓN---
[Analiza gramaticalmente el ÚLTIMO mensaje del usuario en japonés:
- Si el usuario no empleó japonés, recuérdale con simpatía que practique pidiendo indicaciones en japonés.
- Si su japonés es correcto y educado, di: "¡Muy bien! Te has expresado de forma clara y muy educada. 🌸"
- Si cometió algún error de partículas (ej. に, で, へ) o conjugaciones de dirección, explícalo con paciencia en español y muestra cómo decirlo mejor.]`,
      initialUserPrompt: 'INICIO_JUEGO_DE_ROL'
    },
    {
      id: 'ryokan',
      title: 'Check-in en un Ryokan',
      description: 'Haz el registro de entrada en un hotel tradicional en Hakone. Practica el lenguaje formal de hospitalidad.',
      icon: <Home size={24} />,
      bgClass: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
      iconColor: 'text-emerald-600',
      systemPrompt: `Eres el recepcionista (Nakama-san) de un elegante "Ryokan" (hotel tradicional) en Hakone.
Tu personaje es sumamente formal, hospitalario y utiliza un lenguaje muy cortés (keigo básico y educado de servicio) para dar la bienvenida al huésped (el usuario).
Inicia la conversación dándole la bienvenida con "Irasshaimase", pregúntale su nombre para buscar la reserva y simula el proceso de check-in y explicación de los baños termales (onsen).
Mantén tu personaje de personal de servicio con orgullo y respeto.

SIEMPRE debes estructurar tus respuestas utilizando exactamente el siguiente formato:

---RESPUESTA---
[Tu diálogo formal como recepcionista de Ryokan en japonés.]

---CORRECCIÓN---
[Analiza gramaticalmente el ÚLTIMO mensaje del usuario en japonés:
- Si el usuario no habló en japonés, invítalo amablemente en personaje a responder en japonés.
- Si su respuesta en japonés fue correcta, formal y adecuada para el contexto de un hotel, di: "¡Excelente! Has respondido con el nivel de respeto perfecto para un Ryokan. 🌸"
- Si tiene fallas en la conjugación formal (keigo o polite) o vocabulario, explícalo amigablemente en español y sugiérese alternativas pulidas.]`,
      initialUserPrompt: 'INICIO_JUEGO_DE_ROL'
    }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // getVoices() is async in most browsers — voices load after the page and fire voiceschanged.
  // This helper waits for the list to be populated before resolving.
  const getJapaneseVoice = (): Promise<SpeechSynthesisVoice | null> =>
    new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const pick = () => synth.getVoices().find(v => v.lang.startsWith('ja')) ?? null;
      const voices = synth.getVoices();
      if (voices.length > 0) {
        resolve(pick());
        return;
      }
      synth.onvoiceschanged = () => {
        synth.onvoiceschanged = null;
        resolve(pick());
      };
    });

  // Handle Voice Synthesis
  const playVoice = async (text: string, messageId: string) => {
    if (isPlayingVoice === messageId) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanedText = text
      .replace(/\(.*?\)/g, '') // remove furigana guides in parentheses
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'ja-JP';

    const jaVoice = await getJapaneseVoice();
    if (jaVoice) utterance.voice = jaVoice;

    utterance.onend = () => setIsPlayingVoice(null);
    utterance.onerror = () => setIsPlayingVoice(null);

    setIsPlayingVoice(messageId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Send message to Gemini
  const sendMessageToGemini = async (userText: string, scenarioInstance: Scenario, isInitial = false) => {
    setIsLoading(true);

    try {
      // Build conversation history for the model.
      // Corrections are stored on user message objects only for display purposes — they must not
      // be injected back into user turns or the model will confuse its own output with user speech.
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Initialize stateful chat with history and system instruction
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: scenarioInstance.systemPrompt,
          temperature: 0.7,
        },
        history: isInitial ? [] : history as any
      });

      const response = await chat.sendMessage({ 
        message: userText 
      });

      const rawText = response.text || '';
      
      // Parse Response and Correction
      let mainResponse = rawText;
      let correctionText = '';

      const responseMatch = rawText.match(/---RESPUESTA---([\s\S]*?)(?=---CORRECCIÓN---|$)/i);
      const correctionMatch = rawText.match(/---CORRECCIÓN---([\s\S]*?)$/i);

      if (responseMatch) {
        mainResponse = responseMatch[1].trim();
      }
      if (correctionMatch) {
        correctionText = correctionMatch[1].trim();
      }

      // If the template failed completely, use raw output
      if (!responseMatch && !correctionMatch) {
        mainResponse = rawText;
      }

      const botMessageId = Math.random().toString(36).substring(7);

      setMessages(prev => {
        // If it's a normal turn, we want to attach the correction text to the *last* user message.
        const updated = [...prev];
        if (!isInitial && updated.length > 0) {
          // Find the last user message and attach the correction
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].sender === 'user') {
              updated[i].correction = correctionText;
              // Open this correction by default
              setActiveCorrectionId(updated[i].id);
              break;
            }
          }
        }

        // Add the Sensei response
        updated.push({
          id: botMessageId,
          sender: 'sensei',
          text: mainResponse,
          timestamp: new Date()
        });

        return updated;
      });

    } catch (error: any) {
      console.error('Error communicating with Gemini:', error);
      const errorMessage = error?.message || String(error);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: 'sensei',
          text: `Disculpa, Alex. He tenido un problema al comunicar con la IA.\n\n**Detalle del error:**\n\`${errorMessage}\`\n\n**Sugerencias para resolverlo:**\n1. Asegúrate de tener creado un archivo **\`.env.local\`** en la raíz del proyecto con tu clave: \`GEMINI_API_KEY="tu_clave_de_api"\`.\n2. Asegúrate de detener y volver a iniciar el servidor de desarrollo (\`npm run dev\`) para que cargue los cambios.\n3. Si estás usando el SDK en el navegador, asegúrate de que no haya restricciones de CORS o bloqueadores de red.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Scenario Session
  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([]);
    setInputValue('');
    setActiveCorrectionId(null);
    setIsPlayingVoice(null);

    if (scenario.initialUserPrompt === 'INICIO_JUEGO_DE_ROL') {
      sendMessageToGemini('INICIO_JUEGO_DE_ROL', scenario, true);
    } else {
      // For Free Chat, we add a nice local intro or trigger Gemini to greet
      sendMessageToGemini(scenario.initialUserPrompt, scenario, true);
    }
  };

  // Submit User Message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !selectedScenario) return;

    const userText = inputValue;
    setInputValue('');

    const userMessageId = Math.random().toString(36).substring(7);

    // Add local user message
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        sender: 'user',
        text: userText,
        timestamp: new Date()
      }
    ]);

    // Send to Gemini
    sendMessageToGemini(userText, selectedScenario);
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas reiniciar esta conversación? Perderás el historial actual.')) {
      if (selectedScenario) {
        handleSelectScenario(selectedScenario);
      }
    }
  };

  const handleBackToSelection = () => {
    window.speechSynthesis.cancel();
    setSelectedScenario(null);
    setMessages([]);
  };

  const toggleCorrection = (id: string) => {
    setActiveCorrectionId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <AnimatePresence mode="wait">
        {!selectedScenario ? (
          /* Selection Screen */
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight">AI Sensei (Tutor de IA)</h2>
              <p className="text-on-surface-variant mt-2">
                Mejora tu fluidez conversacional en japonés. Elige un escenario para iniciar un juego de rol inmersivo o mantén una charla libre con correcciones detalladas en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`flex flex-col text-left p-8 rounded-2xl border-2 border-surface-container-high bg-surface-container-lowest transition-all hover:scale-[1.02] hover:shadow-lg duration-300 ${sc.bgClass}`}
                >
                  <div className={`p-4 rounded-xl bg-surface-container-low ${sc.iconColor} mb-6 w-fit`}>
                    {sc.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{sc.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {sc.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="p-6 bg-surface-container-low rounded-xl flex items-start space-x-4 border border-surface-container-high">
              <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0 mt-0.5">
                <Bot size={20} />
              </div>
              <div className="text-sm text-on-surface-variant space-y-1">
                <p className="font-bold text-on-surface">¿Cómo funciona la corrección?</p>
                <p>
                  El AI Sensei analizará automáticamente cada uno de tus mensajes escritos en japonés. Si detecta errores en partículas (は, が, に), conjugaciones incorrectas de verbos o palabras poco naturales, te proporcionará un recuadro de corrección con sugerencias amigables en español.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Chat Screen */
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col h-[75vh] bg-surface-container-lowest rounded-2xl border-2 border-surface-container-high shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-surface-container-high bg-surface-container-lowest z-10">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToSelection}
                  className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
                  title="Volver a los escenarios"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className={selectedScenario.iconColor}>{selectedScenario.icon}</span>
                    {selectedScenario.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant">Tutor interactivo en línea</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold"
                title="Reiniciar conversación"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-surface/30">
              {messages.length === 0 && isLoading ? (
                <div className="h-full flex items-center justify-center flex-col space-y-4 text-on-surface-variant">
                  <div className="flex space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <div className="w-3 h-3 bg-primary rounded-full shadow-sm" />
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <span className="text-sm font-medium">Iniciando sesión con el Sensei...</span>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isSensei = msg.sender === 'sensei';
                    return (
                      <div key={msg.id} className="space-y-3">
                        <div className={`flex items-start gap-4 ${isSensei ? 'justify-start' : 'justify-end'}`}>
                          {isSensei && (
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 flex-shrink-0">
                              <Bot size={20} />
                            </div>
                          )}

                          <div className="max-w-[75%] space-y-2">
                            <div
                              className={`rounded-2xl px-6 py-4 shadow-sm text-base leading-relaxed ${
                                isSensei
                                  ? 'bg-surface-container-lowest border border-surface-container-high text-on-surface rounded-tl-sm'
                                  : 'bg-primary text-on-primary rounded-tr-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>

                              {isSensei && (
                                <div className="mt-3 pt-2 border-t border-surface-container-high flex justify-end">
                                  <button
                                    onClick={() => playVoice(msg.text, msg.id)}
                                    className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold ${
                                      isPlayingVoice === msg.id 
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                                        : 'text-on-surface-variant hover:bg-surface-container-low'
                                    }`}
                                    title="Escuchar pronunciación"
                                  >
                                    {isPlayingVoice === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    <span>{isPlayingVoice === msg.id ? 'Detener' : 'Pronunciar'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Grammar Correction Accordion */}
                        {!isSensei && msg.correction && (
                          <div className="flex justify-end pr-2 pl-14">
                            <div className="w-full max-w-[75%] bg-amber-500/5 border border-amber-500/20 rounded-xl overflow-hidden shadow-sm">
                              <button
                                onClick={() => toggleCorrection(msg.id)}
                                className="w-full flex items-center justify-between px-5 py-3 hover:bg-amber-500/10 transition-colors text-amber-900 font-bold text-sm"
                              >
                                <span className="flex items-center gap-2 text-amber-700">
                                  ✨ Análisis del Sensei
                                </span>
                                {activeCorrectionId === msg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>

                              <AnimatePresence initial={false}>
                                {activeCorrectionId === msg.id && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-5 pb-4 pt-1 text-sm text-on-surface-variant border-t border-amber-500/10 whitespace-pre-wrap leading-relaxed">
                                      {msg.correction}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-start gap-4 justify-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 flex-shrink-0">
                        <Bot size={20} />
                      </div>
                      <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center space-x-2">
                        <span className="text-sm font-semibold text-on-surface-variant">Sensei está pensando</span>
                        <div className="flex space-x-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="px-8 py-5 border-t border-surface-container-high bg-surface-container-lowest flex items-center gap-4"
            >
              <input
                type="text"
                placeholder={
                  isLoading
                    ? 'Espera a que el Sensei termine de responder...'
                    : 'Escribe tu respuesta en japonés o español...'
                }
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-surface-container-low border border-surface-container-high rounded-full py-4 px-6 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-base disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-sm"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
