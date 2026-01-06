
import React, { useRef, useState } from 'react';
import { AppSettings, UserProfileExtended } from '../types';
import { 
    Settings as SettingsIcon, User, Camera, Palette, Globe, Type, 
    Bell, Lock, Layers, Box, ChevronDown, ChevronUp, RefreshCw, Key
} from 'lucide-react';

interface SettingsProps {
    settings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'account' | 'assets' | 'planes'>('profile');

    // Helper for updating nested profile fields
    const updateProfile = (field: keyof UserProfileExtended, value: any) => {
        onUpdateSettings({
            ...settings,
            profile: { ...settings.profile, [field]: value }
        });
    };

    // Helper for updating counters
    const updateCounter = (category: 'assets' | 'planes', field: string, increment: boolean) => {
        const currentVal = (settings.profile as any)[category === 'planes' ? 'planes' : field] || 0;
        let newVal = increment ? currentVal + 1 : Math.max(0, currentVal - 1);
        
        if (category === 'planes') {
             onUpdateSettings({
                ...settings,
                profile: { 
                    ...settings.profile, 
                    planes: { ...settings.profile.planes, [field]: newVal } 
                }
            });
        } else {
             onUpdateSettings({
                ...settings,
                profile: { ...settings.profile, [field]: newVal }
            });
        }
    };

    // Asset Categories mapping for UI generation
    const ASSETS = [
        'cars', 'houses', 'apartments', 'bikes', 'motorcycles', 'boats', 'airplanes', 'yachts', 
        'mansions', 'estates', 'islands', 'countries', 'cities', 'towns', 'villages', 'continents',
        'planets', 'galaxies', 'universes', 'dimensions', 'realms'
    ];

