
import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface AlmanacProps {
  chain: string[];
  onToggleDate: (date: string) => void;
}

const Almanac: React.FC<AlmanacProps> = ({ chain, onToggleDate }) => {
  const today = new Date();
  
  const days = useMemo(() => {
    const res = [];
    for (let i = 20; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      res.push({
        date: str,
        dayNum: d.getDate(),
        isToday: i === 0,
        marked: chain.includes(str)
      });
    }
    return res;
  }, [chain]);

  const streak = useMemo(() => {
    let count = 0;
    const sortedChain = [...chain].sort().reverse();
    const checkDate = new Date(today);
    
    // Simple logic for continuous streak
    for (let i = 0; i < 30; i++) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (chain.includes(dStr)) {
            count++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
            // If today isn't marked, keep going from yesterday
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
        } else {
            break;
        }
    }
    return count;
  }, [chain]);

  return (
    <div className="bg-slate-900/80 p-6 rounded-[2rem] border-2 border-amber-500/30 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy className="w-24 h-24 text-amber-500" />
      </div>
      
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Mi Almanaque</h2>
            <p className="text-amber-400 font-bold text-xs mt-1">CADENA INQUEBRANTABLE</p>
        </div>
        <div className="text-right">
            <div className="text-4xl font-black text-white leading-none">{streak}</div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Días de Poder</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 relative z-10">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => onToggleDate(day.date)}
            className={`
              aspect-square rounded-2xl border-2 flex items-center justify-center transition-all
              ${day.marked 
                ? 'bg-amber-500 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                : 'bg-slate-800 border-slate-700 hover:border-amber-500/50'}
              ${day.isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}
            `}
          >
            {day.marked ? (
              <CheckCircle2 className="w-6 h-6 text-slate-950 font-black" />
            ) : (
              <span className="text-lg font-black text-slate-600">{day.dayNum}</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">"No rompas la cadena de tu voluntad"</p>
      </div>
    </div>
  );
};

export default Almanac;
