import React, { useState, useEffect } from "react";
import { CarBrand, RefuelingRecord, FleetVehicle } from "./types";
import ThreeDGarage from "./components/ThreeDGarage";
import BiometricScan from "./components/BiometricScan";
import TripSummaryReport from "./components/TripSummaryReport";
import {
  Car,
  MapPin,
  Bell,
  LogOut,
  User,
  Wrench,
  Fuel,
  TrendingUp,
  Cpu,
  Trash2,
  Search,
  PlusCircle,
  BatteryCharging,
  Lock,
  Unlock,
  ThermometerSnowflake,
  Volume2,
  AlertCircle,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Droplet,
  Home,
  BarChart3,
  Settings,
  Key,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Camera,
  FileText,
  Scan,
  ScanLine,
  Target,
  Activity,
  Zap,
  ShieldAlert,
  Crosshair
} from "lucide-react";

// Predefined Brand Themes
const CAR_BRANDS: CarBrand[] = [
  {
    id: "tesla",
    name: "Tesla Inc.",
    modelName: "Model S Plaid",
    brandColor: "#ef4444", // Radical Red
    accentClass: "text-red-500 border-red-500/20 hover:border-red-500/40 bg-red-500/10",
    glowClass: "shadow-[0_0_15px_#ef444433]",
    specs: { battery: "100 kWh", range: "637 Km", hp: "1020", tankVolume: 0 }
  },
  {
    id: "bmw",
    name: "BMW M-Division",
    modelName: "BMW i7 M70",
    brandColor: "#3b82f6", // M-Power Blue
    accentClass: "text-blue-500 border-blue-500/20 hover:border-blue-500/40 bg-blue-500/10",
    glowClass: "shadow-[0_0_15px_#3b82f633]",
    specs: { battery: "101 kWh", range: "560 Km", hp: "650", tankVolume: 0 }
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz EQ",
    modelName: "EQS 580 SUV",
    brandColor: "#06b6d4", // Cyan
    accentClass: "text-cyan-500 border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-050/10",
    glowClass: "shadow-[0_0_15px_#06b6d433]",
    specs: { battery: "108 kWh", range: "610 Km", hp: "544", tankVolume: 0 }
  },
  {
    id: "porsche",
    name: "Porsche AG",
    modelName: "Taycan Turbo GT",
    brandColor: "#10b981", // Acid Emerald
    accentClass: "text-emerald-500 border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/10",
    glowClass: "shadow-[0_0_15px_#10b98133]",
    specs: { battery: "97 kWh", range: "555 Km", hp: "1092", tankVolume: 0 }
  }
];

// Initial High-Fidelity Seed refueling records
const INITIAL_RECORDS: RefuelingRecord[] = [
  {
    id: "REF-10024",
    plateNo: "กข-5678 กรุงเทพฯ",
    brand: "PTT Station",
    date: "2026-06-05",
    time: "10:15",
    totalPaid: 1650.00,
    liters: 42.10,
    pricePerLiter: 39.19,
    fuelType: "Gasohol 95",
    driverName: "สมชาย วงศ์ดี",
    station: "PTT Station วิภาวดี"
  },
  {
    id: "REF-10025",
    plateNo: "กข-5678 กรุงเทพฯ",
    brand: "Shell",
    date: "2026-06-05",
    time: "11:45",
    totalPaid: 1540.20,
    liters: 38.50,
    pricePerLiter: 40.00,
    fuelType: "Gasohol 95",
    driverName: "นงลักษณ์ สาลี",
    station: "Shell เชียงใหม่ ไฮเวย์"
  },
  {
    id: "REF-10026",
    plateNo: "กฉ-9012 นนทบุรี",
    brand: "Bangchak",
    date: "2026-06-03",
    time: "02:30",
    totalPaid: 950.00,
    liters: 27.60,
    pricePerLiter: 34.42,
    fuelType: "Gasohol E20",
    driverName: "วิชัย สุวรรณ",
    station: "บางจาก ติวานนท์"
  },
  {
    id: "REF-10027",
    plateNo: "กฉ-9012 นนทบุรี",
    brand: "Caltex",
    date: "2026-06-01",
    time: "16:20",
    totalPaid: 2950.00,
    liters: 85.00,
    pricePerLiter: 34.70,
    fuelType: "Diesel Premium",
    driverName: "วิชัย สุวรรณ",
    station: "Caltex งามวงศ์วาน"
  }
];

