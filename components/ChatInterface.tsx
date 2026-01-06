
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Zap, BrainCircuit, User, X, BarChart, Heart } from 'lucide-react';
import { ModelType, ChatMessage } from '../types';
import { generateTextResponse } from '../services/geminiService';

interface ChatInterfaceProps {
    onInteraction?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onInteraction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<ModelType>(ModelType.FLASH_LITE);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Real-time analysis state
  const [contextAnalysis, setContextAnalysis] = useState<{intent: string, state: string, checkpoint: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (onInteraction) onInteraction();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Enhanced System Instruction
      let promptText = input;
      let systemContext = `Eres un mentor estoico y directo. Tu objetivo es el equilibrio y la fuerza.
      
      MODOS ESPECIALES:
      1. Si el usuario menciona "cita", "romance", "ligar" o "amor", activa MODO WINGMAN: Sé carismático, social, da consejos prácticos y elegantes. Valida su valor.
      2. Si el usuario está triste: MODO FORJA. Transmuta el dolor en fuerza.
      
      ANÁLISIS OBLIGATORIO:
      Al final de tu respuesta, añade un bloque oculto EXACTAMENTE así:
      ||ANALYSIS||{"intent": "...", "state": "...", "checkpoint": "..."}||END||
      
      Donde:
      - intent: Qué busca el usuario (ej: Consejo, Desahogo, Estrategia).
      - state: Estado emocional (ej: Ansioso, Motivado, Confundido).
      - checkpoint: En qué fase de la conversación estamos (ej: Inicio, Profundización, Cierre).
      
      Responde al usuario normalmente antes de este bloque.`;

      const responseText = await generateTextResponse({
        prompt: `${systemContext}\nUsuario: ${promptText}`,
        modelType: model,
        history: history
      });

      // Parse Analysis
      let cleanText = responseText;
      let analysisData = null;
      
      const analysisMatch = responseText.match(/\|\|ANALYSIS\|\|(.*?)\|\|END\|\|/s);
      if (analysisMatch && analysisMatch[1]) {
          try {
              analysisData = JSON.parse(analysisMatch[1]);
              cleanText = responseText.replace(analysisMatch[0], '').trim();
              setContextAnalysis(analysisData);
          } catch (e) {
              console.error("Failed to parse analysis JSON", e);
          }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        isThinking: model === ModelType.THINKING,
        timestamp: Date.now(),
        analysis: analysisData
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Error de conexión. Inténtalo de nuevo.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-slate-950/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="bg-white/5 p-5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500 rounded-xl">
             <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
              <h2 className="font-black text-white uppercase tracking-tighter leading-none">Chat Mentor</h2>
              <p className="text-[10px] text-teal-400 font-bold uppercase">Estado: Conectado</p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`p-2 rounded-xl transition-all ${showAnalysis ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-slate-500'}`}
                title="Análisis de Conversación"
            >
                <BarChart className="w-5 h-5" />
            </button>
            <div className="flex bg-slate-900 rounded-2xl p-1 border border-white/5 shadow-inner">
                <button onClick={() => setModel(ModelType.FLASH_LITE)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${model === ModelType.FLASH_LITE ? 'bg-teal-500 text-slate-950' : 'text-slate-500'}`}>Flash</button>
                <button onClick={() => setModel(ModelType.PRO)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${model === ModelType.PRO ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>Pro</button>
            </div>
        </div>
      </div>

      {/* Analysis Overlay */}
      {showAnalysis && contextAnalysis && (
        <div className="absolute top-20 right-4 z-20 w-64 bg-slate-900/95 backdrop-blur-xl border-l-4 border-amber-500 p-4 rounded-r-xl shadow-2xl animate-in slide-in-from-right-10">
            <h4 className="text-amber-500 font-black uppercase text-xs mb-3 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4"/> Análisis IA
            </h4>
            <div className="space-y-3">
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Intención</span>
                    <span className="text-sm text-white font-medium">{contextAnalysis.intent}</span>
                </div>
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Estado Emocional</span>
                    <span className="text-sm text-white font-medium">{contextAnalysis.state}</span>
                </div>
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Checkpoint</span>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-1">
                        <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                            style={{ 
                                width: contextAnalysis.checkpoint.toLowerCase().includes('inicio') ? '20%' : 
                                       contextAnalysis.checkpoint.toLowerCase().includes('cierre') ? '90%' : '50%' 
                            }}
                        ></div>
                    </div>
                    <span className="text-xs text-amber-400 mt-1 block">{contextAnalysis.checkpoint}</span>
                </div>
            </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-4 opacity-50">
            <Sparkles className="w-16 h-16 animate-pulse" />
            <p className="font-black uppercase tracking-widest text-xs">Escribe lo que necesites ajustar</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-3xl p-5 ${msg.role === 'user' ? 'bg-teal-500 text-slate-950 font-bold rounded-tr-none shadow-xl shadow-teal-500/10' : 'bg-white/10 text-white border border-white/10 rounded-tl-none backdrop-blur-md'}`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-2">
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mensaje rápido..."
            className="flex-1 bg-slate-900 border border-white/5 text-white rounded-[1.5rem] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold placeholder:text-slate-600"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-20 text-slate-950 p-5 rounded-[1.5rem] transition-all shadow-xl active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
