
import React, { useState } from 'react';
import { Routine, TimeBlock, RoutineType } from '../types';
import { Clock, Briefcase, Heart, Coffee, Sun, Plus, Trash2, Home, CheckCircle2, Star, PlusCircle, Edit3, Bell, BellOff } from 'lucide-react';

interface RoutineManagerProps {
  routines: Record<string, Routine>;
  currentRoutineId: string;
  onRoutineChange: (routineId: string) => void;
  onUpdateRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
}

const RoutineManager: React.FC<RoutineManagerProps> = ({ routines, currentRoutineId, onRoutineChange, onUpdateRoutine, onDeleteRoutine }) => {
  const [isEditing, setIsEditing] = useState(false);
  const routine = routines[currentRoutineId];

  const getIcon = (type: string) => {
    switch (type) {
      case 'work': return <Briefcase className="w-5 h-5" />;
      case 'sacred': return <Heart className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'chore': return <Home className="w-5 h-5" />;
      default: return <Sun className="w-5 h-5" />;
    }
  };

  const addBlock = () => {
    const newBlock: TimeBlock = {
        id: 'b_' + Date.now(),
        time: '09:00',
        activity: 'Nueva Actividad',
        type: 'personal',
        status: 'pending',
        alarmEnabled: false
    };
    onUpdateRoutine({ ...routine, blocks: [...routine.blocks, newBlock] });
  };

  const updateBlockTime = (id: string, time: string) => {
    const newBlocks = routine.blocks.map(b => b.id === id ? { ...b, time } : b).sort((a,b) => a.time.localeCompare(b.time));
    onUpdateRoutine({ ...routine, blocks: newBlocks });
  };

  const updateBlockActivity = (id: string, activity: string) => {
    const newBlocks = routine.blocks.map(b => b.id === id ? { ...b, activity } : b);
    onUpdateRoutine({ ...routine, blocks: newBlocks });
  };

  const toggleBlockAlarm = (id: string) => {
    const newBlocks = routine.blocks.map(b => b.id === id ? { ...b, alarmEnabled: !b.alarmEnabled } : b);
    onUpdateRoutine({ ...routine, blocks: newBlocks });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* SELECTOR PANEL */}
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-black text-white flex items-center gap-4">
                <Clock className="w-10 h-10 text-teal-400" /> Mis Horarios
            </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.values(routines) as Routine[]).map(r => (
                <button
                    key={r.id}
                    onClick={() => onRoutineChange(r.id)}
                    className={`
                        p-8 rounded-[2.5rem] text-left border-4 transition-all relative overflow-hidden group
                        ${currentRoutineId === r.id 
                            ? 'border-teal-500 bg-teal-500/10 scale-[1.02]' 
                            : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'}
                    `}
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{r.name}</h3>
                            <p className="text-sm text-slate-500 mt-2 font-bold italic">{r.description}</p>
                        </div>
                        {currentRoutineId === r.id ? (
                            <CheckCircle2 className="w-8 h-8 text-teal-400" />
                        ) : (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteRoutine(r.id); }}
                                className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* BLOCKS LIST */}
      {routine && (
          <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 shadow-xl border border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                  <div className="text-center md:text-left">
                      {isEditing ? (
                          <input 
                              value={routine.name}
                              onChange={(e) => onUpdateRoutine({...routine, name: e.target.value})}
                              className="text-4xl font-black text-white bg-transparent border-b-4 border-teal-500 outline-none uppercase tracking-tighter w-full"
                          />
                      ) : (
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{routine.name}</h3>
                      )}
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-10 py-5 rounded-[2rem] font-black transition-all flex items-center gap-3 ${isEditing ? 'bg-teal-500 text-slate-950 shadow-xl' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                      {isEditing ? <CheckCircle2 className="w-6 h-6"/> : <Edit3 className="w-6 h-6"/>}
                      {isEditing ? "Guardar" : "Modificar Tareas"}
                  </button>
              </div>

              <div className="space-y-6">
                  {routine.blocks.map((block) => (
                      <div key={block.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-teal-500/30 transition-colors">
                          <div className="flex flex-col items-center min-w-[140px]">
                              {isEditing ? (
                                  <input 
                                      type="time" 
                                      value={block.time}
                                      onChange={(e) => updateBlockTime(block.id, e.target.value)}
                                      className="text-4xl font-black font-mono text-teal-400 bg-transparent border-none outline-none w-[160px] text-center"
                                  />
                              ) : (
                                  <div className="text-4xl font-black font-mono text-teal-400 text-center">{block.time}</div>
                              )}
                              
                              {isEditing ? (
                                  <button
                                    onClick={() => toggleBlockAlarm(block.id)}
                                    className={`mt-2 p-2 rounded-full border transition-all ${
                                        block.alarmEnabled 
                                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' 
                                        : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                                    }`}
                                    title={block.alarmEnabled ? "Desactivar Alarma" : "Activar Alarma"}
                                  >
                                      {block.alarmEnabled ? <Bell className="w-4 h-4 fill-current" /> : <BellOff className="w-4 h-4" />}
                                  </button>
                              ) : (
                                  block.alarmEnabled && (
                                      <div className="flex items-center gap-1 mt-1 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                                          <Bell className="w-3 h-3 text-amber-500 fill-current" />
                                          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Alarma</span>
                                      </div>
                                  )
                              )}
                          </div>
                          
                          <div className={`p-5 rounded-2xl bg-slate-800 text-slate-500`}>
                              {getIcon(block.type)}
                          </div>
                          
                          <div className="flex-1 w-full">
                              {isEditing ? (
                                  <input 
                                      value={block.activity}
                                      onChange={(e) => updateBlockActivity(block.id, e.target.value)}
                                      className="w-full bg-slate-800 border-none outline-none rounded-xl px-6 py-4 text-xl font-black text-white"
                                  />
                              ) : (
                                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{block.activity}</h4>
                              )}
                          </div>

                          {isEditing && (
                              <button 
                                onClick={() => onUpdateRoutine({...routine, blocks: routine.blocks.filter(b => b.id !== block.id)})}
                                className="p-5 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-inner"
                              >
                                  <Trash2 className="w-7 h-7" />
                              </button>
                          )}
                      </div>
                  ))}
                  
                  {isEditing && (
                      <button 
                        onClick={addBlock}
                        className="w-full py-10 border-4 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black flex items-center justify-center gap-4 hover:border-teal-500/50 hover:text-teal-500 transition-all active:scale-[0.98]"
                      >
                          <Plus className="w-10 h-10" /> AÑADIR NUEVA TAREA
                      </button>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default RoutineManager;
