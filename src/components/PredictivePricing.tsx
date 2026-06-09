import React, { useState, useEffect } from "react";
import { PricePrediction, PricingTrend } from "../types";
import { TrendingUp, TrendingDown, DollarSign, Sliders, Calendar, AlertTriangle } from "lucide-react";

interface Props {
  brandColor: string;
}

export default function PredictivePricing({ brandColor }: Props) {
  // Configurable sliders
  const [opecIndex, setOpecIndex] = useState<number>(50); // 0 to 100
  const [dollarStrength, setDollarStrength] = useState<number>(34.5); // Baht per Dollar: 33 to 37
  const [globalDemand, setGlobalDemand] = useState<number>(50); // 0 to 100
  
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Re-calculate pricing trend whenever sliders adjust
  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      // Calculate trend from input sliders
      const inflationFactor = (dollarStrength - 34.5) * 0.4; // +/- adjustment
      const opecSupplyReduction = (50 - opecIndex) * 0.08; // supply drops -> price goes up
      const demandFactor = (globalDemand - 50) * 0.06; // demand rises -> price goes up
      const netChange = parseFloat((inflationFactor + opecSupplyReduction + demandFactor).toFixed(2));
      
      let trend: "UP" | "DOWN" | "STABLE" = "STABLE";
      if (netChange > 0.15) trend = "UP";
      else if (netChange < -0.15) trend = "DOWN";

      const days = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
      let startBenzene = 39.50;
      let startDiesel = 32.90;

      const dailyPredictionArray: PricingTrend[] = days.map((day, idx) => {
        // Daily progression curve
        const curveVal = Math.sin(idx * 0.8) * 0.15;
        const trendAccumulation = (netChange / 7) * idx;
        return {
          day,
          benzene: parseFloat((startBenzene + trendAccumulation + curveVal).toFixed(2)),
          diesel: parseFloat((startDiesel + (trendAccumulation * 0.6) + (curveVal * 0.5)).toFixed(2))
        };
      });

      // Find lowest prices day for advice
      let minDay = "จ.";
      let minPrice = 999;
      dailyPredictionArray.forEach((d) => {
        if (d.benzene < minPrice) {
          minPrice = d.benzene;
          minDay = d.day;
        }
      });

      let summaryText = "ราคาน้ำมันมีแนวโน้มคงตัวอยู่ในช่วงแคบ แนะนำเติมปริมาณตามใช้งานปกติ";
      let actionText = "สามารถเติมน้ำมันได้ทันทีตามต้องการ ดัชนีผันผวนต่ำ";

      if (trend === "UP") {
        summaryText = `คาดการณ์ราคาน้ำมันสำเร็จรูปจะปรับตัวสูงขึ้นประมาณ +${Math.abs(netChange).toFixed(1)}% จากสัปดาห์ก่อนหน้า เนื่องจากปัจจัยตลาดโลกและค่าเงินบาท`;
        actionText = `🚨 แนะนำให้เข้าเติมน้ำมันให้เต็มถังก่อนวัน ${dailyPredictionArray[1].day} เพื่อหลีกเลี่ยงรอบการปรับขึ้นราคา`;
      } else if (trend === "DOWN") {
        summaryText = `มีสัญญาณปรับลดราคานำเข้าเนื่องจากสภาวะอุปทาน OPEC ผ่อนคลาย คาดราคาลดลงสูงสุด -${Math.abs(netChange).toFixed(1)}%`;
        actionText = `💡 ควรรอเติมน้ำมันในวัน ${minDay} เนื่องจากเป็นจุดเว้าของกราฟราคาที่ถูกที่สุดในรอบสัปดาห์`;
      }

      setPrediction({
        trendDirection: trend,
        percentChange: Math.abs(netChange),
        analysisSummary: summaryText,
        recommendedAction: actionText,
        dailyPredictionArray
      });
      setLoading(false);
    }, 120);

    return () => clearTimeout(delay);
  }, [opecIndex, dollarStrength, globalDemand]);

  // Math coordinates generator for custom high-fidelity SVG chart
  const getSvgCoordinates = (trends: PricingTrend[], key: "benzene" | "diesel") => {
    if (!trends || trends.length === 0) return "";
    
    // Width = 400, Height = 140
    // Price domains: Benzene (35 - 45), Diesel (29 - 36)
    const minVal = key === "benzene" ? 36 : 29;
    const maxVal = key === "benzene" ? 44 : 36;
    const range = maxVal - minVal;

    return trends.map((item, index) => {
      const x = 30 + (index * (340 / 6));
      const val = item[key];
      const y = 110 - ((val - minVal) / range) * 80; // 80px high plot zone
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={20} />
            AI Predictive Fuel Pricing
          </h2>
          <p className="text-xs text-slate-400">
            Simulate future 7-day gas price trends (THB) by adjusting energy & financial sliders in real-time.
          </p>
        </div>

        {prediction && (
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">TREND:</span>
            {prediction.trendDirection === "UP" && (
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                <TrendingUp size={14} /> UP (+{prediction.percentChange}%)
              </span>
            )}
            {prediction.trendDirection === "DOWN" && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <TrendingDown size={14} /> DOWN (-{prediction.percentChange}%)
              </span>
            )}
            {prediction.trendDirection === "STABLE" && (
              <span className="text-xs font-bold text-amber-500">STABLE</span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Control Board */}
        <div className="lg:col-span-5 bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl space-y-4 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <Sliders size={14} className="text-slate-400" />
            MARKET & MACRO FORCES VALUE
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 font-mono">
              <span className="text-slate-400 font-bold">OPEC Production Supply</span>
              <span className="text-teal-400 font-bold">{opecIndex}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={opecIndex} 
              onChange={(e) => setOpecIndex(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-0.5">
              <span>CRUDE TIGHT</span>
              <span>EXTRA POWER</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 font-mono">
              <span className="text-slate-400 font-bold">FX Rate (THB / USD)</span>
              <span className="text-teal-400 font-bold">{dollarStrength} ฿</span>
            </div>
            <input 
              type="range" 
              min="31" 
              max="38" 
              step="0.1"
              value={dollarStrength} 
              onChange={(e) => setDollarStrength(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-0.5">
              <span>THB STRONG</span>
              <span>USD STRENGTH</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 font-mono">
              <span className="text-slate-400 font-bold">Global Refined Demand</span>
              <span className="text-teal-400 font-bold">{globalDemand}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={globalDemand} 
              onChange={(e) => setGlobalDemand(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-0.5">
              <span>RECESSION / FEW</span>
              <span>BOOMING TRADE</span>
            </div>
          </div>
        </div>

        {/* High-fidelity custom SVG Chart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800/80 relative shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-4">
              7-Day Ahead Fuel Price Trajectory (฿ / L)
            </span>

            {/* Custom SVG Line Chart */}
            {prediction && (
              <div className="w-full relative h-[140px]">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 140">
                  {/* Grid lines */}
                  <line x1="30" y1="30" x2="370" y2="30" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="30" y1="70" x2="370" y2="70" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="30" y1="110" x2="370" y2="110" stroke="#334155" strokeWidth="1" />

                  {/* Left Axis ticks */}
                  <text x="25" y="32" fontSize="7" fill="#64748b" fontFamily="monospace" textAnchor="end">43.00</text>
                  <text x="25" y="72" fontSize="7" fill="#64748b" fontFamily="monospace" textAnchor="end">36.00</text>
                  <text x="25" y="112" fontSize="7" fill="#64748b" fontFamily="monospace" textAnchor="end">29.00</text>

                  {/* Lines projections */}
                  {/* Benzene 95: (Orange/Red line) */}
                  <polyline 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="2.5" 
                    points={getSvgCoordinates(prediction.dailyPredictionArray, "benzene")} 
                    strokeLinecap="round"
                    className="shadow-lg filter drop-shadow-[0_0_8px_#f97316]"
                  />

                  {/* Diesel: (Teal/Silver line) */}
                  <polyline 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="2" 
                    points={getSvgCoordinates(prediction.dailyPredictionArray, "diesel")} 
                    strokeLinecap="round"
                    strokeDasharray="4 2"
                  />

                  {/* Draw points & labels */}
                  {prediction.dailyPredictionArray.map((item, idx) => {
                    const x = 30 + (idx * (340 / 6));
                    const yBenzene = 110 - ((item.benzene - 36) / 8) * 80;
                    const yDiesel = 110 - ((item.diesel - 29) / 7) * 80;

                    return (
                      <g key={idx}>
                        {/* Day names */}
                        <text x={x} y="130" fontSize="8" fill="#94a3b8" fontFamily="sans-serif" textAnchor="middle">
                          {item.day}
                        </text>
                        {/* Benzene values on top element */}
                        {idx % 2 === 0 && (
                          <text x={x} y={yBenzene - 6} fontSize="7" fill="#f97316" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                            ฿{item.benzene.toFixed(1)}
                          </text>
                        )}
                        <circle cx={x} cy={yBenzene} r="3" fill="#f97316" />
                        <circle cx={x} cy={yDiesel} r="2.5" fill="#06b6d4" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Legend indexes */}
            <div className="flex gap-4 items-center justify-end text-[9px] font-mono mt-2 border-t border-slate-900 pt-2">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span className="w-2.5 h-1.5 bg-orange-500 rounded-sm" /> Benzene 95
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-1 bg-cyan-500 rounded-sm stroke-dash" /> Diesel Ultra
              </span>
            </div>
          </div>

          {/* AI Decision coaching guidance */}
          {prediction && (
            <div className="bg-slate-950 p-4 border border-emerald-500/10 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500" />
              <div className="flex items-start gap-3">
                <Calendar className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    AI Fill-Up Coaching Recommendation
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {prediction.analysisSummary}
                  </p>
                  <div className="mt-2.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 py-1.5 px-2.5 rounded border border-emerald-500/20 inline-block leading-normal">
                    {prediction.recommendedAction}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
