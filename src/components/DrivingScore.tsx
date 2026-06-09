import React, { useState, useEffect } from "react";
import { Gauge, Sparkles, Navigation, AlertOctagon, Heart, Award } from "lucide-react";

interface Props {
  brandColor: string;
}

export default function DrivingScore({ brandColor }: Props) {
  // Configurable model state: 0 = Eco Pro, 1 = Commute Normal, 2 = Aggressive Sport
  const [profileIndex, setProfileIndex] = useState<number>(0);
  
  // Real-time calculated variables
  const [speed, setSpeed] = useState<number>(85);
  const [ecoScore, setEcoScore] = useState<number>(92);
  const [rapidAccel, setRapidAccel] = useState<number>(0);
  const [suddenBrake, setSuddenBrake] = useState<number>(1);
  const [avgFuelCons, setAvgFuelCons] = useState<string>("18.5 km/L");

  useEffect(() => {
    if (profileIndex === 0) { // Eco Pro
      setSpeed(80);
      setEcoScore(96);
      setRapidAccel(0);
      setSuddenBrake(0);
      setAvgFuelCons("21.2 km/L");
    } else if (profileIndex === 1) { // Commute
      setSpeed(105);
      setEcoScore(81);
      setRapidAccel(2);
      setSuddenBrake(3);
      setAvgFuelCons("15.8 km/L");
    } else { // Sport / Heavy Foot
      setSpeed(145);
      setEcoScore(42);
      setRapidAccel(8);
      setSuddenBrake(11);
      setAvgFuelCons("9.4 km/L");
    }
  }, [profileIndex]);

  // Dash calculations for responsive SVG gauge rings
  // Radius is 30, Circumference is ~188.4
  const strokeDashOffset = (score: number) => {
    const rawRatio = score / 100;
    return 188.4 * (1 - rawRatio);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Gauge className="text-cyan-400" size={20} />
            Driving Behavior & Eco-Score
          </h2>
          <p className="text-xs text-slate-400">
            Real-time visual telemetry indicating speed, abrupt braking ratios, fuel rates, and safety index.
          </p>
        </div>

        {/* Driving profile presets selection */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button 
            type="button"
            onClick={() => setProfileIndex(0)}
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg active:scale-95 transition-transform duration-150 ${profileIndex === 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 border border-transparent hover:text-slate-300"}`}
          >
            Eco Pro
          </button>
          <button 
            type="button"
            onClick={() => setProfileIndex(1)}
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg active:scale-95 transition-transform duration-150 ${profileIndex === 1 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 border border-transparent hover:text-slate-300"}`}
          >
            Normal
          </button>
          <button 
            type="button"
            onClick={() => setProfileIndex(2)}
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg active:scale-95 transition-transform duration-150 ${profileIndex === 2 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "text-slate-500 border border-transparent hover:text-slate-300"}`}
          >
            Sport
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Gauge Ring 1: Eco Score */}
        <div className="flex flex-col items-center p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 shadow-inner">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle track */}
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="30" fill="transparent" stroke="#1e293b" strokeWidth="5" />
              <circle 
                cx="64" 
                cy="64" 
                r="30" 
                fill="transparent" 
                stroke={ecoScore > 80 ? "#10b981" : (ecoScore > 50 ? "#f59e0b" : "#ef4444")} 
                strokeWidth="5.5" 
                strokeDasharray="188.4"
                strokeDashoffset={strokeDashOffset(ecoScore)}
                strokeLinecap="round"
                className="transition-all duration-700 drop-shadow-[0_0_8px_#10b981]"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-slate-100">{ecoScore}</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">POINTS</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
            Sustained Eco Rating
          </span>
          <p className="text-[10px] text-slate-500 text-center mt-0.5">
            {ecoScore > 80 ? "Sustaining excellent eco parameters!" : "Heavy throttle detected. Eco deficit."}
          </p>
        </div>

        {/* Gauge Ring 2: Current Speedometer */}
        <div className="flex flex-col items-center p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 shadow-inner">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              {/* Semi circle speed track ratio (Max 200 kmh) */}
              <circle cx="64" cy="64" r="30" fill="transparent" stroke="#1e293b" strokeWidth="5" />
              <circle 
                cx="64" 
                cy="64" 
                r="30" 
                fill="transparent" 
                stroke={speed > 120 ? "#ef4444" : "#3b82f6"} 
                strokeWidth="5.5" 
                strokeDasharray="188.4"
                strokeDashoffset={strokeDashOffset((speed / 200) * 100)}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-mono text-slate-100">{speed}</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">KM / H</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
            Vehicle Velocity
          </span>
          <p className="text-[10px] text-slate-500 text-center mt-0.5">
            {speed > 120 ? "Speed limits exceeded! Penalties active." : "Speed parameters stable & safe."}
          </p>
        </div>

        {/* Telemetry log list & coaching */}
        <div className="space-y-3.5 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center text-[10.5px] font-mono pb-2 border-b border-slate-900">
            <span className="text-slate-500 font-bold uppercase">Behavior Metric</span>
            <span className="text-slate-500 font-bold uppercase">Incident count</span>
          </div>

          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Sudden Brakings (฿/Day)</span>
            <span className={`font-bold ${suddenBrake > 5 ? "text-rose-400" : "text-emerald-400"}`}>
              {suddenBrake} events
            </span>
          </div>

          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Rapid Accelerations</span>
            <span className={`font-bold ${rapidAccel > 4 ? "text-rose-400" : "text-emerald-400"}`}>
              {rapidAccel} instances
            </span>
          </div>

          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Average Consumption</span>
            <span className="text-cyan-400 font-bold">{avgFuelCons}</span>
          </div>

          <div className="pt-2">
            {/* Eco Coach Tips */}
            <div className="bg-slate-950 px-3 py-2.5 rounded border border-slate-800 flex gap-2 items-start text-[10px]">
              <Award className="text-amber-500 shrink-0 mt-0.5" size={14} />
              <div className="leading-relaxed">
                <span className="font-bold text-slate-300 block">Eco Coach AI Insights</span>
                {profileIndex === 0 && "Maintain steady RPM at 1,500 - 2,000 for maximized electric/fuel hybrid performance. Perfect score!"}
                {profileIndex === 1 && "Moderate aggressive lane departures. Shifting to steady highway lanes would elevate score +5%."}
                {profileIndex === 2 && "Extreme brake temperatures detected! Rapid braking burns fuel up to 40% faster. Ease throttle immediately."}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
