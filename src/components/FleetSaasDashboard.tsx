import React, { useState, useEffect } from "react";
import { RefuelingRecord, FleetAnomaly } from "../types";
import { AlertCircle, FileText, TrendingUp, ShieldAlert, Cpu, CheckCircle, Table, Printer } from "lucide-react";

interface Props {
  records: RefuelingRecord[];
  brandColor: string;
}

export default function FleetSaasDashboard({ records, brandColor }: Props) {
  const [anomalies, setAnomalies] = useState<FleetAnomaly[]>([]);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Auto trigger server-side anomaly checking when list updates!
  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoadingAnomalies(true);
      try {
        const response = await fetch("/api/fleet-anomaly", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactions: records })
        });
        const data = await response.json();
        setAnomalies(data);
      } catch (err) {
        console.error("Failed to query anomalies from server", err);
      } finally {
        setLoadingAnomalies(false);
      }
    };

    if (records.length > 0) {
      fetchAnomalies();
    }
  }, [records]);

  // Simulated professional B2B PDF Report compilation
  const handlePdfTrigger = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print(); // Uses standard browser printable frames
    }, 1500);
  };

  // Calculators
  const totalFuelCost = records.reduce((acc, r) => acc + r.totalPaid, 0);
  const totalVolume = records.reduce((acc, r) => acc + r.liters, 0);
  const avgCostPerLiter = totalVolume ? (totalFuelCost / totalVolume).toFixed(2) : "0.00";

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden print:bg-white print:text-slate-900 print:p-0 print:border-none">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="text-rose-500 animate-pulse" size={20} />
            B2B Enterprise Fleet Telematics
          </h2>
          <p className="text-xs text-slate-400">
            Anomaly Detection engine highlighting multi-use fuel cards, off-hour fueling, and abnormal volumes.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePdfTrigger}
          disabled={isExporting}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700/80 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 transition active:scale-95 text-left shrink-0 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Cpu className="animate-spin text-teal-400" size={14} />
              Compiling Data Report...
            </>
          ) : (
            <>
              <Printer className="text-slate-400" size={14} />
              Print Enterprise PDF Report
            </>
          )}
        </button>
      </div>

      {/* Mini printable-brand header which flashes ONLY during PDF print mode */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          SMART FLEET MANAGEMENT ENTERPRISE REPORT
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Confidential fuel audit trail and automated anomaly detection log • Generated On: {new Date().toLocaleDateString("th-TH")}
        </p>
      </div>

      {/* Grid Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 shadow-inner print:border-slate-300">
          <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">Total Fuel Spending</span>
          <span className="text-xl font-black text-slate-100 font-mono mt-1 block print:text-slate-900">
            ฿{totalFuelCost.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Across entire fleet vehicle registry</span>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 shadow-inner print:border-slate-300">
          <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">Accumulated Liters</span>
          <span className="text-xl font-black text-slate-100 font-mono mt-1 block print:text-slate-900">
            {totalVolume.toFixed(2)} L
          </span>
          <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Sum total fuel consumption metrics</span>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 shadow-inner print:border-slate-300">
          <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">Mean Cost Per Liter</span>
          <span className="text-xl font-black text-slate-100 font-mono mt-1 block print:text-slate-900">
            ฿{avgCostPerLiter}
          </span>
          <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Weighted average pump index</span>
        </div>
      </div>

      {/* Anomalies alert console section */}
      <div className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-850/80 shadow-inner print:border-slate-300">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Cpu size={14} className="text-amber-500 animate-pulse" />
            AI ANOMALY RISK ASSESSMENT
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Engine running: Gemini High-Risk Tracker
          </span>
        </div>

        {loadingAnomalies ? (
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2 py-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Recalculating fleet risk vectors across {records.length} refuels...
          </div>
        ) : anomalies.length === 0 ? (
          <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle size={15} />
            Excellent. No refueling anomalies or fuel fraud flags detected in the audit log!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {anomalies.map((anom, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border flex gap-2.5 items-start text-xs ${anom.riskLevel === 'HIGH' ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-amber-950/20 border-amber-500/20 text-amber-300'}`}
              >
                <AlertCircle className="shrink-0 mt-0.5" size={14} />
                <div>
                  <div className="font-bold flex items-center gap-1.5 leading-normal">
                    <span className="uppercase text-[9px] font-mono font-black border px-1 rounded" style={{ borderColor: 'currentColor' }}>
                      {anom.riskLevel} RISK
                    </span>
                    {anom.issueType}
                  </div>
                  <p className="text-[10.5px] text-slate-400/90 mt-1 leading-normal">
                    {anom.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fleet refueling ledger table */}
      <div>
        <div className="flex items-center gap-1.5 mb-3 text-xs font-mono font-bold text-slate-300 print:text-slate-900">
          <Table size={14} />
          FLEET REFUELLING AUDIT LOG
        </div>

        <div className="overflow-x-auto border border-slate-850/80 rounded-xl bg-slate-950/60 print:border-slate-300">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 text-[10px] uppercase font-bold tracking-wider print:bg-slate-100 print:text-slate-700 print:border-slate-300">
                <th className="p-3">Ref ID</th>
                <th className="p-3">Plate No</th>
                <th className="p-3">Date/Time</th>
                <th className="p-3">Station / Brand</th>
                <th className="p-3">Fuel Type</th>
                <th className="p-3 text-right">Qty (L)</th>
                <th className="p-3 text-right">Price/L</th>
                <th className="p-3 text-right">Total (THB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 print:divide-slate-300 text-slate-300 print:text-slate-900">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/30 print:hover:bg-transparent">
                  <td className="p-3 font-semibold text-slate-400 print:text-slate-600">{r.id}</td>
                  <td className="p-3 font-bold">{r.plateNo}</td>
                  <td className="p-3">{r.date} {r.time}</td>
                  <td className="p-3 text-slate-400 print:text-slate-600">{r.station}</td>
                  <td className="p-3">{r.fuelType}</td>
                  <td className="p-3 text-right font-semibold">{r.liters.toFixed(2)}</td>
                  <td className="p-3 text-right text-slate-400 print:text-slate-600">฿{r.pricePerLiter.toFixed(2)}</td>
                  <td className="p-3 text-right font-black text-slate-100 print:text-slate-900">฿{r.totalPaid.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
