import React, { useState } from "react";
import { RefuelingRecord } from "../types";
import { Image, Cpu, AlertCircle, CheckCircle, FileText, Upload, RefreshCw, Layers } from "lucide-react";

// Beautiful mock receipts templates for quick click-and-experience OCR testing in case user has no fuel receipt handy!
const MOCK_TEMPLATES = [
  {
    name: "Shell Gasohol 95 Receipt",
    imgUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop", // placeholder representative image
    data: {
      brand: "Shell Station Sukhumvit",
      date: "2026-06-05",
      totalPaid: 1540.50,
      liters: 38.60,
      pricePerLiter: 39.91,
      fuelType: "Gasohol 95"
    }
  },
  {
    name: "PTT Ultra Diesel B7",
    imgUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=400&auto=format&fit=crop",
    data: {
      brand: "PTT Station Vibhavadi",
      date: "2026-06-06",
      totalPaid: 2138.50,
      liters: 65.00, // Anomaly trigger for small sedan!
      pricePerLiter: 32.90,
      fuelType: "Diesel B7"
    }
  },
  {
    name: "Bangchak Eco E20 Receipt",
    imgUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop",
    data: {
      brand: "Bangchak Srinakarin",
      date: "2026-06-03",
      totalPaid: 950.00,
      liters: 27.60,
      pricePerLiter: 34.42,
      fuelType: "Gasohol E20"
    }
  }
];

interface Props {
  onRecordSaved: (record: RefuelingRecord) => void;
  brandColor: string;
}

