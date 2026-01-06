
import React, { useState, useEffect } from 'react';
import { Lock, User, ArrowRight, Hammer, Eye, EyeOff, Sparkles, Flame } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../constants';

interface SplashScreenProps {
  onAuthenticated: (name: string, isNewUser: boolean) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState('');

  // Check for existing user on mount with error handling
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('equilibrio_user');
      // Set random quote
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name && parsed.password) {
            setName(parsed.name);
            setStoredPassword(parsed.password);
            setMode('login');
        }
      }
    } catch (e) {
      console.error("Error parsing user data", e);
      localStorage.removeItem('equilibrio_user');
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      onAuthenticated(name, true);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== storedPassword) {
      setError('Contraseña incorrecta.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onAuthenticated(name, false); 
    }, 1000);
  };

  // Dark, gritty, space/forge background
  const BG_IMAGE = "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?q=80&w=2000&auto=format&fit=crop";

  return (
    <div 
      className="min-h-[100dvh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-y-auto py-10"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <div className="fixed inset-0 bg-slate-950/80 z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center">
        
        <div className="mb-10 flex flex-col items-center text-center">
            {/* Logo glowing effect */}
            <div className="relative mb-6 group">
                <div className="absolute -inset-2 bg-rose-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center ring-4 ring-rose-900 shadow-2xl">
                    <Hammer className="w-12 h-12 text-rose-500" />
                </div>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter mb-2 text-white uppercase drop-shadow-xl">
              LA FORJA
            </h1>
            <p className="text-slate-400 font-medium text-sm tracking-[0.2em] uppercase">
              Equilibrio IA v2.0
            </p>
        </div>

        {/* WELCOME MESSAGE */}
        {mode === 'login' && (
             <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
                 <h2 className="text-white text-lg font-bold mb-2">Bienvenido de nuevo, {name}.</h2>
                 <p className="text-rose-300 text-xs italic font-serif">"{quote}"</p>
             </div>
        )}

        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} className="w-full space-y-6">
            {mode === 'register' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu Nombre"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-xl"
                    />
                </div>
              </div>
            )}

            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                      }}
                      placeholder={mode === 'register' ? "Crea una contraseña" : "Tu contraseña"}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-xl"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {error && (
              <p className="text-rose-400 text-xs font-bold text-center bg-rose-950/50 py-2 rounded-lg border border-rose-500/30 animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-700 hover:bg-rose-600 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(190,18,60,0.3)] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 uppercase tracking-wider"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                </span>
              ) : (
                <>
                  {mode === 'register' ? 'Iniciar el Viaje' : 'Acceder al Sistema'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
        </form>

        {mode === 'login' && (
            <button 
            onClick={() => {
                localStorage.removeItem('equilibrio_user');
                setMode('register');
                setName('');
                setPassword('');
                setStoredPassword('');
            }}
            className="mt-8 text-xs text-slate-500 hover:text-white underline transition-colors animate-in fade-in delay-500"
            >
                Cambiar de usuario
            </button>
        )}
      </div>
    </div>
  );
};

// Helper Icon
function Loader2(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}

export default SplashScreen;
