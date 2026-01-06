
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DailyStats, Routine, TimeBlock, DailyEvaluation, Goal, AppSettings } from '../types';
import { NIETZSCHE_LAWS } from '../constants';
import { 
  Briefcase, Heart, Coffee, Sun, CheckCircle2, Clock, Sparkles, BellRing, 
  RotateCcw, Home, XCircle, Mic, Wind, Brain, Calendar, Play, List, 
  ArrowRight, ShieldCheck, Activity, Zap, Plus, Minus, Volume2, Square,
  Layers, PlusCircle, Hammer, Droplets
} from 'lucide-react';
import Almanac from './Almanac';

interface DashboardProps {
    stats: DailyStats[]; 
    currentRoutine?: Routine;
    userAvatar?: string;
    mentorAvatar?: string;
    evaluations?: DailyEvaluation[];
    goals?: Goal[];
    settings: AppSettings;
    onOpenChat: () => void;
    onUpdateBlock: (blockId: string, updates: Partial<TimeBlock>) => void;
    onShiftBlock: (blockId: string, minutes: number) => void;
    onEmergencyTalk?: () => void;
    onUpdateChain: (date: string) => void;
    onShowMethod: () => void;
    onToggleMovement: () => void;
    onAddExtraTask?: (task: string) => void;
    onDrinkWater?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    currentRoutine, settings,
    onUpdateBlock, onShiftBlock, onEmergencyTalk, onUpdateChain, onShowMethod, onToggleMovement,
    onAddExtraTask, onDrinkWater
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [recordingBlockId, setRecordingBlockId] = useState<string | null>(null);
    const [extraTaskInput, setExtraTaskInput] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); 
        return () => clearInterval(timer);
    }, []);

    const activeLaw = useMemo(() => {
        return NIETZSCHE_LAWS.find(l => l.id === settings.activeLawId);
    }, [settings.activeLawId]);

    const sortedBlocks = useMemo(() => {
        if (!currentRoutine) return [];
        return [...currentRoutine.blocks].sort((a, b) => a.time.localeCompare(b.time));
    }, [currentRoutine]);

    const currentActivityBlock = useMemo(() => {
        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        return sortedBlocks.find((block, index) => {
            const [bh, bm] = block.time.split(':').map(Number);
            const start = bh * 60 + bm;
            let end = start + 60;
            if (index < sortedBlocks.length - 1) {
                const [nh, nm] = sortedBlocks[index + 1].time.split(':').map(Number);
                end = nh * 60 + nm;
            }
            return nowMinutes >= start && nowMinutes < end;
        });
    }, [sortedBlocks, currentTime]);

    const waterStatus = useMemo(() => {
        if (!settings.lastWaterTimestamp) return { label: 'Beber ahora', style: 'text-slate-400 border-white/5 bg-slate-800' };
        
        const minsSince = (currentTime.getTime() - settings.lastWaterTimestamp) / 60000;
        const interval = settings.waterReminderInterval || 60;
        
        if (minsSince < interval * 0.5) return { label: 'Hidratado', style: 'text-teal-400 bg-teal-500/10 border-teal-500/30' };
        if (minsSince < interval) return { label: 'Nivel Estable', style: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
        return { label: '¡Necesitas Agua!', style: 'text-rose-400 bg-rose-500/10 border-rose-500/50 animate-pulse' };
   }, [currentTime, settings.lastWaterTimestamp, settings.waterReminderInterval]);

    const handleAddExtra = () => {
        if (extraTaskInput.trim() && onAddExtraTask) {
            onAddExtraTask(extraTaskInput);
            setExtraTaskInput('');
        }
    };

    // Audio Recording Logic
    const startTaskRecording = async (id: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    onUpdateBlock(id, { audioNote: reader.result as string });
                    setRecordingBlockId(null);
                };
            };
            recorder.start();
            setRecordingBlockId(id);
        } catch (e) { alert("Error al acceder al micro"); }
    };

    const stopTaskRecording = () => {
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };

    const playAudio = (url: string) => {
        const audio = new Audio(url);
        audio.volume = settings.appVolume || 0.5;
        audio.play();
    };

    const guideMessage = useMemo(() => {
        if (!currentActivityBlock) return "Es un momento de transición. Respira.";
        switch(currentActivityBlock.type) {
            case 'work': return "MODO FOCO. Nada te detiene ahora.";
            case 'sacred': return "ESTO ES SAGRADO. Recarga tu espíritu.";
            case 'personal': return "CUIDADO PERSONAL. Sé amable contigo.";
            case 'chore': return "LIMPIEZA Y ORDEN. Despeja tu espacio.";
            default: return "SIGUE EL PLAN. Un paso a la vez.";
        }
    }, [currentActivityBlock]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            
            {/* 1. GUÍA SUPERIOR DYNAMIC (NIETZSCHEAN HEADER) */}
            <div className="relative overflow-hidden bg-slate-900 border-2 border-rose-900/50 p-8 rounded-[3rem] shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                {/* Active Law Banner */}
                {activeLaw && (
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2 text-rose-500 font-black uppercase text-[10px] tracking-widest mb-1">
                            <Hammer className="w-4 h-4" /> TU ARMA ACTUAL
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">{activeLaw.title}</h3>
                        <p className="text-slate-400 text-sm font-medium italic mt-1">{activeLaw.subtitle}</p>
                    </div>
                )}

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-teal-400 font-black text-xs uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                           <Zap className="w-4 h-4" /> ESTADO DE LA FORJA
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-2">
                           {guideMessage}
                        </h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                           {currentActivityBlock ? `Yunque Actual: ${currentActivityBlock.activity}` : "En espera de la próxima forja"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onDrinkWater}
                            className={`px-6 py-5 rounded-[2rem] border font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 ${waterStatus.style}`}
                        >
                            <Droplets className="w-5 h-5" />
                            <span className="hidden md:inline">{waterStatus.label}</span>
                        </button>

                        <button 
                            onClick={onToggleMovement}
                            className={`
                                px-6 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3
                                ${settings.isMovementActive 
                                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 animate-pulse' 
                                    : 'bg-slate-800 text-slate-400 border border-white/5'}
                            `}
                        >
                            <Activity className={`w-5 h-5 ${settings.isMovementActive ? 'animate-bounce' : ''}`} />
                            <span className="hidden md:inline">{settings.isMovementActive ? "Sensor" : "Activar"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Almanac chain={settings.unbreakableChain || []} onToggleDate={onUpdateChain} />
                </div>
                
                <button 
                    onClick={onShowMethod}
                    className="bg-slate-900 border-4 border-amber-500/20 rounded-[3rem] p-8 text-left flex flex-col justify-between hover:border-amber-500/50 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck className="w-32 h-32 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white leading-none uppercase mb-2">La Forja</h3>
                        <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">7 Leyes del Poder</p>
                    </div>
                    <div className="flex items-center gap-3 text-amber-500 mt-12">
                        <span className="font-black text-sm uppercase group-hover:translate-x-1 transition-transform tracking-tighter">
                            {activeLaw ? "Consultar Ley" : "Elegir Arma"}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </button>
            </div>

            {/* 3. AGENDA ACTIVA */}
            <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-white/5 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <Calendar className="w-10 h-10 text-teal-400" /> Mi Ruta Diaria
                    </h2>
                    
                    {/* Input rápido de tarea extra */}
                    <div className="flex bg-slate-900/50 rounded-[2rem] p-2 border border-white/10 w-full md:w-auto">
                        <input 
                            value={extraTaskInput}
                            onChange={(e) => setExtraTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddExtra()}
                            placeholder="Añadir tarea extra..."
                            className="bg-transparent border-none outline-none px-6 py-2 text-sm font-bold text-white w-full md:w-48"
                        />
                        <button 
                            onClick={handleAddExtra}
                            className="p-3 bg-teal-500 text-slate-950 rounded-full hover:scale-105 active:scale-95 transition-all"
                        >
                            <PlusCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {sortedBlocks.map((block) => {
                        const isCurrent = currentActivityBlock?.id === block.id;
                        return (
                            <div 
                                key={block.id}
                                className={`
                                    relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2.5rem] border-4 transition-all
                                    ${isCurrent ? 'border-teal-500 bg-teal-500/10 scale-[1.02] shadow-[0_0_50px_rgba(20,184,166,0.15)]' : 'border-white/5 bg-white/5'}
                                    ${block.status === 'completed' ? 'opacity-30 grayscale' : ''}
                                `}
                            >
                                {/* TIME CONTROLS */}
                                <div className="flex flex-col items-center min-w-[120px]">
                                    <button onClick={() => onShiftBlock(block.id, -15)} className="p-1 text-slate-600 hover:text-teal-400 opacity-50 hover:opacity-100"><Plus className="w-4 h-4 rotate-45"/></button>
                                    <div className="text-4xl font-black font-mono text-teal-400 tracking-tighter">
                                        {block.time}
                                    </div>
                                    <button onClick={() => onShiftBlock(block.id, 15)} className="p-1 text-slate-600 hover:text-teal-400 opacity-50 hover:opacity-100"><Plus className="w-4 h-4"/></button>
                                </div>
                                
                                <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
                                    <div className={`p-6 rounded-[2rem] ${
                                        isCurrent 
                                            ? 'bg-teal-500 text-slate-950 shadow-xl' 
                                            : block.isExtra 
                                                ? 'bg-amber-500/20 text-amber-500 shadow-lg border border-amber-500/20'
                                                : 'bg-slate-800 text-slate-500 shadow-sm'
                                    }`}>
                                        {block.isExtra ? <Zap className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex items-center gap-2 justify-center md:justify-start">
                                            {block.isExtra ? (
                                                <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">Extra</span>
                                            ) : (
                                                <span className="text-[9px] font-black bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-md uppercase tracking-tighter">Rutina</span>
                                            )}
                                        </div>
                                        <h3 className={`text-2xl font-black leading-tight uppercase tracking-tighter ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                                            {block.activity}
                                        </h3>
                                        <div className="flex items-center gap-3 justify-center md:justify-start mt-2">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 bg-slate-800/50 rounded-full border border-white/5">
                                                {block.type}
                                            </span>
                                            {block.audioNote && (
                                                <button onClick={() => playAudio(block.audioNote!)} className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                                    <Volume2 className="w-3 h-3" /> Escuchar Nota
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full md:w-auto">
                                    <button 
                                        onClick={() => recordingBlockId === block.id ? stopTaskRecording() : startTaskRecording(block.id)}
                                        className={`p-5 rounded-2xl transition-all ${recordingBlockId === block.id ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        {recordingBlockId === block.id ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                    </button>

                                    {block.status === 'pending' && (
                                        <button 
                                            onClick={() => onUpdateBlock(block.id, { status: 'completed' })}
                                            className="flex-1 md:flex-none px-8 py-5 rounded-[1.5rem] bg-teal-500 text-slate-950 font-black shadow-lg transition-all active:scale-95"
                                        >
                                            LISTO
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