export default function FuelOcrAR({ onRecordSaved, brandColor }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);
  const [isApiRequest, setIsApiRequest] = useState<boolean>(false);
  
  // OCR Form values
  const [brandField, setBrandField] = useState("");
  const [dateField, setDateField] = useState("");
  const [totalField, setTotalField] = useState(0);
  const [litersField, setLitersField] = useState(0);
  const [priceField, setPriceField] = useState(0);
  const [fuelTypeField, setFuelTypeField] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOcrResult(null);
      setSuccessMsg("");
    }
  };

  const selectPresetTemplate = (template: typeof MOCK_TEMPLATES[0]) => {
    setPreviewUrl(template.imgUrl);
    setOcrResult(null);
    setSuccessMsg("");
    setScanning(true);
    
    // Mimic scanning effect for 1.8 seconds, then populate fields
    setTimeout(() => {
      setScanning(false);
      setOcrResult(template.data);
      populateForm(template.data);
    }, 1500);
  };

  const populateForm = (data: any) => {
    setBrandField(data.brand || "");
    setDateField(data.date || "");
    setTotalField(data.totalPaid || 0);
    setLitersField(data.liters || 0);
    setPriceField(data.pricePerLiter || 0);
    setFuelTypeField(data.fuelType || "");
  };

  // Triggers real server side OCR API!
  const runAiOcrScanner = async () => {
    if (!previewUrl) return;
    setScanning(true);
    setIsApiRequest(true);

    try {
      // Convert previewUrl to Base64 in standard format
      // Note: If preset placeholder is selected, just use simulated API response
      if (previewUrl.startsWith("http")) {
        // Trigger simulated API delay
        const mockResponse = {
          brand: "Station Extracted",
          date: new Date().toISOString().split("T")[0],
          totalPaid: 1250,
          liters: 32.5,
          pricePerLiter: 38.46,
          fuelType: "Gasohol 95"
        };
        setTimeout(() => {
          setScanning(false);
          setOcrResult(mockResponse);
          populateForm(mockResponse);
          setIsApiRequest(false);
        }, 1800);
        return;
      }

      // Convert local chosen file to Base64 and POST to backend
      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          const mime = selectedFile.type;

          const response = await fetch("/api/ocr-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64Data, mimeType: mime }),
          });

          const data = await response.json();
          setScanning(false);
          setOcrResult(data);
          populateForm(data);
          setIsApiRequest(false);
        };
      }
    } catch (err) {
      console.error(err);
      setScanning(false);
      setIsApiRequest(false);
    }
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const mockRecord: RefuelingRecord = {
      id: "REF-" + Math.floor(Math.random() * 90000 + 10000),
      plateNo: "กข-5678 กรุงเทพฯ",
      brand: brandField,
      date: dateField,
      totalPaid: Number(totalField),
      liters: Number(litersField),
      pricePerLiter: Number(priceField),
      fuelType: fuelTypeField,
      driverName: "สมชาย วงศ์ดี (Fleet 3)",
      station: brandField,
      time: "14:15"
    };

    onRecordSaved(mockRecord);
    setSuccessMsg("✓ Refueling logged successfully. Stats and B2B Fleet Anomalies refreshed!");
    // Reset form after timer
    setTimeout(() => {
       setOcrResult(null);
       setPreviewUrl(null);
       setSelectedFile(null);
       setSuccessMsg("");
    }, 4000);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden">
      
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="text-amber-500 animate-pulse" size={20} />
            AI Receipts OCR Scanner (AR View)
          </h2>
          <p className="text-xs text-slate-400">
            Upload fuel receipts or use a preset. Gemini AI will parse data elements with live AR highlights!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cam Frame / AR Viewer */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full relative aspect-[3/4] bg-slate-950 rounded-xl border border-slate-805 flex flex-col items-center justify-center overflow-hidden group shadow-inner">
            
            {previewUrl ? (
              <div className="w-full h-full relative">
                <img 
                  src={previewUrl} 
                  alt="Receipt Preview" 
                  className="w-full h-full object-cover opacity-75"
                />

                {/* AR Scanning Laser line animation */}
                {scanning && (
                  <div className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-bounce z-10" />
                )}

                {/* AR Scanned Highlight Coordinates Overlay */}
                {ocrResult && !scanning && (
                  <div className="absolute inset-0 pointer-events-none text-[8.5px] font-mono">
                    
                    {/* Bounding Highlighters */}
                    <div className="absolute top-[15%] left-[20%] right-[20%] border border-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-400 animate-pulse">
                      [OCR: STATION BRAND] • {brandField}
                    </div>

                    <div className="absolute top-[40%] left-[25%] border border-amber-500 bg-amber-500/15 px-1.5 py-0.5 rounded text-amber-400">
                      [OCR: TYPE] • {fuelTypeField}
                    </div>

                    <div className="absolute top-[52%] left-[40%] border border-cyan-500 bg-cyan-500/15 px-1.5 py-0.5 rounded text-cyan-400">
                      [OCR: VOLUME] • {litersField} L
                    </div>

                    <div className="absolute bottom-[20%] right-[15%] border border-rose-500 bg-rose-500/15 px-1.5 py-0.5 rounded text-rose-400 font-bold text-[10px]">
                      [OCR: TOTAL COST] • ฿{totalField}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 flex flex-col items-center">
                <FileText size={40} className="mb-3 text-slate-600 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400">AR VIEWFINDER TERMINAL</span>
                <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-normal">
                  No receipts active. Select one of the quick test templates below or upload one.
                </p>
              </div>
            )}

            {/* Bottom bar of viewport */}
            <div className="absolute bottom-0 w-full bg-slate-900/90 py-2.5 px-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono z-10">
              <span className="text-slate-400 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${scanning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {scanning ? "OCR RUNNING..." : "SYSTEM STBY"}
              </span>
              {previewUrl && !scanning && (
                <button 
                  onClick={runAiOcrScanner}
                  className="px-2.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded font-bold hover:bg-amber-500/30 transition text-[9px]"
                >
                  TRIGGER REAL AI OCR
                </button>
              )}
            </div>
          </div>

          <div className="w-full mt-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold text-center">
              Quick Test Presets (Instant Simulation)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {MOCK_TEMPLATES.map((t, index) => (
                <button
                  key={index}
                  onClick={() => selectPresetTemplate(t)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700/80 p-2 rounded-xl text-left transition relative overflow-hidden group active:scale-95"
                >
                  <span className="text-[9px] block text-slate-400 font-bold truncate leading-tight group-hover:text-slate-200">
                    {t.name.split(" ")[0]} {t.name.split(" ")[1]}
                  </span>
                  <span className="text-[9.5px] font-mono block text-amber-400 mt-1 font-bold">
                    ฿{t.data.totalPaid}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-3 flex items-center justify-center">
              <label className="cursor-pointer bg-slate-800/80 hover:bg-slate-700 font-bold text-xs py-2 px-4 rounded-xl border border-slate-700 text-slate-100 flex items-center gap-2 transition w-full justify-center">
                <Upload size={14} />
                Upload Personal Receipt
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Auto-fill Form ledger */}
        <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 relative shadow-inner">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2.5">
            <Layers size={16} className="text-slate-400" />
            Extracted Digital Ledger Details
          </h3>

          {successMsg && (
            <div className="mb-4 bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg text-emerald-400 text-xs flex items-center gap-2 animate-bounce">
              <CheckCircle size={15} />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSaveTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-bold">
                  Station Brand Name
                </label>
                <input 
                  type="text" 
                  required
                  value={brandField} 
                  onChange={(e) => setBrandField(e.target.value)}
                  placeholder="e.g. Shell Bangchak"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-bold">
                  Refuel Date
                </label>
                <input 
                  type="date" 
                  required
                  value={dateField} 
                  onChange={(e) => setDateField(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-bold">
                  Total Paid (Baht)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={totalField || ""} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalField(val);
                    if (val && litersField) setPriceField(Number((val / litersField).toFixed(2)));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-bold">
                  Volume (Liters)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={litersField || ""} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLitersField(val);
                    if (totalField && val) setPriceField(Number((totalField / val).toFixed(2)));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-bold">
                  Price / Liter (Baht)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={priceField || ""} 
                  onChange={(e) => setPriceField(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-bold">
                Fuel Type Selected
              </label>
              <input 
                type="text" 
                required
                value={fuelTypeField} 
                onChange={(e) => setFuelTypeField(e.target.value)}
                placeholder="e.g. Gasohol 95"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={!brandField}
                className="w-full cursor-pointer bg-slate-800 border border-slate-700/80 hover:bg-slate-700 hover:border-slate-600 text-slate-100 font-bold text-xs py-2.5 rounded-xl transition duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ activeColor: brandColor }}
              >
                Log Refueling to Fleet Database
              </button>
            </div>
          </form>

          {/* Footing note explaining telemetry impact */}
          <div className="mt-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 leading-normal flex gap-2.5 items-start">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span>
                <strong>System Note:</strong> Logging this receipts refreshes B2B enterprise datasets across the system. 
                If anomalies are flagged, the Fleet Anomaly Detector in the next tab updates instantaneously.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
