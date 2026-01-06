
import React, { useState, useEffect, useCallback } from 'react';
import { Routine, RoutineType, Goal, AppSettings, TimeBlock, DailyEvaluation } from '../types';
import { ROUTINES } from '../constants';
import RoutineManager from './RoutineManager';
import ChatInterface from './ChatInterface';
import LiveAssistant from './LiveAssistant';
import Dashboard from './Dashboard';
import GoalPlanner from './GoalPlanner';
import Settings from './Settings';
import EvaluationSystem from './EvaluationSystem'; 
import SplashScreen from './SplashScreen'; 
import SimpleOnboarding from './SimpleOnboarding';
import MethodPoster from './MethodPoster';
import MeditationCenter from './MeditationCenter';
import SocialRoom from './SocialRoom'; 
import { 
  LayoutDashboard, Calendar, MessageSquare, Mic, Menu, X, 
  Target, Settings as SettingsIcon, LogOut, Sparkles, ClipboardCheck, ScrollText,
  PlusCircle, Wind, Home, Users
} from 'lucide-react';

const APP_BG = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=2072&auto=format&fit=crop";

const App: React.FC = () => {
  const [auth, setAuth] = useState<{ isAuthenticated: boolean; userName: string }>({
      isAuthenticated: false,
      userName: ''
  });
  
  const [currentView, setCurrentView] = useState<'splash' | 'onboarding' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'room' | 'routine' | 'chat' | 'live' | 'goals' | 'method' | 'settings' | 'evaluation' | 'meditation'>('dashboard');
  
  const [currentRoutineId, setCurrentRoutineId] = useState<string>(() => {
    return localStorage.getItem('equilibrio_current_routine_id') || RoutineType.MORNING_PRODUCTIVE;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'info' | 'warning' | 'success', action?: { label: string, onClick: () => void }} | null>(null);

  const [customRoutines, setCustomRoutines] = useState<Record<string, Routine>>(() => {
    let initial = { ...ROUTINES };
    const saved = localStorage.getItem('equilibrio_routines');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            initial = { ...initial, ...parsed };
        } catch (e) {
            console.error("Error loading routines", e);
        }
    }
    return initial;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
     const saved = localStorage.getItem('equilibrio_goals');
     if (saved) {
         try { return JSON.parse(saved); } catch(e) {}
     }
     return [];
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('equilibrio_settings');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    // INITIALIZE WITH DEFAULT VALUES
    return {
      vitaminDTime: '10:00',
      vitaminDEnabled: true,
      theme: 'dark',
      accentColor: '#14b8a6', // teal-500
      primaryColor: '#0f172a', // slate-900
      backgroundColor: APP_BG,
      textColor: '#f1f5f9', // slate-100
      textSize: 'md',
      fontFamily: 'sans-serif',
      appVolume: 0.5,
      lastInteractionTimestamp: Date.now(),
      unbreakableChain: [],
      waterReminderEnabled: true,
      waterReminderInterval: 60,
      lastWaterTimestamp: Date.now(),
      isMovementActive: false,
      movementLog: [],
      activeLawId: undefined,
      growthPercentage: 0,
      
      // Extended Profile Defaults
      profile: {
          username: '',
          avatarName: '',
          status: 'Explorando el equilibrio',
          privacy: 'private',
          email: '',
          phone: '',
          name: '',
          avatar: '',
          profilePic: '',
          location: '',
          birthDate: '',
          gender: '',
          sexualOrientation: '',
          race: '',
          religion: '',
          politics: '',
          education: '',
          occupation: '',
          salary: '',
          maritalStatus: '',
          children: 0,
          pets: 0,
          cars: 0, houses: 0, apartments: 0, bikes: 0, motorcycles: 0, boats: 0, airplanes: 0, yachts: 0,
          mansions: 0, estates: 0, islands: 0, countries: 0, cities: 0, towns: 0, villages: 0, continents: 0,
          planets: 0, galaxies: 0, universes: 0, dimensions: 0, realms: 0,
          planes: {
              astral: 0, etheric: 0, mental: 0, spiritual: 0, divine: 0, celestial: 0, infernal: 0, demonic: 0, angelic: 0,
              human: 0, animal: 0, vegetable: 0, mineral: 0, elemental: 0,
              energy: 0, matter: 0, information: 0, consciousness: 0, existence: 0, reality: 0, dream: 0, imagination: 0, memory: 0,
              thought: 0, feeling: 0, will: 0, action: 0, reaction: 0, causality: 0,
              time: 0, space: 0, dimensions_metric: 0,
              forces: 0, laws: 0, principles: 0, concepts: 0, ideas: 0, symbols: 0, meaning: 0, data: 0,
              communication: 0, interaction: 0, relation: 0, connection: 0, network: 0, system: 0, structure: 0, organization: 0,
              management: 0, control: 0, supervision: 0, direction: 0, leadership: 0, authority: 0, power: 0,
              influence: 0, persuasion: 0, manipulation: 0, coercion: 0, threat: 0, blackmail: 0, extortion: 0,
              violence: 0, aggression: 0, conflict: 0, war: 0, destruction: 0, chaos: 0, disorder: 0, anarchy: 0,
              nihilism: 0, despair: 0, fear: 0, hate: 0, envy: 0, greed: 0, lust: 0, ira: 0, sloth: 0, gluttony: 0, pride: 0, vanity: 0,
              selfishness: 0, narcissism: 0, sadism: 0, masochism: 0, fetishism: 0, paraphilias: 0, perversions: 0,
              vices: 0, addictions: 0, diseases: 0, ailments: 0, sufferings: 0, agony: 0, death: 0, nothingness: 0
          }
      },
      
      // Room Data Defaults
      room: {
          name: "Santuario de Poder",
          rules: ["Respeto absoluto", "Solo verdad", "Sin quejas"],
          bulletinBoard: [],
          dailyOptions: Array(15).fill(null).map((_, i) => ({ id: `opt_${i}`, text: `Opción de Poder ${i+1}`, completed: false })),
          photos: [],
          videos: [],
          albums: [],
          members: []
      },
      language: 'es',
      privacyMode: false,
      notificationsEnabled: true
    };
  });

  const [dailyEvaluations, setDailyEvaluations] = useState<DailyEvaluation[]>(() => {
    const saved = localStorage.getItem('equilibrio_evaluations');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  useEffect(() => {
      const savedUser = localStorage.getItem('equilibrio_user');
      if (savedUser) {
          try {
              const parsed = JSON.parse(savedUser);
              if (parsed && parsed.name) {
                  setAuth({ isAuthenticated: true, userName: parsed.name });
                  setCurrentView('app');
              }
          } catch(e) {
              console.error("Session load error", e);
          }
      }
  }, []);

  useEffect(() => {
      localStorage.setItem('equilibrio_routines', JSON.stringify(customRoutines));
      localStorage.setItem('equilibrio_settings', JSON.stringify(appSettings));
      localStorage.setItem('equilibrio_evaluations', JSON.stringify(dailyEvaluations));
      localStorage.setItem('equilibrio_goals', JSON.stringify(goals));
      localStorage.setItem('equilibrio_current_routine_id', currentRoutineId);
  }, [customRoutines, appSettings, dailyEvaluations, goals, currentRoutineId]);

  // --- HYDRATION LOGIC ---
  const handleDrinkWater = useCallback(() => {
    setAppSettings(prev => ({
      ...prev,
      lastWaterTimestamp: Date.now()
    }));
    setToast({ message: "Hidratación registrada. Tu mente fluye.", type: 'success' });
  }, []);

  useEffect(() => {
    if (!appSettings.waterReminderEnabled) return;

    const checkHydration = () => {
        const last = appSettings.lastWaterTimestamp || 0;
        const intervalMs = appSettings.waterReminderInterval * 60 * 1000;
        
        if (Date.now() - last > intervalMs) {
             setToast(prev => {
                if (prev && prev.message.includes("agua")) return prev;
                return {
                    message: "💧 Alerta: Tu cuerpo requiere agua para mantener el poder.",
                    type: 'info',
                    action: { label: "Beber Ahora", onClick: handleDrinkWater }
                };
             });
        }
    };

    const timer = setInterval(checkHydration, 60000); 
    checkHydration();
    return () => clearInterval(timer);
  }, [appSettings.waterReminderEnabled, appSettings.waterReminderInterval, appSettings.lastWaterTimestamp, handleDrinkWater]);
  // -----------------------

  const handleUpdateBlock = (blockId: string, updates: Partial<TimeBlock>) => {
      const routine = customRoutines[currentRoutineId];
      if (!routine) return;
      const newBlocks = routine.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
      setCustomRoutines(prev => ({
          ...prev,
          [currentRoutineId]: { ...routine, blocks: newBlocks }
      }));
  };

  const handleShiftBlock = (blockId: string, minutes: number) => {
      const routine = customRoutines[currentRoutineId];
      if (!routine) return;
      const newBlocks = routine.blocks.map(b => {
          if (b.id === blockId) {
              const [h, m] = b.time.split(':').map(Number);
              const date = new Date();
              date.setHours(h);
              date.setMinutes(m + minutes);
              return { ...b, time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` };
          }
          return b;
      }).sort((a, b) => a.time.localeCompare(b.time));
      
      setCustomRoutines(prev => ({
          ...prev,
          [currentRoutineId]: { ...routine, blocks: newBlocks }
      }));
  };

  const handleAddExtraTask = (activity: string) => {
    const routine = customRoutines[currentRoutineId];
    if (!routine) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newBlock: TimeBlock = {
      id: 'extra_' + Date.now(),
      time,
      activity,
      type: 'work',
      status: 'pending',
      isExtra: true
    };
    setCustomRoutines(prev => ({
      ...prev,
      [currentRoutineId]: { ...routine, blocks: [...routine.blocks, newBlock] }
    }));
    setToast({ message: "Tarea extra añadida", type: 'success' });
  };

  const handleToggleChain = (date: string) => {
    setAppSettings(prev => {
      const chain = prev.unbreakableChain || [];
      const newChain = chain.includes(date)
        ? chain.filter(d => d !== date)
        : [...chain, date];
      return { ...prev, unbreakableChain: newChain };
    });
  };

  const createNewRoutine = () => {
      const id = 'custom_' + Date.now();
      const newRoutine: Routine = {
          id,
          name: "Nueva Rutina",
          description: "Personaliza tu horario desde cero.",
          blocks: [
              { id: 'b1', time: '08:00', activity: 'Nueva Tarea', type: 'personal', status: 'pending' }
          ]
      };
      setCustomRoutines(prev => ({ ...prev, [id]: newRoutine }));
      setCurrentRoutineId(id);
      setActiveTab('routine');
      setToast({ message: "Nueva rutina creada", type: 'success' });
  };

  const toggleMovementSensor = () => {
      const newState = !appSettings.isMovementActive;
      setAppSettings(prev => ({
          ...prev,
          isMovementActive: newState,
          movementLog: [...(prev.movementLog || []), { timestamp: Date.now(), active: newState }]
      }));
      setToast({ 
          message: newState ? "Sensor de actividad ACTIVADO" : "Sensor de actividad PAUSADO", 
          type: newState ? 'success' : 'info' 
      });
  };

  const getAccentClass = (type: 'text' | 'bg' | 'border') => {
      // Simplified for dynamic colors, but keeping structure for existing components
      if (type === 'text') return `text-[${appSettings.accentColor}]`;
      if (type === 'bg') return `bg-[${appSettings.accentColor}]`;
      if (type === 'border') return `border-[${appSettings.accentColor}]`;
      return '';
  };

  if (currentView === 'splash') return <SplashScreen onAuthenticated={(n, nu) => { setAuth({isAuthenticated: true, userName: n}); setCurrentView(nu ? 'onboarding' : 'app'); }} />;
  if (currentView === 'onboarding') return <SimpleOnboarding initialName={auth.userName} onComplete={(d) => { 
      const newUser = { name: d.name, goal: d.mainGoal, password: '' };
      localStorage.setItem('equilibrio_user', JSON.stringify(newUser));
      setAuth({isAuthenticated: true, userName: d.name}); 
      setCurrentRoutineId(d.routinePreference);
      if (d.avatar) setAppSettings({...appSettings, userAvatar: d.avatar, profile: {...appSettings.profile, username: d.name}});
      setCurrentView('app'); 
  }} />;

  const NavButton = ({ tab, icon: Icon, label, color }: { tab: any, icon: any, label: string, color?: string }) => (
    <button 
        onClick={() => {setActiveTab(tab); setMobileMenuOpen(false);}} 
        className={`w-full flex items-center gap-4 p-3 rounded-2xl font-black transition-all text-sm ${activeTab === tab ? `bg-white/10 text-white scale-105 shadow-lg` : 'text-slate-400 hover:bg-white/5'}`}
        style={{ backgroundColor: activeTab === tab ? appSettings.accentColor : 'transparent', color: activeTab === tab ? '#000' : undefined }}
    >
        <Icon className={`w-5 h-5 ${activeTab === tab ? 'text-black' : color || 'text-slate-400'}`} /> 
        <span className="uppercase tracking-tighter">{label}</span>
    </button>
  );

  const BottomNavItem = ({ tab, icon: Icon, label, onClick }: { tab: any, icon: any, label: string, onClick?: () => void }) => {
    const isActive = activeTab === tab;
    return (
        <button 
            onClick={onClick || (() => setActiveTab(tab))}
            className={`flex flex-col items-center justify-center w-full gap-1 transition-all ${isActive ? '-translate-y-1' : ''}`}
        >
            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/10' : 'bg-transparent'}`} style={{ backgroundColor: isActive ? appSettings.accentColor : undefined }}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-slate-500'}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>{label}</span>
        </button>
    );
  };

  const dynamicStyle = {
      fontFamily: appSettings.fontFamily,
      fontSize: appSettings.textSize === 'xs' ? '0.75rem' : appSettings.textSize === 'sm' ? '0.875rem' : appSettings.textSize === 'lg' ? '1.125rem' : '1rem',
  };

  return (
    <div className={`h-[100dvh] flex flex-col md:flex-row relative overflow-hidden bg-cover bg-fixed bg-center`} 
         style={{ ...dynamicStyle, backgroundImage: appSettings.backgroundColor.startsWith('#') ? 'none' : `url(${appSettings.backgroundColor})`, backgroundColor: appSettings.backgroundColor }}>
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0"></div>

      {/* SIDEBAR */}
      <aside className={`
          fixed inset-0 z-50 w-72 p-6 transition-transform duration-300 glass-panel border-r border-white/5 shadow-2xl
          md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col bg-slate-950/80
      `}>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8 flex flex-col items-center text-center mt-6 md:mt-0">
              <div className={`w-20 h-20 rounded-3xl p-1 shadow-2xl mb-4`} style={{backgroundColor: appSettings.accentColor}}>
                  <div className="w-full h-full rounded-[1.2rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                      {appSettings.userAvatar ? <img src={appSettings.userAvatar} className="w-full h-full object-cover" /> : <div className="text-3xl font-black text-white">{auth.userName.charAt(0)}</div>}
                  </div>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">{appSettings.profile.username || auth.userName}</h2>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${appSettings.growthPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">Crecimiento: {appSettings.growthPercentage}%</p>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-3">Tu Mundo</div>
              <NavButton tab="dashboard" icon={LayoutDashboard} label="Inicio" />
              <NavButton tab="room" icon={Home} label="Mi Habitación" color="text-amber-400" />
              <NavButton tab="routine" icon={Calendar} label="Horarios" />
              <NavButton tab="meditation" icon={Wind} label="Calma IA" color="text-teal-400" />
              
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6 mb-2 px-3">Acciones</div>
              <button onClick={createNewRoutine} className="w-full flex items-center gap-4 p-3 rounded-2xl font-black text-sm text-teal-400 hover:bg-teal-400/10 transition-all uppercase tracking-tighter">
                  <PlusCircle className="w-5 h-5" /> Nueva Rutina
              </button>
              
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6 mb-2 px-3">Conexión</div>
              <NavButton tab="chat" icon={MessageSquare} label="Chat Mentor" color="text-teal-400" />
              <NavButton tab="live" icon={Mic} label="Terapia Voz" color="text-rose-400" />
              
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6 mb-2 px-3">Legado</div>
              <NavButton tab="method" icon={ScrollText} label="La Forja" color="text-amber-400" />
              <NavButton tab="goals" icon={Target} label="Conquistas" color="text-indigo-400" />
              <NavButton tab="evaluation" icon={ClipboardCheck} label="Evolución" color="text-emerald-400" />
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-1">
            <NavButton tab="settings" icon={SettingsIcon} label="Ajustes de Cuenta" />
            <button onClick={() => {
                localStorage.removeItem('equilibrio_user');
                window.location.reload();
            }} className="w-full flex items-center gap-4 p-3 text-rose-500 font-black hover:bg-rose-500/10 rounded-2xl transition-all text-sm uppercase tracking-tighter">
                <LogOut className="w-5 h-5" /> CERRAR SESIÓN
            </button>
          </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10 p-4 pb-32 md:p-8 md:pb-8 scroll-smooth">
          <div className="max-w-5xl mx-auto">
              {activeTab === 'dashboard' && (
                  <Dashboard 
                    stats={[]} 
                    currentRoutine={customRoutines[currentRoutineId]} 
                    userAvatar={appSettings.userAvatar}
                    mentorAvatar={appSettings.mentorAvatar}
                    evaluations={dailyEvaluations}
                    settings={appSettings}
                    onOpenChat={() => setActiveTab('chat')}
                    onUpdateBlock={handleUpdateBlock}
                    onShiftBlock={handleShiftBlock}
                    onEmergencyTalk={() => setActiveTab('live')}
                    onUpdateChain={handleToggleChain}
                    onShowMethod={() => setActiveTab('method')}
                    onToggleMovement={toggleMovementSensor}
                    onAddExtraTask={handleAddExtraTask}
                    onDrinkWater={handleDrinkWater}
                  />
              )}
              {activeTab === 'room' && (
                  <SocialRoom 
                    roomData={appSettings.room}
                    onUpdateRoom={(updatedRoom) => setAppSettings({ ...appSettings, room: updatedRoom })}
                    userName={appSettings.profile.username || auth.userName}
                  />
              )}
              {activeTab === 'routine' && (
                <RoutineManager 
                  routines={customRoutines}
                  currentRoutineId={currentRoutineId} 
                  onRoutineChange={setCurrentRoutineId} 
                  onUpdateRoutine={(r) => setCustomRoutines({...customRoutines, [r.id]: r})}
                  onDeleteRoutine={(id) => { const n = {...customRoutines}; delete n[id]; setCustomRoutines(n); }}
                />
              )}
              {activeTab === 'chat' && (
                <ChatInterface 
                    onInteraction={() => setAppSettings({
                        ...appSettings, 
                        lastInteractionTimestamp: Date.now(),
                        growthPercentage: Math.min(100, (appSettings.growthPercentage || 0) + 1)
                    })} 
                />
              )}
              {activeTab === 'meditation' && <MeditationCenter />}
              {activeTab === 'goals' && (
                <GoalPlanner 
                    goals={goals} 
                    onAddGoal={g => setGoals([...goals, g])} 
                    onToggleGoal={id => setGoals(goals.map(g => g.id === id ? {...g, completed: !g.completed} : g))} 
                    onDeleteGoal={id => setGoals(goals.filter(g => g.id !== id))} 
                />
              )}
              {activeTab === 'live' && <LiveAssistant onInteraction={() => setAppSettings({...appSettings, lastInteractionTimestamp: Date.now()})} />}
              {activeTab === 'method' && (
                <MethodPoster 
                  purpose={appSettings.personalPurpose} 
                  form={appSettings.personalForm}
                  notes={appSettings.ironNotes}
                  activityLog={appSettings.ironActivityLog || []}
                  activeLawId={appSettings.activeLawId}
                  onUpdate={(data) => setAppSettings({ ...appSettings, ...data })}
                />
              )}
              {activeTab === 'settings' && <Settings settings={appSettings} onUpdateSettings={setAppSettings} />}
              {activeTab === 'evaluation' && <EvaluationSystem evaluations={dailyEvaluations} onSaveEvaluation={e => setDailyEvaluations([e, ...dailyEvaluations])} />}
          </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 pb-6 pt-3 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center max-w-sm mx-auto">
              <BottomNavItem tab="dashboard" icon={LayoutDashboard} label="Inicio" />
              <BottomNavItem tab="room" icon={Home} label="Habitación" />
              <BottomNavItem tab="chat" icon={MessageSquare} label="Chat" />
              <BottomNavItem tab="settings" icon={SettingsIcon} label="Perfil" />
              <BottomNavItem tab="menu" icon={Menu} label="Menú" onClick={() => setMobileMenuOpen(true)} />
          </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-950 border-2 border-white/20 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 backdrop-blur-xl max-w-[90vw]">
            <Sparkles className={`w-6 h-6 text-[${appSettings.accentColor}]`} />
            <div className="flex-1">
                <span className="font-black uppercase tracking-tight block text-sm">{toast.message}</span>
            </div>
            {toast.action && (
                <button 
                    onClick={() => {
                        toast.action?.onClick();
                        setToast(null);
                    }} 
                    className="ml-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors"
                >
                    {toast.action.label}
                </button>
            )}
            <button onClick={() => setToast(null)} className="ml-4 opacity-50"><X /></button>
        </div>
      )}
    </div>
  );
};

export default App;