// Mock data for Fleet Pool vehicles
const FLEET_CARS: FleetVehicle[] = [
  { id: "car1", brand: "Toyota", model: "Hilux Revo Double Cab", plate: "1ขก 1234 กทม", type: "Pickup 4-Door", status: "available", mileage: 45210, condition: "Good", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80" },
  { id: "car2", brand: "Honda", model: "City e:HEV RS", plate: "2ขข 5678 กทม", type: "Sedan", status: "in_use", mileage: 12450, condition: "Excellent", imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80" },
  { id: "car3", brand: "Isuzu", model: "D-Max Spacecab", plate: "ฒศ 9012 นนท", type: "Pickup 2-Door", status: "available", mileage: 85300, condition: "Good", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80" },
  { id: "car4", brand: "Toyota", model: "Commuter", plate: "ฮภ 3456 กทม", type: "Van", status: "maintenance", mileage: 142000, condition: "Needs Service", imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80" },
  { id: "car5", brand: "Nissan", model: "Almera VL", plate: "3ขค 7890 กทม", type: "Sedan", status: "available", mileage: 23100, condition: "Excellent", imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80" },
  { id: "car6", brand: "MG", model: "EP Plus", plate: "4ขง 1122 กทม", type: "EV Wagon", status: "in_use", mileage: 34500, condition: "Good", imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80" },
  { id: "car7", brand: "Toyota", model: "Corolla Cross", plate: "5ขจ 3344 กทม", type: "SUV", status: "available", mileage: 15600, condition: "Excellent", imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80" },
  { id: "car8", brand: "Ford", model: "Ranger Wildtrak", plate: "6ขฉ 5566 กทม", type: "Pickup 4-Door", status: "maintenance", mileage: 67800, condition: "Repairing", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80" },
  { id: "car9", brand: "Toyota", model: "Yaris Ativ", plate: "7ขช 7788 กทม", type: "Sedan", status: "available", mileage: 8900, condition: "Like New", imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80" },
  { id: "car10", brand: "Mitsubishi", model: "Triton Mega Cab", plate: "8ขซ 9900 กทม", type: "Pickup 2-Door", status: "in_use", mileage: 54200, condition: "Good", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80" },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("smart_car_user");
  });

  const [activeBrand, setActiveBrand] = useState<CarBrand>(CAR_BRANDS[0]);
  const [activeTab, setActiveTab] = useState<"home" | "booking" | "fuel" | "maintenance">("home");
  const [activeHotspot, setActiveHotspot] = useState<"engine" | "tires" | "fuel" | null>(null);
  const [records, setRecords] = useState<RefuelingRecord[]>(() => {
    const saved = localStorage.getItem("smart_fuel_records");
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  // State Persistence
  useEffect(() => {
    localStorage.setItem("smart_fuel_records", JSON.stringify(records));
  }, [records]);

  // Current system clock
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smart Vehicle interactive states
  const [carSettings, setCarSettings] = useState({
    isLocked: true,
    climateTemp: 22,
    isClimateActive: false,
    hornAlert: false,
    chargePercent: 88,
    isCharging: false
  });

  // Parking Finder locator variables
  const [parkingSaved, setParkingSaved] = useState<boolean>(true);
  const [parkingCoords, setParkingCoords] = useState({
    landmark: "ห้างสรรพสินค้า เดอะมอลล์ งามวงศ์วาน",
    floor: "ชั้น 3A",
    slot: "เสา A15",
    time: "13:10 น."
  });
  const [locating, setLocating] = useState<boolean>(false);

  // Fuels Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFuelFilter, setSelectedFuelFilter] = useState("All");

  // Fuel details slip modal
  const [selectedRecord, setSelectedRecord] = useState<RefuelingRecord | null>(null);

  // Booking System Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingCar, setSelectedBookingCar] = useState<FleetVehicle | null>(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endDate: new Date().toISOString().split("T")[0],
    endTime: "18:00",
    purpose: "ประชุมงาน/พบลูกค้า",
    approver: ""
  });
  const todayStr = new Date().toISOString().split("T")[0];
  const isUrgentBooking = bookingForm.startDate <= todayStr;

  // Gate Pass & Inspection State
  const [isGatePassOpen, setIsGatePassOpen] = useState(false);
  const [isInspectionUploaded, setIsInspectionUploaded] = useState(false);

  // Return Vehicle & OCR State
  const [isReturnVehicleOpen, setIsReturnVehicleOpen] = useState(false);
  const [returnForm, setReturnForm] = useState({
    odometer: FLEET_CARS[1].mileage + 45, // Simulate current mileage roughly
    postTripInspection: false,
    fuelReceiptUploaded: false,
    fuelScanningStatus: "IDLE" as "IDLE" | "SCANNING" | "COMPLETED",
    extractedLiters: 0,
    extractedPrice: 0,
  });

  // Scanning Modal Toggle
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanStep, setScanStep] = useState<"IDLE" | "SCANNING" | "COMPLETED">("IDLE");
  const [scannedData, setScannedData] = useState<Partial<RefuelingRecord>>({});

  // Trigger Mock GPS location
  const handleParkTracking = () => {
    setLocating(true);
    setTimeout(() => {
      setParkingCoords({
        landmark: "เดโป้ ลานจอดรถกองรถภาคกลาง P1",
        floor: "ลานกลางแจ้ง",
        slot: "ริเวอร์ไซด์ โซน C",
        time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น."
      });
      setParkingSaved(true);
      setLocating(false);
    }, 1200);
  };

  // Switch Charging Simulator timer
  useEffect(() => {
    let chargeTimer: any;
    if (carSettings.isCharging && carSettings.chargePercent < 100) {
      chargeTimer = setInterval(() => {
        setCarSettings(prev => ({
          ...prev,
          chargePercent: Math.min(100, prev.chargePercent + 1)
        }));
      }, 4000);
    }
    return () => clearInterval(chargeTimer);
  }, [carSettings.isCharging, carSettings.chargePercent]);

  // Dismiss horn simulator
  useEffect(() => {
    if (carSettings.hornAlert) {
      const timer = setTimeout(() => {
        setCarSettings(prev => ({ ...prev, hornAlert: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [carSettings.hornAlert]);

  // Statistics calculation helpers
  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.plateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fuelType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFuel = selectedFuelFilter === "All" || r.fuelType.toLowerCase().includes(selectedFuelFilter.toLowerCase());

    return matchesSearch && matchesFuel;
  });

  const totalSpent = filteredRecords.reduce((sum, r) => sum + r.totalPaid, 0);
  const totalLiters = filteredRecords.reduce((sum, r) => sum + r.liters, 0);
  const avgPricePerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0;

  // Process Mock Fuel Receipt Scanning OCR animation
  const handleStartOcrScan = () => {
    setScanStep("SCANNING");
    setTimeout(() => {
      // Generated values randomly inspired by real stations in Thailand
      const stations = ["PTT Station ราษฎร์บูรณะ", "เชลล์ พระราม 3", "บางจาก บายพาส", "คาลเท็กซ์ ประชาชื่น"];
      const fuels = ["Gasohol 95", "Gasohol 91", "Gasohol E20", "Diesel Premium"];
      const randomStation = stations[Math.floor(Math.random() * stations.length)];
      const randomFuel = fuels[Math.floor(Math.random() * fuels.length)];
      const priceL = parseFloat((35 + Math.random() * 6).toFixed(2));
      const litersFilled = parseFloat((30 + Math.random() * 25).toFixed(2));
      const pay = parseFloat((litersFilled * priceL).toFixed(2));

      setScannedData({
        id: "REF-" + Math.floor(10000 + Math.random() * 90000),
        plateNo: activeBrand.id === "tesla" ? "กข-5678 กรุงเทพฯ" : "กฉ-9012 นนทบุรี",
        brand: randomStation.includes("PTT") ? "PTT Station" : randomStation.includes("เชลล์") ? "Shell" : randomStation.includes("บางจาก") ? "Bangchak" : "Caltex",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        totalPaid: pay,
        liters: litersFilled,
        pricePerLiter: priceL,
        fuelType: randomFuel,
        driverName: currentUser ? currentUser.split("@")[0] : "คนขับสมาร์ท",
        station: randomStation
      });
      setScanStep("COMPLETED");
    }, 2800);
  };

  // Save parsed receipt scanned entry
  const handleSaveScannedReceipt = () => {
    if (scannedData.id) {
      setRecords(prev => [scannedData as RefuelingRecord, ...prev]);
      setIsScannerOpen(false);
      setScanStep("IDLE");
      setScannedData({});
      setActiveTab("fuel"); // Instantly redirect to the fuel tab to show the premium receipt block!
    }
  };

  // Delete Record Handlers
  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("ยืนยันการลบประวัติการเติมน้ำมันรายการนี้?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smart_car_user");
    setCurrentUser(null);
  };

  // Gate check if biometric lock state is active
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#030408] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Futuristic Grid & Abstract Radial Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#11131f_1px,transparent_1px),linear-gradient(to_bottom,#11131f_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="z-10 w-full max-w-sm">
          <BiometricScan
            onUnlockCompleted={(email) => setCurrentUser(email)}
            brandColor={activeBrand.brandColor}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Absolute Atmospheric Dynamic Ambient Behind Wall */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-[130px] transition-all duration-1000 pointer-events-none"
        style={{ backgroundColor: activeBrand.brandColor }}
      />

      {/* Main Canvas Wrapping Grid */}
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-12 min-h-[90vh] relative">
        
        <div className="flex flex-col items-center w-full max-w-md shrink-0">
          {/* Desktop Wrapper Layout Info banner */}
          <div className="hidden lg:flex flex-col items-center mb-5 text-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full uppercase">
              Mobile-First Progressive Web App (PWA)
            </span>
            <h1 className="text-2xl font-black text-slate-100 mt-2 font-display">
              Smart Garage & Fuel Log
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              จำลองหน้าจอมือถือสเกลจริง ควบคุมรถ ค้นหาที่จอด ตรวจเช็กระบบแบตเตอรี่ และบันทึก/สแกนบิลน้ำมันด้วย AI
            </p>
          </div>

          {/* PHYSICAL SMARTPHONE DEVICE FRAME SIMULATOR (Intelligently shrinks to full screen on real mobile phones!) */}
          <div className="w-full max-w-md bg-slate-950 border border-slate-800/80 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col h-[820px] ring-12 ring-slate-900/60 transition-transform duration-300 z-10">
          
          {/* Dynamic Island / Notch Element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-50 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-950 ml-1.5 border border-blue-900" />
          </div>

          {/* Smartphone Top Notch Header info block */}
          <div className="bg-slate-950/90 pt-3 px-6 pb-2 flex justify-between items-center text-[11px] font-mono text-slate-400 border-b border-slate-900/40 select-none z-30 shrink-0">
            {/* Time Ticker */}
            <span className="font-bold text-slate-200 mt-0.5">{currentTime || "12:00"}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850 font-sans tracking-wide font-black text-emerald-400">
                PWA LIVE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <BatteryCharging size={11} className={`${carSettings.isCharging ? "text-emerald-400 animate-bounce" : "text-slate-400"}`} />
              <span className="font-bold">{carSettings.chargePercent}%</span>
            </div>
          </div>

          {/* Smartphone Soft App Header */}
          <div className="p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 flex justify-between items-center z-30 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center shadow-lg transition-colors duration-700"
                style={{ borderColor: `${activeBrand.brandColor}30` }}
              >
                <Car style={{ color: activeBrand.brandColor }} size={15} />
              </div>
              <div>
                <span className="text-[8.5px] uppercase font-mono text-slate-500 tracking-wider block">
                  VEHICLE ACCESS
                </span>
                <span className="text-xs font-bold text-slate-200 block -mt-0.5">
                  {currentUser ? currentUser.split("@")[0] : "Driver Mode"}
                </span>
              </div>
            </div>

            {/* Quick Connected alert notifier */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleLogout}
                title="ออกจากการเข้ารหัสระบบ"
                className="p-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer transition active:scale-95"
              >
                <LogOut size={10} />
                LOGOUT
              </button>
            </div>
          </div>

          {/* INTERNAL CONTENT OF SWITCHABLE MOBILE VIEWS (SCROLLABLE CONTAINER) */}
          <div className="flex-1 overflow-y-auto bg-[#06070c] relative pb-20 scroll-smooth">
            
            {/* View 1: หน้าหลักโรงรถ (Home/Garage Tab) */}
            {activeTab === "home" && (
              <div className="p-5 space-y-6">
                
                {/* 1. Header Section: Greeting & Quick Actions */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 mt-2 font-display">
                       สวัสดี, {currentUser ? currentUser.split("@")[0] : "คนรักรถ"} 👋
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">
                      ยินดีต้อนรับกลับสู่ระบบการจัดการรถของคุณ
                    </p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setScanStep("IDLE");
                        setScannedData({});
                        setIsScannerOpen(true);
                      }}
                      className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all rounded-[1.25rem] p-4 flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg shadow-black/50 active:scale-95 transition-transform duration-150"
                    >
                      <div className="w-12 h-12 rounded-full bg-cyan-950/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_#22d3ee40] transition-all duration-300">
                        <Droplet size={22} fill="currentColor" className="opacity-80" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 tracking-wide">เติมน้ำมัน</span>
                    </button>

                    <button className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all rounded-[1.25rem] p-4 flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg shadow-black/50 active:scale-95 transition-transform duration-150">
                      <div className="w-12 h-12 rounded-full bg-amber-950/40 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_#fbbf2440] transition-all duration-300">
                        <Wrench size={22} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 tracking-wide">ซ่อมบำรุง</span>
                    </button>
                  </div>
                </div>

                {/* 2. Active Vehicle Section */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Car size={14} />
                      </div>
                      รถที่คุณกำลังใช้งาน
                    </h3>
                  </div>

                  {/* Active Car Card */}
                  <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl relative overflow-hidden shadow-xl shadow-black/60">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/15 blur-[40px] rounded-full pointer-events-none" />
                    
                    {/* Car Image Header */}
                    <div className="h-32 w-full relative">
                      <img 
                        src={FLEET_CARS[1].imageUrl} 
                        alt={`${FLEET_CARS[1].brand} ${FLEET_CARS[1].model}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-400 bg-slate-950/80 px-2 py-1 rounded-full border border-indigo-500/30 backdrop-blur-sm block uppercase">
                          ACTIVE VEHICLE
                        </span>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 relative z-10">
                      <div className="flex justify-between items-start mb-5">
                         <div>
                            <h4 className="text-lg font-black text-slate-100 tracking-tight font-display">{FLEET_CARS[1].brand} {FLEET_CARS[1].model}</h4>
                            <span className="text-xs text-slate-400">{FLEET_CARS[1].type}</span>
                         </div>
                      </div>
                      
                      <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/60 flex justify-between items-center mb-4 relative z-10 shadow-inner">
                         <div className="font-mono pl-1 text-left w-full">
                            <span className="text-[9px] text-slate-500 block leading-none mb-1.5 uppercase tracking-wider">ทะเบียนรถ</span>
                            <strong className="text-xs text-slate-200">{FLEET_CARS[1].plate}</strong>
                         </div>
                         <div className="w-px h-8 bg-slate-800 mx-2" />
                         <div className="font-mono pr-1 text-right w-full">
                            <span className="text-[9px] text-slate-500 block leading-none mb-1.5 uppercase tracking-wider">สถานะ</span>
                            <strong className="text-xs text-amber-400 flex items-center justify-end gap-1">
                              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                              </span>
                               กำลังใช้งาน
                            </strong>
                         </div>
                      </div>

                      <div className="space-y-2 relative z-10">
                        <button 
                          onClick={() => setIsGatePassOpen(true)}
                          className="w-full py-3 rounded-xl bg-cyan-600/20 text-[11px] font-bold tracking-wide text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150 cursor-pointer"
                        >
                          <QrCode size={16} />
                          แสดงใบนำรถออก (Digital Gate Pass)
                        </button>
                        <button 
                          onClick={() => setIsReturnVehicleOpen(true)}
                          className="w-full py-3 rounded-xl bg-slate-800/80 text-[11px] font-bold tracking-wide text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50 hover:border-slate-600 active:scale-95 transition-transform duration-150 cursor-pointer"
                        >
                          คืนรถ (Return Vehicle)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* View 2: หน้าค้นหารถว่าง (Booking Tab) */}
            {activeTab === "booking" && (
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-display">
                    <Key className="text-cyan-400" size={18} /> จองรถส่วนกลาง
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">เลือกรถที่ว่างเพื่อใช้งาน (Fleet Pool)</p>
                </div>
                
                <div className="space-y-3">
                  {FLEET_CARS.map(car => (
                    <div key={car.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden group">
                      <div className={`w-1 shrink-0 absolute left-0 top-0 bottom-0 ${
                        car.status === 'available' ? 'bg-emerald-500 text-emerald-400' :
                        car.status === 'in_use' ? 'bg-amber-500 text-amber-400' :
                        'bg-rose-500 text-rose-400'
                      }`} />
                      
                      <img 
                        src={car.imageUrl} 
                        alt={`${car.brand} ${car.model}`}
                        className="w-16 h-16 object-cover rounded-xl shadow-sm shrink-0 border border-slate-800"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-200 truncate pr-2">{car.brand} {car.model}</h4>
                          <span className={`shrink-0 text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            car.status === 'available' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400' :
                            car.status === 'in_use' ? 'bg-amber-950/30 border-amber-500/40 text-amber-400' :
                            'bg-rose-950/30 border-rose-500/40 text-rose-400'
                          }`}>
                            <span className="relative flex h-1 w-1">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                car.status === 'available' ? 'bg-emerald-400' :
                                car.status === 'in_use' ? 'bg-amber-400' :
                                'bg-rose-400'
                              }`}></span>
                              <span className={`relative inline-flex rounded-full h-1 w-1 ${
                                car.status === 'available' ? 'bg-emerald-500' :
                                car.status === 'in_use' ? 'bg-amber-500' :
                                'bg-rose-500'
                              }`}></span>
                            </span>
                            {car.status === "available" ? "ว่าง" : car.status === "in_use" ? "ใช้งานอยู่" : "ซ่อมบำรุง"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>{car.plate}</span>
                            <span className="opacity-50">•</span>
                            <span>{car.type}</span>
                          </div>
                          
                          {car.status === "available" && (
                            <button 
                              onClick={() => {
                                setSelectedBookingCar(car);
                                setBookingForm(prev => ({ 
                                  ...prev, 
                                  startDate: todayStr, 
                                  endDate: todayStr,
                                  approver: "" 
                                }));
                                setIsBookingModalOpen(true);
                              }}
                              className="text-[9px] font-bold tracking-wider text-slate-950 bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded-full cursor-pointer active:scale-95 transition-transform duration-150"
                            >
                              กดจองใช้งาน
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: หน้าประวัติการเติมน้ำมัน (Fuel Tab) */}
            {activeTab === "fuel" && (
              <div className="p-4 space-y-4">
                
                {/* Visual stats dynamic micro panels */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-2xl relative shadow-inner">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">ยอดรวมสะสม</span>
                    <strong className="text-sm font-extrabold text-slate-100 block font-mono mt-0.5 text-ellipsis overflow-hidden">
                      ฿{totalSpent.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
                    </strong>
                    <span className="text-[7.5px] font-mono text-slate-500 block -mt-0.5">รวมของบิลทั้งหมด</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-2xl relative shadow-inner">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">จำนวนพลังงาน</span>
                    <strong className="text-sm font-extrabold text-slate-100 block font-mono mt-0.5">
                      {totalLiters.toFixed(1)} L
                    </strong>
                    <span className="text-[7.5px] font-mono text-slate-500 block -mt-0.5">ปริมาณลิตรสะสม</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-2xl relative shadow-inner">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">เฉลี่ยต่อหน่วย</span>
                    <strong className="text-sm font-extrabold text-slate-100 block font-mono mt-0.5">
                      ฿{avgPricePerLiter.toFixed(2)}
                    </strong>
                    <span className="text-[7.5px] font-mono text-slate-500 block -mt-0.5">ราคาน้ำมันเฉลี่ย/ลิตร</span>
                  </div>
                </div>

                {/* Real-time filters widget */}
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-900/80 space-y-2.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="ค้นหาชื่อปั๊ม, ทะเบียนรถ, พนักงานขับรถ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Horizontal slider for Fuel class quick types */}
                  <div className="flex gap-1 overflow-x-auto pb-0.5">
                    {["All", "Gasohol 95", "Gasohol 91", "E20", "Diesel"].map((fuelFilter) => {
                      const isSelected = selectedFuelFilter === fuelFilter;
                      return (
                        <button
                          key={fuelFilter}
                          onClick={() => setSelectedFuelFilter(fuelFilter)}
                          className={`px-3 py-1 shrink-0 rounded-lg text-[9px] uppercase font-bold tracking-wider transition ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                              : 'bg-slate-900 border border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {fuelFilter}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add dynamic record button */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    ประวัติรายละเอียด ({filteredRecords.length})
                  </span>
                  <button
                    onClick={() => {
                      setScanStep("IDLE");
                      setScannedData({});
                      setIsScannerOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-full font-bold cursor-pointer hover:bg-cyan-950 active:scale-95 transition-transform duration-150"
                  >
                    <PlusCircle size={12} />
                    สแกนใบเสร็จด้วย AI
                  </button>
                </div>

                {/* Refuel chronological items feed list */}
                {filteredRecords.length === 0 ? (
                  <div className="bg-slate-950 p-8 text-center rounded-3xl border border-slate-900 text-slate-500 font-mono text-xs">
                    <AlertCircle size={20} className="mx-auto text-slate-600 mb-2" />
                    ไม่พบข้อมูลธุรกรรมประวัติใบเสร็จที่ค้นหา
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredRecords.map((item) => {
                      // Custom brand logos/colors mapping
                      const isPtt = item.brand.toLowerCase().includes("ptt");
                      const isShell = item.brand.toLowerCase().includes("shell");
                      const isBangchak = item.brand.toLowerCase().includes("bangchak") || item.brand.includes("บางจาก");
                      
                      const brandColor = isPtt 
                        ? "border-blue-500/20 bg-blue-500/5 text-blue-400" 
                        : isShell 
                        ? "border-red-500/20 bg-red-500/5 text-red-400" 
                        : isBangchak 
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                        : "border-amber-500/20 bg-amber-500/5 text-amber-400";

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedRecord(item)}
                          className={`p-3.5 rounded-2xl border bg-slate-950/70 hover:bg-slate-900/50 transition cursor-pointer flex justify-between items-center gap-3 relative overflow-hidden group ${brandColor}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Brand Badge Icon */}
                            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-inner">
                              {isPtt ? "PTT" : isShell ? "SHL" : isBangchak ? "BCP" : "CTX"}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-mono text-slate-500 block leading-none">
                                {item.id} • {item.plateNo}
                              </span>
                              <strong className="text-xs text-slate-200 block truncate font-black tracking-tight mt-1">
                                {item.station}
                              </strong>
                              <span className="text-[9.5px] text-slate-400 block font-mono mt-0.5">
                                {item.fuelType} • <strong>{item.liters.toFixed(1)} ลิตร</strong> @ ฿{item.pricePerLiter.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[9px] text-slate-500 block font-mono">
                              {item.date}
                            </span>
                            <strong className="text-sm font-black font-mono text-slate-100 block mt-0.5">
                              ฿{item.totalPaid.toLocaleString("th-TH")}
                            </strong>
                            <div className="flex items-center gap-1.5 justify-end mt-1">
                              {/* Quick delete trigger */}
                              <button
                                onClick={(e) => handleDeleteRecord(item.id, e)}
                                className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                                title="ลบข้อมูลใบเสร็จ"
                              >
                                <Trash2 size={10} />
                              </button>
                              <ChevronRight size={12} className="text-slate-600 group-hover:text-slate-400 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* View 4: 3D Diagnostic & Maintenance Hub (Sci-Fi / JARVIS style) */}
            {activeTab === "maintenance" && (
              <main className="flex-1 overflow-y-auto bg-[#02040a] relative font-sans pb-24">
                
                {/* Background Grid & FX */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(8,145,178,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-900/20 blur-[80px] rounded-full pointer-events-none" />
                
                {/* Top HUD Header */}
                <div className="pt-12 pb-4 px-6 relative z-10 flexitems-center justify-between border-b border-cyan-900/50 bg-[#02040a]/80 backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-[0.3em] text-cyan-500 uppercase flex items-center gap-2">
                       <Activity size={10} className="animate-pulse" />
                       System Diagnostics
                    </span>
                    <h2 className="text-xl font-black text-slate-100 font-display tracking-tight flex items-center gap-2">
                      <Cpu size={18} className="text-cyan-400" />
                      MAINTENANCE HUB
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-cyan-900/50 flex items-center justify-center bg-cyan-950/20">
                     <div className="text-[10px] font-mono font-bold text-cyan-400 animate-pulse">98%</div>
                  </div>
                </div>

                {/* 3D Visualizer Area (Simulation) */}
                <div className="flex-1 relative min-h-[300px] flex items-center justify-center px-4">
                  {/* Note: In a real app, <Canvas> from @react-three/fiber goes here */}
                  <div className="absolute top-4 left-4 text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest border border-cyan-900/30 px-2 py-1 rounded bg-cyan-950/10">
                    [@react-three/fiber canvas placeholder]
                  </div>

                  {/* Wireframe/Hologram visual mockup using current vehicle */}
                  <div className="relative w-full max-w-[280px] aspect-[4/3] flex items-center justify-center mt-4">
                     {/* Scanning Ring */}
                     <div className="absolute inset-0 rounded-full border border-cyan-900/40 animate-[spin_10s_linear_infinite]" />
                     <div className="absolute inset-4 rounded-full border border-dashed border-cyan-800/30 animate-[spin_15s_linear_infinite_reverse]" />
                     
                     {/* Base holographic platform */}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 md:w-64 md:h-12 border-2 border-cyan-900/50 rounded-[100%] rounded-t-none bg-cyan-950/30 blur-sm transform scale-y-50" />
                     
                     <img 
                       src={FLEET_CARS[1].imageUrl} 
                       className="w-full h-auto object-cover opacity-80 mix-blend-screen drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                       style={{ filter: 'grayscale(100%) sepia(100%) hue-rotate(150deg) saturate(300%) contrast(1.2)' }}
                       referrerPolicy="no-referrer"
                     />
                     
                     {/* HOTSPOTS (Interactive 3D points) */}
                     {/* 1. Engine Hotspot */}
                     <button 
                       onClick={() => setActiveHotspot(activeHotspot === 'engine' ? null : 'engine')}
                       className={`absolute top-[35%] left-[25%] flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20 group transition-all ${activeHotspot === 'engine' ? 'scale-125' : 'hover:scale-110'}`}
                     >
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-black/50 backdrop-blur-sm ${activeHotspot === 'engine' ? 'border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-cyan-900 text-cyan-600'}`}>
                         <Wrench size={14} />
                       </div>
                       <div className={`absolute -inset-2 rounded-full border ${activeHotspot === 'engine' ? 'border-cyan-400 animate-ping opacity-50' : 'border-transparent'}`} />
                     </button>

                     {/* 2. Fuel Cap Hotspot */}
                     <button 
                       onClick={() => setActiveHotspot(activeHotspot === 'fuel' ? null : 'fuel')}
                       className={`absolute top-[40%] right-[15%] flex flex-col items-center justify-center translate-x-1/2 -translate-y-1/2 z-20 group transition-all ${activeHotspot === 'fuel' ? 'scale-125' : 'hover:scale-110'}`}
                     >
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-black/50 backdrop-blur-sm ${activeHotspot === 'fuel' ? 'border-rose-400 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'border-rose-900/50 text-rose-700'}`}>
                         <Droplet size={14} />
                       </div>
                       <div className={`absolute -inset-2 rounded-full border ${activeHotspot === 'fuel' ? 'border-rose-400 animate-ping opacity-50' : 'border-transparent'}`} />
                     </button>

                     {/* 3. Tires Hotspot */}
                     <button 
                       onClick={() => setActiveHotspot(activeHotspot === 'tires' ? null : 'tires')}
                       className={`absolute bottom-[20%] left-[30%] flex flex-col items-center justify-center -translate-x-1/2 translate-y-1/2 z-20 group transition-all ${activeHotspot === 'tires' ? 'scale-125' : 'hover:scale-110'}`}
                     >
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-black/50 backdrop-blur-sm ${activeHotspot === 'tires' ? 'border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'border-amber-900/50 text-amber-600'}`}>
                         <Target size={14} />
                       </div>
                       <div className={`absolute -inset-2 rounded-full border ${activeHotspot === 'tires' ? 'border-amber-400 animate-ping opacity-50' : 'border-transparent'}`} />
                     </button>
                  </div>
                  
                  {/* Active Hotspot HUD Data Panel */}
                  {activeHotspot && (
                    <div className="absolute inset-x-6 top-1/2 p-4 bg-slate-950/90 border border-cyan-800 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(8,145,178,0.15)] z-30 animate-fade-in mt-14">
                      {activeHotspot === 'engine' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyan-900/50 text-cyan-400">
                             <Cpu size={16} />
                             <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Engine Health</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                               <span className="text-[9px] text-slate-500 uppercase font-mono block">Last Service</span>
                               <span className="text-xs text-slate-200 font-bold">15/05/2026</span>
                            </div>
                            <div>
                               <span className="text-[9px] text-slate-500 uppercase font-mono block">Next Oil Change</span>
                               <span className="text-xs text-amber-400 font-bold font-mono">in 4,500 km</span>
                            </div>
                            <div className="col-span-2 bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-2 flex items-center gap-2 mt-1">
                               <CheckCircle size={14} className="text-emerald-500" />
                               <span className="text-[10px] font-mono text-emerald-400">STATUS: OPTIMAL</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeHotspot === 'tires' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/50 text-amber-400">
                             <Crosshair size={16} />
                             <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Tire Pressure</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                             <div className="text-center bg-slate-900 border border-amber-900/30 p-2 rounded-lg flex-1 mr-2">
                               <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Front</span>
                               <span className="text-sm text-slate-200 font-black font-mono">32 <span className="text-[9px] text-slate-500">PSI</span></span>
                             </div>
                             <div className="text-center bg-slate-900 border border-amber-900/30 p-2 rounded-lg flex-1 ml-2">
                               <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Rear</span>
                               <span className="text-sm text-slate-200 font-black font-mono">32 <span className="text-[9px] text-slate-500">PSI</span></span>
                             </div>
                          </div>
                          <p className="text-[9px] font-mono text-slate-400 italic">Tread wear is currently at 15%. Good condition.</p>
                        </div>
                      )}
                      
                      {activeHotspot === 'fuel' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-900/50 text-rose-400">
                             <Droplet size={16} />
                             <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Fuel System Analysis</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                               <span className="text-[9px] text-slate-500 uppercase font-mono block mb-1">Approved Fuel Type</span>
                               <span className="text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 font-bold font-mono">E20 / GASOHOL 95</span>
                            </div>
                            <div className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-2.5 flex items-start gap-2 mt-2">
                               <ShieldAlert size={14} className="text-rose-500 mt-0.5 shrink-0" />
                               <span className="text-[10px] font-mono text-rose-400 leading-tight block">WARNING: DO NOT use Diesel. Refueling mistake will cause catastrophic engine failure.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Maintenance Timeline Section */}
                <div className="flex-1 bg-slate-950 border-t border-cyan-900/30 rounded-t-3xl min-h-[40vh] p-6 relative z-20">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-800 rounded-full" />
                   
                   <h3 className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-bold mb-4 flex items-center gap-2">
                     <Calendar size={13} />
                     Maintenance Timeline
                   </h3>
                   
                   <div className="space-y-4">
                     {/* Upcoming Event (Yellow) */}
                     <div className="flex gap-4 relative">
                       <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-slate-800" />
                       <div className="w-6 h-6 rounded-full bg-amber-950 border-2 border-amber-500 flex items-center justify-center shrink-0 z-10">
                         <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]" />
                       </div>
                       <div className="bg-slate-900/80 border border-amber-900/30 p-3 rounded-2xl flex-1 cursor-pointer hover:bg-slate-900 transition border-l-[3px] border-l-amber-500">
                         <div className="flex justify-between items-start mb-1">
                           <strong className="text-xs text-amber-500 font-bold uppercase tracking-wider">Upcoming: ต่อ พ.ร.บ. / ภาษีรถยนต์</strong>
                           <span className="text-[10px] text-slate-500 font-mono">Due: in 14 days</span>
                         </div>
                         <p className="text-[10px] text-slate-400">หมดอายุวันที่ 20 มิ.ย. 2026 - โปรดส่งรถเข้าเช็คสภาพที่สำนักงานใหญ่</p>
                       </div>
                     </div>

                     {/* Upcoming Event (Green) */}
                     <div className="flex gap-4 relative">
                       <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-slate-800" />
                       <div className="w-6 h-6 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center shrink-0 z-10">
                         <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                       </div>
                       <div className="bg-slate-900/80 border border-emerald-900/30 p-3 rounded-2xl flex-1 cursor-pointer hover:bg-slate-900 transition border-l-[3px] border-l-emerald-500">
                         <div className="flex justify-between items-start mb-1">
                           <strong className="text-xs text-emerald-500 font-bold uppercase tracking-wider">สลับยาง / ถ่วงล้อ</strong>
                           <span className="text-[10px] text-slate-500 font-mono">Due: in 2,500 km</span>
                         </div>
                         <p className="text-[10px] text-slate-400">ครบกำหนดสลับยางรอบถัดไปสำหรับระยะ 20,000 km</p>
                       </div>
                     </div>

                     {/* History Event (Gray) */}
                     <div className="flex gap-4 relative">
                       <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shrink-0 z-10">
                         <CheckCircle2 size={12} className="text-slate-500" />
                       </div>
                       <div className="bg-slate-900/40 border border-slate-800/50 p-3 rounded-2xl flex-1 border-l-[3px] border-l-slate-700 opacity-60">
                         <div className="flex justify-between items-start mb-1">
                           <strong className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed: เปลี่ยนถ่ายน้ำมันเครื่อง</strong>
                           <span className="text-[10px] text-slate-600 font-mono">15/05/2026</span>
                         </div>
                         <p className="text-[10px] text-slate-500">ดำเนินการเรียบร้อยโดยศูนย์บริการ (B-Quik)</p>
                       </div>
                     </div>
                   </div>
                </div>

              </main>
            )}

          </div>

          {/* BOTTOM PWA NAVIGATION TABS BAR */}
          <div className="absolute bottom-0 left-0 right-0 h-[72px] pb-2 bg-slate-950/95 backdrop-blur-xl border-t border-slate-900/90 flex justify-around items-center px-2 z-40 select-none shrink-0">
            
            {/* Tab 1: หน้าหลัก */}
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl gap-1 cursor-pointer w-16 active:scale-95 transition-transform duration-150 ${
                activeTab === "home" 
                  ? "text-cyan-400 -translate-y-1" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Home size={22} className={activeTab === "home" ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} />
              <span className="text-[9px] font-bold tracking-wide">หน้าหลัก</span>
            </button>

            {/* Tab 2: จองรถ */}
            <button
              onClick={() => setActiveTab("booking")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl gap-1 cursor-pointer w-16 active:scale-95 transition-transform duration-150 ${
                activeTab === "booking" 
                  ? "text-cyan-400 -translate-y-1" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Key size={22} className={activeTab === "booking" ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} />
              <span className="text-[9px] font-bold tracking-wide">จองรถ</span>
            </button>
            
            {/* Tab 3: เติมน้ำมัน */}
            <button
              onClick={() => setActiveTab("fuel")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl gap-1 cursor-pointer w-16 active:scale-95 transition-transform duration-150 ${
                activeTab === "fuel" 
                  ? "text-cyan-400 -translate-y-1" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Droplet size={22} className={activeTab === "fuel" ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} />
              <span className="text-[9px] font-bold tracking-wide">เติมน้ำมัน</span>
            </button>

            {/* Tab 4: ซ่อมบำรุง */}
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl gap-1 cursor-pointer w-16 active:scale-95 transition-transform duration-150 ${
                activeTab === "maintenance" 
                  ? "text-cyan-400 -translate-y-1" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Wrench size={22} className={activeTab === "maintenance" ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} />
              <span className="text-[9px] font-bold tracking-wide">ซ่อมบำรุง</span>
            </button>

          </div>

          {/* 2. DYNAMIC BOOKING FORM MODAL */}
          {isBookingModalOpen && selectedBookingCar && (
            <div className="absolute inset-0 bg-[#06070c]/95 backdrop-blur-xl z-[100] flex flex-col font-sans select-none animate-fade-in overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-800/60 bg-slate-950/80 shrink-0">
                <span className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                  <Key size={13} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                  แบบฟอร์มจองรถส่วนกลาง
                </span>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition active:scale-90"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Selected Car Profile Banner */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex items-center gap-4 shadow-inner">
                  <img src={selectedBookingCar.imageUrl} className="w-16 h-16 object-cover rounded-xl shadow-md border border-slate-700/50 block" referrerPolicy="no-referrer" />
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-slate-500 block uppercase">Selected Vehicle</span>
                    <h3 className="font-black text-[15px] text-slate-100 tracking-tight leading-tight mt-0.5">{selectedBookingCar.brand} {selectedBookingCar.model}</h3>
                    <span className="text-[11px] font-mono text-cyan-400 mt-0.5 block">{selectedBookingCar.plate}</span>
                  </div>
                </div>

                {/* Booking Form Dates */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-500" /> 
                      วันและเวลารับรถ (Start)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="date" 
                        value={bookingForm.startDate}
                        min={todayStr}
                        onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 outline-none w-full" 
                        style={{ colorScheme: 'dark' }} 
                      />
                      <input 
                        type="time" 
                        value={bookingForm.startTime}
                        onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 outline-none w-full text-center" 
                        style={{ colorScheme: 'dark' }} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-500" /> 
                      วันที่คาดว่าจะคืนรถ (End)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="date" 
                        value={bookingForm.endDate}
                        min={bookingForm.startDate}
                        onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 outline-none w-full" 
                        style={{ colorScheme: 'dark' }} 
                      />
                      <input 
                        type="time" 
                        value={bookingForm.endTime}
                        onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 outline-none w-full text-center" 
                        style={{ colorScheme: 'dark' }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Smart Logic Status */}
                {isUrgentBooking ? (
                  <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl flex items-start gap-3 shadow-inner">
                    <div className="p-1 rounded-full bg-rose-500/20 text-rose-500 mt-0.5 shrink-0">
                      <AlertTriangle size={15} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-rose-500 uppercase tracking-wide">ด่วน (Urgent Request)</h4>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">คุณเลือกระบุวันรับรถเป็น <strong className="text-slate-200">วันนี้</strong> โปรดระบุชื่อหัวหน้างานผู้อนุมัติเพื่อใช้ในการอ้างอิงคิวรถแทรก (Required)</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-3 shadow-inner">
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5 shrink-0">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">ทำรายการจองล่วงหน้าได้ (Advance)</h4>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">การจองล่วงหน้าแบบ Advance Booking รถยนต์จะถูกจัดคิวและเตรียมความพร้อม 1 วันก่อนถึงกำหนดรับรถ</p>
                    </div>
                  </div>
                )}

                {/* Approver Field (Conditional for Urgent) */}
                {isUrgentBooking && (
                  <div className="space-y-2.5 animate-fade-in border-l-2 border-rose-500 pl-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      ชื่อหัวหน้างานผู้อนุมัติ *
                    </label>
                    <input 
                      type="text" 
                      placeholder="ระบุชื่อหรือรหัสพนักงานผู้อนุมัติ..." 
                      value={bookingForm.approver}
                      onChange={(e) => setBookingForm({...bookingForm, approver: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 focus:border-rose-500 rounded-xl p-3.5 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                )}

                {/* Purpose Selection */}
                <div className="space-y-2.5 pb-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    วัตถุประสงค์การใช้งาน
                  </label>
                  <select 
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:border-cyan-500 outline-none appearance-none"
                  >
                    <option value="ประชุมงาน/พบลูกค้า">🤝 ประชุมงาน / พบปะลูกค้า</option>
                    <option value="ติดต่อสถานที่ราชการ">🏛️ ติดต่อสถานที่ราชการ</option>
                    <option value="ตรวจไซต์งาน/สาขา">🏗️ ตรวจดูไซต์งาน / สาขาต่างจังหวัด</option>
                    <option value="ขนส่งเอกสาร/พัสดุ">📦 ขนส่งเอกสาร หรือพัสดุ</option>
                    <option value="อื่นๆ">📝 อื่นๆ</option>
                  </select>
                </div>
              </div>

              {/* Sticky Footer Action Buttons */}
              <div className="p-4 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md flex gap-3 shrink-0">
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-32 py-3.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer active:scale-95 transition-transform duration-150"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={() => {
                    if (isUrgentBooking && !bookingForm.approver.trim()) {
                      alert("⚠️ กรุณาระบุชื่อผู้อนุมัติ สำหรับการจองด่วนภายในวันนี้");
                      return;
                    }
                    alert(`✅ ยืนยันการจองรถ ${selectedBookingCar.brand} สำเร็จ!\nหมายเลข Booking ระบุวันรับรถ: ${bookingForm.startDate}\nสถานะคิวถูกส่งตรงเข้าสู่ระบบส่วนกลางแล้ว`);
                    setIsBookingModalOpen(false);
                    setActiveTab("home");
                  }}
                  className={`flex-1 py-3.5 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shadow-lg cursor-pointer ${
                    isUrgentBooking && !bookingForm.approver.trim()
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30 active:scale-95 transition-transform duration-150"
                  }`}
                >
                  ยืนยันการจองรถ
                </button>
              </div>
            </div>
          )}

          {/* 3. DIGITAL GATE PASS TICKET MODAL */}
          {isGatePassOpen && (
            <div className="absolute inset-0 bg-[#06070c]/95 backdrop-blur-xl z-[100] flex flex-col font-sans select-none overflow-y-auto pb-10 hide-scrollbar pt-6 px-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-mono tracking-widest text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <QrCode size={13} className="text-slate-500" />
                  Digital Gate Pass
                </span>
                <button
                  onClick={() => setIsGatePassOpen(false)}
                  className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition active:scale-90"
                >
                  <X size={15} />
                </button>
              </div>

              {/* TICKET UI */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl relative mx-auto w-full max-w-sm flex flex-col mb-6 max-h-[72vh] overflow-y-auto hide-scrollbar">
                
                {/* Header / Approved Badge */}
                <div className="bg-emerald-950/20 px-6 py-5 border-b border-dashed border-slate-800 relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 block mb-1">STATUS</span>
                      <h2 className="text-xl font-black text-slate-100 tracking-tight font-display flex items-center gap-2">
                        APPROVED
                        <CheckCircle size={18} className="text-emerald-400" />
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono tracking-widest text-slate-500 block mb-1">TICKET NO.</span>
                      <strong className="text-sm font-mono text-slate-300">#GPX-8821</strong>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-6 space-y-5 bg-gradient-to-b from-slate-900/50 to-slate-950">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Driver Name</span>
                      <strong className="text-xs text-slate-200">{currentUser?.split("@")[0] || "Authorized Driver"}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Supervisor</span>
                      <strong className="text-xs text-slate-200">S. Chaiyawat</strong>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Approved Outbound Time</span>
                    <strong className="text-[13px] text-cyan-400 font-mono bg-cyan-950/30 px-2.5 py-1 rounded-md border border-cyan-900/50 inline-block">
                      {new Date().toLocaleDateString("th-TH")} • 09:00 AM
                    </strong>
                  </div>

                  {/* Vehicle Details */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center gap-4">
                    <img 
                      src={FLEET_CARS[1].imageUrl} 
                      className="w-16 h-16 object-cover rounded-xl shadow-md border border-slate-800 block shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-black text-sm text-slate-100 tracking-tight">{FLEET_CARS[1].brand} {FLEET_CARS[1].model}</h3>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5 uppercase tracking-wide">{FLEET_CARS[1].type}</span>
                      <span className="text-[11px] font-bold text-slate-300 mt-1.5 block bg-slate-900 px-2 py-0.5 rounded-md inline-block border border-slate-800">
                        {FLEET_CARS[1].plate}
                      </span>
                    </div>
                  </div>
                  
                  {/* Pre-trip Inspection Section */}
                  <div className="border border-slate-800 bg-slate-900/30 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
                       <Camera size={13} className="text-amber-400" />
                       บันทึกสภาพรถก่อนใช้งาน
                    </span>

                    {isInspectionUploaded ? (
                      <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
                        <div className="w-12 h-12 rounded-lg bg-emerald-900/30 flex items-center justify-center shrink-0 border border-emerald-500/40 text-emerald-400">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <strong className="text-[11px] text-emerald-400 block font-bold">บันทึกรูปภาพสำเร็จ</strong>
                          <span className="text-[9px] text-slate-400 font-mono mt-0.5">ระบบบันทึกหลักฐานสภาพรถเรียบร้อย ใช้งานรถได้ทันที</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                         <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                           กรุณาถ่ายรูปสภาพรถรอบคัน หรือจุดที่มีรอยตำหนิก่อนนำรถออก เพื่อเป็นหลักฐานป้องกันความรับผิดชอบ
                         </p>
                         <button 
                           onClick={() => {
                             // Mock camera delay
                             alert("เปิดใช้งานกล้องถ่ายรูป...");
                             setTimeout(() => setIsInspectionUploaded(true), 1500);
                           }}
                           className="w-full py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors flex justify-center items-center gap-2 cursor-pointer"
                         >
                           <Camera size={14} /> 📸 ถ่ายรูปรถ/บันทึกตำหนิ
                         </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* QR Code Section (Ticket Bottom) */}
                <div className="bg-slate-100 p-6 flex flex-col items-center justify-center relative border-t-2 border-dashed border-slate-300">
                  {/* Left/Right Cutouts for Ticket effect */}
                  <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#06070c] rounded-full" />
                  <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#06070c] rounded-full" />

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Gate Pass QR Code</span>
                  
                  {/* Mock QR generator (Visual only) */}
                  <div className="w-40 h-40 bg-white border-4 border-white shadow-sm flex items-center justify-center rounded-xl relative overflow-hidden group">
                     {/* QR Code Matrix Mockup */}
                     <QrCode size={140} className="text-slate-900 absolute" strokeWidth={1} />
                     <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,211,238,0.2)_50%,transparent_100%)] bg-[length:100%_150%] animate-pulse" />
                     {/* QR Center Logo */}
                     <div className="absolute bg-white rounded-md p-1 border border-slate-200">
                       <Car size={16} className="text-cyan-600" />
                     </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono text-center mt-4 px-4 leading-relaxed font-bold">
                    โปรดแสดงหน้านี้ให้พนักงานรักษาความปลอดภัย (รปภ.)<br/>สแกนยืนยัน ก่อนนำรถออกจากบริษัท
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. DYNAMIC RETURN VEHICLE MODAL */}
          {isReturnVehicleOpen && (
            <div className="absolute inset-0 bg-[#06070c]/95 backdrop-blur-xl z-[100] flex flex-col font-sans select-none overflow-hidden pb-safe">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-800/60 bg-slate-950/80 shrink-0">
                <span className="text-[11px] font-mono tracking-widest text-slate-300 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                  คืนรถส่วนกลาง (Vehicle Return)
                </span>
                <button
                  onClick={() => setIsReturnVehicleOpen(false)}
                  className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition active:scale-90"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Form */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* 1. Vehicle Information Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                       <Car size={14} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 font-display">1. ข้อมูลรถหลังใช้งาน (Return Details)</h3>
                  </div>
                  
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl space-y-5">
                    {/* Odometer Input */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        เลขไมล์ปัจจุบัน (Current Odometer) *
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={returnForm.odometer}
                          onChange={(e) => setReturnForm({...returnForm, odometer: Number(e.target.value)})}
                          className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-500 rounded-xl p-3.5 pr-10 text-sm font-mono text-slate-200 outline-none transition-all placeholder:text-slate-600"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">km</span>
                      </div>
                    </div>

                    {/* Post-trip Inspection */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">
                        สภาพรถหลังใช้งาน (Post-trip Inspection) *
                      </label>
                      {returnForm.postTripInspection ? (
                        <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
                          <img src={FLEET_CARS[1].imageUrl} className="w-10 h-10 object-cover rounded-lg border border-emerald-500/40 opacity-70" referrerPolicy="no-referrer" />
                          <div>
                            <strong className="text-[11px] text-emerald-400 block font-bold">บันทึกรูปภาพสำเร็จ</strong>
                            <span className="text-[9px] text-slate-400 font-mono mt-0.5">ระบบได้รับหลักฐานภาพถ่ายหลังใช้งานแล้ว</span>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            alert("เปิดใช้งานกล้องถ่ายรูป...");
                            setTimeout(() => setReturnForm({...returnForm, postTripInspection: true}), 1000);
                          }}
                          className="w-full py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[11px] font-bold text-amber-500 hover:bg-amber-500/20 transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-inner"
                        >
                          <Camera size={15} /> 📸 ถ่ายสภาพรถรอบคันหลังใช้งาน
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                {/* 2. Fuel OCR Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                       <FileText size={14} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 font-display">2. สแกนใบเสร็จน้ำมัน (Smart Fuel OCR)</h3>
                  </div>
                  
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl space-y-4 relative overflow-hidden">
                    {/* Simulated Scanner Glow on active scan */}
                    {returnForm.fuelScanningStatus === "SCANNING" && (
                      <div className="absolute inset-0 bg-cyan-500/5 animate-pulse z-0 pointer-events-none" />
                    )}

                    <div className="relative z-10 space-y-4">
                      {returnForm.fuelScanningStatus === "IDLE" && (
                        <button 
                          onClick={() => {
                            setReturnForm({...returnForm, fuelScanningStatus: "SCANNING", fuelReceiptUploaded: true});
                            // Simulate AI processing
                            setTimeout(() => {
                              setReturnForm(prev => ({
                                ...prev, 
                                fuelScanningStatus: "COMPLETED",
                                extractedLiters: 30.45,
                                extractedPrice: 1000.00
                              }));
                            }, 2500);
                          }}
                          className="w-full py-4 border-2 border-dashed border-cyan-800/50 bg-cyan-950/20 hover:bg-cyan-950/40 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform">
                            <Scan size={20} className="text-cyan-400" />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-bold text-cyan-400">อัปโหลด/ถ่ายรูปใบเสร็จเติมน้ำมัน</span>
                            <span className="block text-[9px] text-slate-500 font-mono mt-1">AI จะช่วยอ่านจำนวนลิตรและยอดเงินให้อัตโนมัติ</span>
                          </div>
                        </button>
                      )}

                      {returnForm.fuelScanningStatus === "SCANNING" && (
                        <div className="py-8 flex flex-col items-center justify-center gap-4">
                           <div className="relative w-16 h-16 flex items-center justify-center">
                             <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full" />
                             <div className="absolute inset-0 border-[3px] border-cyan-500 rounded-full border-t-transparent animate-spin" />
                             <ScanLine size={24} className="text-cyan-400 animate-pulse" />
                           </div>
                           <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 animate-pulse font-bold">
                             AI is extracting receipt details...
                           </span>
                        </div>
                      )}

                      {returnForm.fuelScanningStatus === "COMPLETED" && (
                         <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                              <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle size={16} />
                                <span className="text-[11px] font-bold">AI สกัดข้อมูลสำเร็จ</span>
                              </div>
                              <button 
                                onClick={() => setReturnForm({...returnForm, fuelScanningStatus: "IDLE", fuelReceiptUploaded: false})}
                                className="text-[9px] text-slate-500 underline"
                              >
                                แสกนใหม่
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                               <div className="space-y-2">
                                 <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">จำนวนลิตร (Liters)</label>
                                 <input 
                                   type="number"
                                   value={returnForm.extractedLiters}
                                   onChange={(e) => setReturnForm({...returnForm, extractedLiters: Number(e.target.value)})}
                                   className="w-full bg-slate-950 border border-cyan-900 focus:border-cyan-500 rounded-xl p-3 text-sm font-mono text-cyan-400 font-bold outline-none text-center shadow-inner"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">ยอดชำระ (Price THB)</label>
                                 <input 
                                   type="number"
                                   value={returnForm.extractedPrice}
                                   onChange={(e) => setReturnForm({...returnForm, extractedPrice: Number(e.target.value)})}
                                   className="w-full bg-slate-950 border border-cyan-900 focus:border-cyan-500 rounded-xl p-3 text-sm font-mono text-cyan-400 font-bold outline-none text-center shadow-inner"
                                 />
                               </div>
                            </div>
                            <p className="text-[9px] text-center text-amber-500/70 font-mono italic">
                              * กรุณาตรวจสอบตัวเลขอีกครั้ง สามารถแก้ไขได้หาก AI อ่านผิดพลาด
                            </p>
                         </div>
                      )}
                    </div>
                  </div>
                </section>
                
              </div>

              {/* Bottom Action Area */}
              <div className="p-4 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md shrink-0">
                <button 
                  disabled={!returnForm.postTripInspection}
                  onClick={() => {
                    alert("✅ ยืนยันการคืนรถสำเร็จ!\nระบบได้อัปเดตเลขไมล์ และบันทึกประวัติการบำรุงรักษา/ค่าใช้จ่ายน้ำมันเรียบร้อยแล้ว");
                    setIsReturnVehicleOpen(false);
                    setActiveTab("home");
                  }}
                  className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    !returnForm.postTripInspection 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none" 
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  {returnForm.postTripInspection ? "✅ ยืนยันการคืนรถและส่งข้อมูล" : "กรุณาถ่ายสภาพรถก่อนยืนยัน"}
                </button>
              </div>
            </div>
          )}

          {/* 1. SLIDE-UP DYNAMIC RECEIPT OCR SCANNER SCREEN LAYOUT */}
          {isScannerOpen && (
            <div className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 font-sans select-none animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                <span className="text-[10.5px] font-mono tracking-widest text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                  <Sparkles size={11} className="animate-pulse" />
                  AI SMART REAL-TIME OCR SCANNER
                </span>
                <button
                  onClick={() => setIsScannerOpen(false)}
                  className="p-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Middle View port depending on step */}
              {scanStep === "IDLE" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-cyan-400">
                    <Fuel size={30} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">จำลองการสแกนบิลเติมน้ำมัน</h3>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
                      หันกล้องมือถือไปที่ใบเสร็จรับเงินน้ำมันเพื่อให้อัลกอริทึมสกัดพิกัด, ชื่อปั๊ม, ข้อมูลน้ำมัน, ยอดลิตร, และราคาสุทธิแบบส่งตรงจากตัวโมเดล OCR
                    </p>
                  </div>
                  <button
                    onClick={handleStartOcrScan}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-full transition active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Cpu size={14} />
                    เริ่มสแกนด้วยกล้องจำลอง
                  </button>
                </div>
              )}

              {scanStep === "SCANNING" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                  
                  {/* Animating laser scan grid line element */}
                  <div className="absolute top-1/4 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-bounce z-10" />

                  <div className="w-48 h-64 border border-dashed border-cyan-500/30 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center font-mono text-[9px] text-slate-600 relative overflow-hidden shadow-inner">
                    <Fuel size={40} className="text-slate-800 animate-pulse" />
                    <span className="mt-3 uppercase block tracking-wider">ALIGN FUEL SLIP</span>
                    <span className="block mt-0.5">PTT / BANGCHAK / SHELL</span>
                  </div>

                  <div className="mt-5 space-y-1">
                    <span className="text-xs font-mono text-cyan-400 animate-pulse block">
                      กำลังวิเคราะห์อักขระ OCR โมเดล...
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      แยกพิกัดข้อมูลโครงข่ายปั๊มและภาษีมูลค่าเพิ่ม (VAT)
                    </span>
                  </div>
                </div>
              )}

              {scanStep === "COMPLETED" && (
                <div className="flex-1 flex flex-col overflow-y-auto py-3 space-y-3.5">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-2xl flex gap-2.5 items-center text-[11px] text-emerald-300">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <div>
                      <strong className="block font-bold">สกัดข้อมูลใบเสร็จน้ำมันถอดรหัสสำเร็จ!</strong>
                      ตรวจจับโครงข่ายภาษาไทยและยอดรวมราคาครบถ้วน
                    </div>
                  </div>

                  {/* Form fields showing parsed results (Editable) */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-3">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block border-b border-slate-900 pb-1.5 font-bold">
                      ผลการจำแนกข้อมูล (ปรับแต่งได้เพิ่มเติม)
                    </span>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[9.5px] font-mono text-slate-400 block mb-1">ชื่อปั๊ม / สถานี</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-slate-200"
                          value={scannedData.station || ""}
                          onChange={e => setScannedData(prev => ({ ...prev, station: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-[9.5px] font-mono text-slate-400 block mb-1">ประเภทน้ำมัน / พลังงาน</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-slate-200"
                          value={scannedData.fuelType || ""}
                          onChange={e => setScannedData(prev => ({ ...prev, fuelType: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[9.5px] font-mono text-slate-400 block mb-1">ปริมาณเติม (ลิตร)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-slate-200"
                          value={scannedData.liters || 0}
                          onChange={e => {
                            const lit = parseFloat(e.target.value) || 0;
                            setScannedData(prev => ({
                              ...prev,
                              liters: lit,
                              totalPaid: parseFloat((lit * (prev.pricePerLiter || 0)).toFixed(2))
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[9.5px] font-mono text-slate-400 block mb-1">ราคาต่อลิตร (บาท)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-slate-200"
                          value={scannedData.pricePerLiter || 0}
                          onChange={e => {
                            const prc = parseFloat(e.target.value) || 0;
                            setScannedData(prev => ({
                              ...prev,
                              pricePerLiter: prc,
                              totalPaid: parseFloat(((prev.liters || 0) * prc).toFixed(2))
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 border-t border-slate-900 pt-3">
                      <div>
                        <label className="text-[9.5px] font-mono text-slate-400 block mb-1">รวมจ่ายชำระเงิน (บาท)</label>
                        <strong className="text-base text-cyan-400 font-mono">
                          ฿{scannedData.totalPaid?.toLocaleString("th-TH") || "0.00"}
                        </strong>
                      </div>
                      <div>
                        <label className="text-[9.5px] font-mono text-slate-400 block mb-1">ทะเบียนรถควบคุม</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-slate-200 font-bold"
                          value={scannedData.plateNo || ""}
                          onChange={e => setScannedData(prev => ({ ...prev, plateNo: e.target.value }))}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStartOcrScan}
                      className="flex-1 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs py-2 rounded-xl"
                    >
                      ลองสแกนอีกรอบ
                    </button>
                    <button
                      onClick={handleSaveScannedReceipt}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2 rounded-xl cursor-pointer shadow"
                    >
                      บันทึกรายการลงประวัติ
                    </button>
                  </div>
                </div>
              )}

              {/* Back to main controls footings */}
              <div className="pt-2 border-t border-slate-900 text-center select-none">
                <span className="text-[8.5px] font-mono text-slate-600 block">
                  GENUINE ENGINE • POWERED BY CLOUD INTEGRATION OCR
                </span>
              </div>
            </div>
          )}

          {/* 2. DYNAMIC DETAILS RECEIPT SLIP TEAR-OFF TICKET MODAL */}
          {selectedRecord && (
            <div className="absolute inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-fade-in select-none">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                
                {/* Physical Ticket style background wrapper */}
                <div className="bg-white text-slate-900 p-5 font-mono text-xs space-y-4 relative mx-4 mt-5 rounded-t-2xl shadow-lg border-b-2 border-dashed border-slate-300">
                  <div className="text-center font-bold">
                    <h4 className="text-[13px] font-black tracking-tight leading-none">FUELING RECEIPT STATEMENT</h4>
                    <span className="text-[9px] text-slate-500 block uppercase font-mono mt-0.5">Smart Telematics Ledger</span>
                    <span className="text-[8px] text-slate-400 block mt-0.5">TAX REGISTER: #0105562026111</span>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-slate-700 pt-3 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>Receipt ID:</span>
                      <strong className="font-bold">{selectedRecord.id}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Station:</span>
                      <strong className="font-bold text-slate-900">{selectedRecord.station}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Refuel Date/Time:</span>
                      <strong className="font-bold">{selectedRecord.date} {selectedRecord.time}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver Registered:</span>
                      <strong className="font-bold">{selectedRecord.driverName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle Plate:</span>
                      <strong className="font-bold">{selectedRecord.plateNo}</strong>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3 text-[10.5px]">
                    <div className="flex justify-between">
                      <span>Fuel Code:</span>
                      <span>{selectedRecord.fuelType}</span>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span>Liters Litre Index:</span>
                      <span>{selectedRecord.liters.toFixed(2)} L</span>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span>Pump Cost Rate / L:</span>
                      <span>฿{selectedRecord.pricePerLiter.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-double border-slate-400 pt-2.5 flex justify-between items-end">
                    <span className="text-[11px] font-black text-slate-800">TOTAL PAID CHG (THB)</span>
                    <strong className="text-lg font-black text-slate-950 font-mono leading-none">
                      ฿{selectedRecord.totalPaid.toFixed(2)}
                    </strong>
                  </div>

                  {/* Simulated standard receipt barcode for realistic visual appearance */}
                  <div className="flex flex-col items-center pt-3 select-none">
                    <div className="h-7 w-full bg-[repeating-linear-gradient(90deg,currentColor,currentColor_1px,transparent_1px,transparent_4px)] text-slate-800" />
                    <span className="text-[8px] text-slate-400 block mt-1 tracking-widest">{selectedRecord.id}-00918-B</span>
                  </div>
                </div>

                {/* Simulated Tear Off jagged bottom pattern widget */}
                <div className="relative mx-4 h-3 bg-white overflow-hidden flex select-none shrink-0 rounded-b-2xl shadow-md">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,#0f172a_45%,#0f172a_55%,transparent_55%),linear-gradient(45deg,transparent_45%,#0f172a_45%,#0f172a_55%,transparent_55%)] bg-[size:10px_10px] [background-position:0_bottom] opacity-20" />
                </div>

                {/* Action buttons inside detail popover modal */}
                <div className="p-4 flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer size={13} />
                    ดาวน์โหลด PDF
                  </button>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="flex-1 bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs py-2.5 rounded-xl text-center cursor-pointer"
                  >
                    ตกลง ปิดหน้านี้
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
        </div>

        {/* Admin Dashboard Report on Desktop (Side-by-side) */}
        <div className="hidden xl:flex flex-1 w-full h-full max-h-[880px] z-10">
          <TripSummaryReport fleetCars={FLEET_CARS} records={records} brandColor={activeBrand.brandColor} />
        </div>

      </div>

    </div>
  );
}
