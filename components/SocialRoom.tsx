
import React, { useState, useRef } from 'react';
import { RoomData } from '../types';
import { 
  Home, Edit3, Image as ImageIcon, Users, MessageSquare, Plus, Trash2, 
  CheckCircle2, Circle, Settings, Shield, Globe, Lock, Share2, Download,
  Video, FolderHeart, Pin, LayoutGrid, Camera, Upload, Mic, Play
} from 'lucide-react';

interface SocialRoomProps {
  roomData: RoomData;
  onUpdateRoom: (data: RoomData) => void;
  userName: string;
}

const SocialRoom: React.FC<SocialRoomProps> = ({ roomData, onUpdateRoom, userName }) => {
  const [activeView, setActiveView] = useState<'board' | 'chat' | 'media' | 'rules'>('board');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [newRule, setNewRule] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [simulatedChat, setSimulatedChat] = useState<{user:string, text:string}[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (newName: string) => {
    onUpdateRoom({ ...roomData, name: newName });
  };

  const toggleDailyOption = (id: string) => {
    const newOptions = roomData.dailyOptions.map(opt => 
        opt.id === id ? { ...opt, completed: !opt.completed } : opt
    );
    onUpdateRoom({ ...roomData, dailyOptions: newOptions });
  };

  const updateOptionText = (id: string, text: string) => {
    const newOptions = roomData.dailyOptions.map(opt => 
        opt.id === id ? { ...opt, text } : opt
    );
    onUpdateRoom({ ...roomData, dailyOptions: newOptions });
  };

  const addBulletinPost = () => {
    if (!newPost.trim()) return;
    const newEntry = {
        id: Date.now().toString(),
        text: newPost,
        date: new Date().toLocaleDateString(),
        author: userName
    };
    onUpdateRoom({ ...roomData, bulletinBoard: [newEntry, ...roomData.bulletinBoard] });
    setNewPost('');
  };

  const addRule = () => {
      if (!newRule.trim()) return;
      onUpdateRoom({ ...roomData, rules: [...roomData.rules, newRule] });
      setNewRule('');
  };

  const removeRule = (index: number) => {
      const newRules = [...roomData.rules];
      newRules.splice(index, 1);
      onUpdateRoom({ ...roomData, rules: newRules });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              const base64 = ev.target?.result as string;
              // Limit photos for demo
              const newPhoto = { id: Date.now().toString(), url: base64, date: new Date().toLocaleDateString() };
              onUpdateRoom({ ...roomData, photos: [newPhoto, ...roomData.photos] });
          };
          reader.readAsDataURL(file);
      }
  };

  const deletePhoto = (id: string) => {
      onUpdateRoom({ ...roomData, photos: roomData.photos.filter(p => p.id !== id) });
  };

  const downloadPhoto = (url: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'equilibrio-photo.png';
      a.click();
  };

  const sendChatMessage = () => {
      if (!chatInput.trim()) return;
      setSimulatedChat([...simulatedChat, { user: userName, text: chatInput }]);
      setChatInput('');
      // Simulate reply
      setTimeout(() => {
          setSimulatedChat(prev => [...prev, { user: 'Sistema', text: 'Mensaje recibido en el grupo.' }]);
      }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* ROOM HEADER */}
        <div className="relative overflow-hidden rounded-[3rem] border-4 border-slate-800 shadow-2xl h-64 group">
            {/* Background */}
            <div className="absolute inset-0 bg-slate-900">
                {roomData.backgroundUrl ? (
                    <img src={roomData.backgroundUrl} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-slate-900 to-indigo-900/50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="w-full">
                    <p className="text-amber-400 font-black uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Tu Santuario Privado
                    </p>
                    {isEditingName ? (
                        <input 
                            value={roomData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            onBlur={() => setIsEditingName(false)}
                            autoFocus
                            className="bg-transparent text-4xl md:text-5xl font-black text-white outline-none border-b-2 border-white/20 w-full"
                        />
                    ) : (
                        <div className="flex items-center gap-4 group-hover:gap-6 transition-all">
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter shadow-black drop-shadow-lg">
                                {roomData.name}
                            </h1>
                            <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white">
                                <Edit3 className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="flex gap-2">
                    <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-md transition-all" title="Invitar (Simulado)">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-md transition-all" title="Fondo">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2">
            {[
                { id: 'board', icon: LayoutGrid, label: 'Tablero' },
                { id: 'chat', icon: MessageSquare, label: 'Chat Grupo' },
                { id: 'media', icon: Camera, label: 'Multimedia' },
                { id: 'rules', icon: Shield, label: 'Reglas' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`
                        px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap
                        ${activeView === tab.id 
                            ? 'bg-amber-500 text-slate-900 shadow-lg scale-105' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                    `}
                >
                    <tab.icon className="w-5 h-5" /> {tab.label}
                </button>
            ))}
        </div>

        {/* CONTENT VIEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
                
                {activeView === 'board' && (
                    <>
                        {/* 15 OPTIONS GRID */}
                        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10">
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Protocolo Diario (15 Pasos)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {roomData.dailyOptions.map((opt, idx) => (
                                    <div key={opt.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors group">
                                        <button onClick={() => toggleDailyOption(opt.id)}>
                                            {opt.completed 
                                                ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> 
                                                : <Circle className="w-6 h-6 text-slate-600 group-hover:text-emerald-500" />}
                                        </button>
                                        <input 
                                            value={opt.text}
                                            onChange={(e) => updateOptionText(opt.id, e.target.value)}
                                            className={`bg-transparent w-full outline-none font-bold ${opt.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                                        />
                                        <span className="text-xs font-black text-slate-700">#{idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BULLETIN BOARD */}
                        <div className="bg-amber-100/5 p-6 rounded-[2rem] border border-amber-500/20 relative">
                            <Pin className="absolute top-6 right-6 text-amber-500 w-6 h-6 -rotate-45" />
                            <h3 className="text-xl font-black text-amber-500 mb-6 uppercase tracking-widest">Tablón de Anuncios</h3>
                            
                            <div className="flex gap-2 mb-6">
                                <input 
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="Dejar una nota..."
                                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                />
                                <button onClick={addBulletinPost} className="bg-amber-500 text-slate-900 p-3 rounded-xl hover:bg-amber-400 font-bold">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roomData.bulletinBoard.map(post => (
                                    <div key={post.id} className="bg-amber-200 text-slate-900 p-4 rounded-xl shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300">
                                        <p className="font-handwriting font-bold text-lg mb-2">{post.text}</p>
                                        <span className="text-[10px] font-black opacity-50 uppercase">{post.date} • {post.author}</span>
                                    </div>
                                ))}
                                {roomData.bulletinBoard.length === 0 && (
                                    <p className="text-slate-500 italic text-sm">El tablón está vacío.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeView === 'chat' && (
                    <div className="bg-slate-900 h-[600px] rounded-[2rem] border border-white/10 flex flex-col overflow-hidden">
                        <div className="bg-slate-800 p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Chat del Grupo</h3>
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">En línea</span>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {simulatedChat.length === 0 && (
                                <div className="text-center text-slate-500 mt-20">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Comienza la conversación.</p>
                                </div>
                            )}
                            {simulatedChat.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.user === userName ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-slate-500 mb-1">{msg.user}</span>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.user === userName ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-slate-700 text-white rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-800 border-t border-white/5 flex gap-2">
                            <input 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-slate-900 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-teal-500"
                            />
                            <button onClick={sendChatMessage} className="bg-teal-500 p-3 rounded-xl text-slate-900 hover:bg-teal-400">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {activeView === 'media' && (
                    <div className="bg-slate-900 min-h-[500px] rounded-[2rem] border border-white/10 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <FolderHeart className="w-6 h-6 text-rose-500" /> Galería
                            </h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" /> Subir
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {roomData.photos.map((photo) => (
                                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-white/5">
                                    <img src={photo.url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <div className="flex gap-2">
                                            <button onClick={() => downloadPhoto(photo.url)} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20"><Download className="w-4 h-4"/></button>
                                            <button className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20"><Share2 className="w-4 h-4"/></button>
                                        </div>
                                        <button onClick={() => deletePhoto(photo.id)} className="bg-rose-500/20 p-2 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-400 transition-all cursor-pointer">
                                <Video className="w-8 h-8 mb-2" />
                                <span className="text-xs font-bold">Crear Video</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'rules' && (
                    <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/10">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-amber-500" /> Constitución
                        </h3>
                        
                        <div className="space-y-3 mb-6">
                            {roomData.rules.map((rule, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-slate-800 rounded-xl border-l-4 border-amber-500">
                                    <span className="font-bold text-slate-200">{idx + 1}. {rule}</span>
                                    <button onClick={() => removeRule(idx)} className="text-slate-500 hover:text-rose-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input 
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                placeholder="Nueva regla..."
                                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white"
                            />
                            <button onClick={addRule} className="bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold">
                                Añadir
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: QUICK INFO */}
            <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5">
                    <h4 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-4">Estado de la Habitación</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-bold">Miembros</span>
                            <span className="bg-slate-700 px-3 py-1 rounded-full text-white text-xs font-bold">1 (Tú)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-bold">Privacidad</span>
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><Lock className="w-3 h-3"/> Privada</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-bold">Fotos</span>
                            <span className="text-white text-xs font-bold">{roomData.photos.length}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-[2rem] text-center">
                    <Video className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                    <h3 className="font-bold text-white mb-2">Videollamada Grupal</h3>
                    <p className="text-xs text-indigo-200 mb-4">Inicia una sala segura ahora.</p>
                    <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-bold transition-all">
                        Crear Sala
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};

export default SocialRoom;
