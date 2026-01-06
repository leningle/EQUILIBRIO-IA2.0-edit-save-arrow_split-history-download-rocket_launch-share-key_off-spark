
import React, { useState } from 'react';
import { NIETZSCHE_LAWS } from '../constants';
import { Target, Zap, Flame, Mountain, TreeDeciduous, Swords, HandMetal, Hammer, Compass, CheckCircle2, ShieldCheck, Lock, Unlock } from 'lucide-react';

interface MethodPosterProps {
  purpose?: string;
  form?: string;
  notes?: string;
  activityLog?: string[];
  activeLawId?: string;
  onUpdate?: (data: { personalPurpose: string; personalForm: string; ironNotes: string; ironActivityLog: string[], activeLawId?: string }) => void;
}

const MethodPoster: React.FC<MethodPosterProps> = ({ purpose = '', form = '', notes = '', activityLog = [], activeLawId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPurpose, setTempPurpose] = useState(purpose);
  const [tempForm, setTempForm] = useState(form);
  const [tempNotes, setTempNotes] = useState(notes);
  const [selectedLawId, setSelectedLawId] = useState<string | undefined>(activeLawId);

  const todayStr = new Date().toISOString().split('T')[0];
  const isActiveToday = activityLog.includes(todayStr);

  const getIcon = (name: string) => {
      switch(name) {
          case 'Compass': return Compass;
          case 'Hammer': return Hammer;
          case 'Mountain': return Mountain;
          case 'TreeDeciduous': return TreeDeciduous;
          case 'Flame': return Flame;
          case 'Swords': return Swords;
          case 'HandMetal': return HandMetal;
          default: return Zap;
      }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ 
          personalPurpose: tempPurpose, 
          personalForm: tempForm, 
          ironNotes: tempNotes,
          ironActivityLog: activityLog,
          activeLawId: selectedLawId
      });
    }
    setIsEditing(false);
  };

  const toggleTodayActivation = () => {
      let newLog = [...activityLog];
      if (isActiveToday) {
          newLog = newLog.filter(d => d !== todayStr);
      } else {
          newLog.push(todayStr);
      }
      if (onUpdate) {
          onUpdate({ 
              personalPurpose: purpose, 
              personalForm: form, 
              ironNotes: notes,
              ironActivityLog: newLog,
              activeLawId
          });
      }
  };

  return (
    <div className="bg-[#e5e5e5] text-slate-900 p-4 md:p-8 rounded-[3rem] shadow-2xl border-4 border-slate-900 font-sans relative overflow-hidden animate-in zoom-in-95 duration-500 max-w-5xl mx-auto pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

      <div className="relative z-10">
        
        {/* HEADER: FORJA */}
        <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2 text-slate-900 leading-none">FORJA.</h1>
            <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm md:text-base">El martillo está en tus manos</p>
            <div className="w-24 h-2 bg-rose-600 mx-auto mt-6"></div>
        </div>

        {/* SECTION 1: THE 7 LAWS (SELECTOR) */}
        <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Hammer className="w-8 h-8 text-rose-600" />
                ELIGE TU ARMA (30 DÍAS)
            </h2>
            <p className="text-slate-500 font-bold mb-8 max-w-2xl">
                Nietzsche no ofrece consuelo. Ofrece un martillo. Elige <span className="text-rose-600">UNA</span> ley que te desafíe y comprométete a aplicarla.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {NIETZSCHE_LAWS.map((law) => {
                    const Icon = getIcon(law.iconName);
                    const isSelected = selectedLawId === law.id;
                    return (
                        <button
                            key={law.id}
                            onClick={() => isEditing && setSelectedLawId(law.id)}
                            disabled={!isEditing}
                            className={`
                                relative p-6 rounded-2xl text-left transition-all duration-300 group overflow-hidden
                                ${isSelected 
                                    ? 'bg-slate-900 text-white shadow-2xl scale-[1.02] ring-4 ring-rose-500' 
                                    : 'bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900'}
                                ${!isEditing && !isSelected ? 'opacity-50 grayscale' : 'opacity-100'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Icon className={`w-8 h-8 ${isSelected ? 'text-rose-500' : 'text-slate-900'}`} />
                                {isSelected && <CheckCircle2 className="w-6 h-6 text-rose-500" />}
                            </div>
                            <h3 className="font-black text-lg uppercase tracking-tight mb-1">{law.title}</h3>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isSelected ? 'text-rose-400' : 'text-rose-600'}`}>{law.subtitle}</p>
                            <p className={`text-sm leading-relaxed ${isSelected ? 'text-slate-400' : 'text-slate-600'}`}>
                                {law.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* SECTION 2: PURPOSE & FORM (Customizable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-slate-900" />
                    <h3 className="font-black uppercase text-xl">Tu Voluntad (Propósito)</h3>
                </div>
                {isEditing ? (
                    <textarea 
                        value={tempPurpose}
                        onChange={(e) => setTempPurpose(e.target.value)}
                        placeholder="Define tu 'Para qué' supremo..."
                        className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-lg font-bold outline-none focus:border-rose-500"
                        rows={4}
                    />
                ) : (
                    <p className="text-2xl font-black text-slate-800 italic leading-tight">
                        {purpose || "Define tu propósito para no ser esclavo del azar."}
                    </p>
                )}
            </div>

            <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-slate-900" />
                    <h3 className="font-black uppercase text-xl">Tu Escultura (Acción)</h3>
                </div>
                {isEditing ? (
                    <textarea 
                        value={tempForm}
                        onChange={(e) => setTempForm(e.target.value)}
                        placeholder="¿Qué hábitos tallan tu carácter?"
                        className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-lg font-bold outline-none focus:border-rose-500"
                        rows={4}
                    />
                ) : (
                    <p className="text-2xl font-black text-slate-800 italic leading-tight">
                        {form || "La acción crea la chispa. Esculpe tu día."}
                    </p>
                )}
            </div>
        </div>

        {/* SECTION 3: DAILY COMMITMENT */}
        <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden text-center mb-8">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10 flex flex-col items-center">
                 <ShieldCheck className="w-16 h-16 text-rose-500 mb-6" />
                 <h3 className="text-3xl font-black uppercase mb-2">Compromiso de Sangre</h3>
                 <p className="text-slate-400 mb-8 max-w-md">
                     La constancia no es una opción. Es la única diferencia entre el esclavo y el creador.
                 </p>
                 
                 <button 
                    onClick={toggleTodayActivation}
                    className={`
                        px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform
                        ${isActiveToday 
                            ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
                            : 'bg-white text-slate-900 hover:bg-rose-500 hover:text-white'}
                    `}
                >
                    {isActiveToday ? "PACTO SELLADO HOY" : "SELLAR PACTO DEL DÍA"}
                </button>
            </div>
        </div>

        {/* EDIT CONTROLS */}
        <div className="fixed bottom-24 right-6 md:right-12 z-50">
            {isEditing ? (
                <button 
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center border-4 border-white"
                >
                    <Lock className="w-8 h-8" />
                </button>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center border-4 border-white"
                >
                    <Unlock className="w-8 h-8" />
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default MethodPoster;