    const PLANES = [
        'astral', 'etheric', 'mental', 'spiritual', 'divine', 'celestial', 'infernal', 'demonic', 'angelic',
        'human', 'animal', 'vegetable', 'mineral', 'elemental',
        'energy', 'matter', 'information', 'consciousness', 'existence', 'reality', 'dream', 'imagination', 'memory',
        'thought', 'feeling', 'will', 'action', 'reaction', 'causality',
        'time', 'space', 'dimensions_metric',
        'forces', 'laws', 'principles', 'concepts', 'ideas', 'symbols', 'meaning',
        'communication', 'interaction', 'relation', 'connection', 'network', 'system', 'structure', 'organization',
        'management', 'control', 'supervision', 'direction', 'leadership', 'authority', 'power',
        'influence', 'persuasion', 'manipulation', 'coercion', 'threat', 'blackmail', 'extortion',
        'violence', 'aggression', 'conflict', 'war', 'destruction', 'chaos', 'disorder', 'anarchy',
        'nihilism', 'despair', 'fear', 'hate', 'envy', 'greed', 'lust', 'ira', 'sloth', 'gluttony', 'pride', 'vanity',
        'selfishness', 'narcissism', 'sadism', 'masochism', 'fetishism', 'paraphilias', 'perversions',
        'vices', 'addictions', 'diseases', 'ailments', 'sufferings', 'agony', 'death', 'nothingness'
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
            
            {/* TABS */}
            <div className="flex overflow-x-auto pb-2 gap-2">
                {[
                    { id: 'profile', label: 'Identidad', icon: User },
                    { id: 'assets', label: 'Bienes', icon: Box },
                    { id: 'planes', label: 'Planos', icon: Layers },
                    { id: 'appearance', label: 'Apariencia', icon: Palette },
                    { id: 'account', label: 'Cuenta', icon: Key },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id as any)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold whitespace-nowrap transition-all ${
                            activeSection === tab.id 
                            ? 'bg-slate-100 dark:bg-white text-slate-900' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="bg-slate-900 border border-slate-700 rounded-[2rem] p-6 shadow-xl">
                
                {activeSection === 'profile' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-600">
                                    {settings.userAvatar ? <img src={settings.userAvatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 text-slate-500"/>}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-teal-500 p-1 rounded-full text-slate-900 hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Perfil Personal</h3>
                                <p className="text-xs text-slate-400">Tus datos en el mundo físico.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['username', 'name', 'email', 'phone', 'location', 'birthDate', 'gender', 'sexualOrientation', 'race', 'religion', 'politics', 'education', 'occupation', 'salary', 'maritalStatus'].map(field => (
                                <div key={field}>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <input 
                                        value={(settings.profile as any)[field]}
                                        onChange={(e) => updateProfile(field as any, e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-teal-500 outline-none"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                {['children', 'pets'].map(field => (
                                    <div key={field} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-700">
                                        <span className="text-sm font-bold text-slate-400 uppercase">{field}</span>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateCounter('assets', field, false)} className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">-</button>
                                            <span className="font-mono text-white">{(settings.profile as any)[field]}</span>
                                            <button onClick={() => updateCounter('assets', field, true)} className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'assets' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Box className="w-5 h-5 text-amber-500"/> Inventario de Bienes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {ASSETS.map(asset => (
                                <div key={asset} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-700 hover:border-amber-500/50 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 uppercase truncate mr-2">{asset}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateCounter('assets', asset, false)} className="w-6 h-6 bg-slate-800 rounded hover:bg-slate-700 flex items-center justify-center text-slate-300">-</button>
                                        <span className="font-mono text-white w-6 text-center text-sm font-bold">{(settings.profile as any)[asset]}</span>
                                        <button onClick={() => updateCounter('assets', asset, true)} className="w-6 h-6 bg-slate-800 rounded hover:bg-slate-700 flex items-center justify-center text-slate-300">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'planes' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500"/> Planos de Existencia</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {PLANES.map(plane => {
                                const val = settings.profile.planes[plane] || 0;
                                return (
                                    <div key={plane} className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 truncate">{plane.replace(/_/g, ' ')}</span>
                                        <div className="flex items-center justify-between">
                                            <button onClick={() => updateCounter('planes', plane, false)} className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">-</button>
                                            <span className="font-mono text-indigo-400 font-bold">{val}</span>
                                            <button onClick={() => updateCounter('planes', plane, true)} className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeSection === 'appearance' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-sm text-slate-300 mb-3 flex items-center gap-2"><Globe className="w-4 h-4"/> Idioma</h4>
                                <select 
                                    value={settings.language}
                                    onChange={(e) => onUpdateSettings({...settings, language: e.target.value as any})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                    {/* Add others */}
                                </select>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-sm text-slate-300 mb-3 flex items-center gap-2"><Type className="w-4 h-4"/> Fuente & Tamaño</h4>
                                <div className="flex gap-2">
                                    <select 
                                        value={settings.fontFamily}
                                        onChange={(e) => onUpdateSettings({...settings, fontFamily: e.target.value})}
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                                    >
                                        <option value="sans-serif">Sans Serif</option>
                                        <option value="serif">Serif</option>
                                        <option value="monospace">Monospace</option>
                                    </select>
                                    <select 
                                        value={settings.textSize}
                                        onChange={(e) => onUpdateSettings({...settings, textSize: e.target.value as any})}
                                        className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                                    >
                                        <option value="sm">Pequeño</option>
                                        <option value="md">Normal</option>
                                        <option value="lg">Grande</option>
                                        <option value="xl">Extra</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm text-slate-300 mb-3 flex items-center gap-2"><Palette className="w-4 h-4"/> Temas & Colores</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">Color Acento</span>
                                        <input type="color" value={settings.accentColor} onChange={(e) => onUpdateSettings({...settings, accentColor: e.target.value})} className="bg-transparent border-none w-8 h-8 cursor-pointer"/>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">Color Fondo</span>
                                        <input type="color" value={settings.backgroundColor.startsWith('#') ? settings.backgroundColor : '#000000'} onChange={(e) => onUpdateSettings({...settings, backgroundColor: e.target.value})} className="bg-transparent border-none w-8 h-8 cursor-pointer"/>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm text-slate-300 mb-3 flex items-center gap-2"><Bell className="w-4 h-4"/> Notificaciones</h4>
                                <button 
                                    onClick={() => onUpdateSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                                    className={`w-full py-3 rounded-lg border flex items-center justify-between px-4 transition-all ${settings.notificationsEnabled ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-700 text-slate-400'}`}
                                >
                                    <span className="text-xs font-bold uppercase">{settings.notificationsEnabled ? 'ACTIVADAS' : 'DESACTIVADAS'}</span>
                                    <div className={`w-4 h-4 rounded-full ${settings.notificationsEnabled ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'account' && (
                    <div className="space-y-6 text-center py-8">
                        <div className="mx-auto w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Key className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Gestión de Cuenta</h3>
                        <p className="text-slate-400 mb-8 text-sm">Tus datos están guardados localmente en este dispositivo.</p>
                        
                        <div className="space-y-3 max-w-xs mx-auto">
                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors">
                                Cambiar Contraseña
                            </button>
                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors">
                                Exportar Datos
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('equilibrio_user');
                                    window.location.reload();
                                }}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;