import React, { useState } from "react";
import { RefuelingRecord, FleetVehicle } from "../types";
import { 
  Building2, 
  Search, 
  Filter, 
  ChevronDown, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  Camera, 
  Car,
  AlertCircle,
  X,
  MapPin,
  CalendarDays,
  Plus,
  Trash2
} from "lucide-react";

interface Props {
  fleetCars: FleetVehicle[];
  onUpdateFleetCars: (cars: FleetVehicle[]) => void;
  records: RefuelingRecord[];
  brandColor: string;
}

export default function TripSummaryReport({ fleetCars, onUpdateFleetCars, records, brandColor }: Props) {
  const [activeReportTab, setActiveReportTab] = useState<"trips" | "fleet">("trips");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  // New Car Form State
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newType, setNewType] = useState("Sedan");
  const [newMileage, setNewMileage] = useState<number>(0);
  const [newImage, setNewImage] = useState("");
  const [newStatus, setNewStatus] = useState<"available" | "in_use" | "maintenance">("available");

  // Create mock completed trips based on refueling records and fleet cars
  const [completedTrips, setCompletedTrips] = useState(() => 
    records.map((record, index) => {
      const vehicle = fleetCars.length > 0 
        ? fleetCars[index % fleetCars.length] 
        : { brand: "Unknown", model: "Vehicle", plate: "N/A", type: "Unknown", status: "available", mileage: 0, condition: "Unknown", imageUrl: "" };
      const randomDistance = Math.floor(Math.random() * 300) + 50;
      return {
        id: `TRP-2026-${1000 + index}`,
        date: record.date,
        outTime: "08:30",
        returnTime: record.time,
        driverName: record.driverName,
        vehicle: `${vehicle.brand} ${vehicle.model}`,
        plateNo: record.plateNo,
        purpose: ["พบลูกค้า", "ตรวจไซต์งาน", "ขนส่งพัสดุ"][index % 3],
        distance: randomDistance,
        fuelCost: record.totalPaid,
        liters: record.liters,
        status: index % 4 === 0 ? "Pending" : "Approved",
        vehicleImage: vehicle.imageUrl,
        receiptId: record.id,
        station: record.station,
      };
    })
  );

  const filteredTrips = completedTrips.filter(trip => {
    const matchesSearch = 
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trip.plateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = () => {
    setCompletedTrips(prev => prev.map(t => t.id === selectedTrip.id ? { ...t, status: "Approved" } : t));
    setSelectedTrip(prev => ({ ...prev, status: "Approved" }));
    alert(`✅ อนุมัติยอดเบิกจ่ายสำหรับทริป ${selectedTrip?.id} สำเร็จ!`);
  };

  const handleExportPdf = () => {
    alert("📥 กำลังเตรียมไฟล์ PDF...");
    setTimeout(() => alert("✅ ดาวน์โหลด PDF สำเร็จ!"), 1000);
  };
  
  const handleExportExcel = () => {
    alert("📊 กำลังส่งออกข้อมูลไปยัง Excel...");
    setTimeout(() => alert("✅ ดาวน์โหลด Excel สำเร็จ!"), 1000);
  };

  // Add a new car
  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim() || !newModel.trim() || !newPlate.trim()) {
      alert("⚠️ กรุณากรอก ยี่ห้อ, รุ่น, และทะเบียนรถให้ครบถ้วน");
      return;
    }
    const newCar: FleetVehicle = {
      id: "car_" + Date.now(),
      brand: newBrand,
      model: newModel,
      plate: newPlate,
      type: newType,
      status: newStatus,
      mileage: Number(newMileage) || 0,
      condition: "Excellent",
      imageUrl: newImage.trim() || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80"
    };

    onUpdateFleetCars([...fleetCars, newCar]);
    setNewBrand("");
    setNewModel("");
    setNewPlate("");
    setNewType("Sedan");
    setNewMileage(0);
    setNewImage("");
    alert("🚗 เพิ่มรถใหม่เข้าสู่ระบบส่วนกลางสำเร็จ!");
  };

  // Delete a car
  const handleDeleteCar = (id: string) => {
    const car = fleetCars.find(c => c.id === id);
    if (!car) return;
    if (window.confirm(`⚠️ ยืนยันการลบรถ ${car.brand} ${car.model} (${car.plate}) ออกจากระบบส่วนกลาง?`)) {
      onUpdateFleetCars(fleetCars.filter(c => c.id !== id));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden font-sans">
      
      {/* Header section */}
      <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 font-display tracking-tight">แผงดูแลระบบ (Admin Console)</h2>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Admin Dashboard • Fleet Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="h-10 px-4 rounded-xl border border-emerald-950 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50 text-xs font-bold transition-colors flex items-center gap-2 active:scale-95 duration-100">
            <FileText size={14} /> EXCEL
          </button>
          <button onClick={handleExportPdf} className="h-10 px-4 rounded-xl border border-rose-950 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 text-xs font-bold transition-colors flex items-center gap-2 active:scale-95 duration-100">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Admin Panel sub tab toggler */}
      <div className="px-8 bg-slate-900/20 border-b border-slate-800/60 flex gap-4 shrink-0">
        <button 
          onClick={() => setActiveReportTab("trips")} 
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all active:scale-95 duration-100 ${
            activeReportTab === "trips" ? "text-cyan-400 border-cyan-500" : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          รายงานประวัติเดินทาง (Trips Log)
        </button>
        <button 
          onClick={() => setActiveReportTab("fleet")} 
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all active:scale-95 duration-100 ${
            activeReportTab === "fleet" ? "text-cyan-400 border-cyan-500" : "text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          จัดการกองรถแอดมิน (Fleet Manager)
        </button>
      </div>

      {activeReportTab === "trips" ? (
        <>
          {/* Filter and Search Bar */}
          <div className="px-8 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อพนักงาน, ทะเบียนรถ, รหัสทริป..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-200 focus:border-indigo-500/50 outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-8 text-xs text-slate-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="All">สถานะทั้งหมด</option>
                  <option value="Approved">อนุมัติแล้ว (Approved)</option>
                  <option value="Pending">รอตรวจสอบ (Pending)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              แสดงข้อมูล {filteredTrips.length} รายการ
            </div>
          </div>

          {/* Main Data Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-900/80 sticky top-0 z-10">
                <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
                  <th className="px-6 py-4">ทริป ID / วันที่</th>
                  <th className="px-6 py-4">พนักงาน (Driver)</th>
                  <th className="px-6 py-4">รถยนต์ (Vehicle)</th>
                  <th className="px-6 py-4 text-right">ระยะทาง</th>
                  <th className="px-6 py-4 text-right">ค่าน้ำมัน (THB)</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-bold text-slate-200">{trip.id}</div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <CalendarDays size={10} /> {trip.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-200">{trip.driverName}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{trip.purpose}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={trip.vehicleImage} className="w-8 h-8 rounded border border-slate-700 object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{trip.vehicle}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">{trip.plateNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-xs font-mono font-bold text-slate-200">{trip.distance} km</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-xs font-mono font-bold text-rose-400">฿{trip.fuelCost.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{trip.liters.toFixed(1)} L</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                        trip.status === "Approved" 
                          ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-950/30 text-amber-500 border-amber-500/20"
                      }`}>
                        {trip.status === "Approved" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedTrip(trip)}
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-950/30 px-3 py-1.5 rounded"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* FLEET MANAGEMENT SYSTEM */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950">
          
          {/* Left panel: Form to add vehicle */}
          <div className="w-full lg:w-80 border-r border-slate-800 p-6 overflow-y-auto shrink-0 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Plus size={16} className="text-cyan-400" />
                เพิ่มรถยนต์ใหม่
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-mono">เพิ่มข้อมูลรถส่วนกลางเข้าสู่ Fleet Pool</p>
            </div>

            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">ยี่ห้อ (Brand) *</label>
                <input 
                  type="text" 
                  value={newBrand}
                  onChange={e => setNewBrand(e.target.value)}
                  placeholder="เช่น Toyota, Honda" 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">รุ่น (Model) *</label>
                <input 
                  type="text" 
                  value={newModel}
                  onChange={e => setNewModel(e.target.value)}
                  placeholder="เช่น Camry, Hilux Revo" 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">เลขทะเบียน *</label>
                <input 
                  type="text" 
                  value={newPlate}
                  onChange={e => setNewPlate(e.target.value)}
                  placeholder="เช่น 1ขก 9999 กทม" 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">ประเภทรถ</label>
                  <select 
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 appearance-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Pickup 4-Door">Pickup 4-D</option>
                    <option value="Pickup 2-Door">Pickup 2-D</option>
                    <option value="EV Wagon">EV Wagon</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">สถานะ</label>
                  <select 
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 appearance-none"
                  >
                    <option value="available">ว่าง (Available)</option>
                    <option value="in_use">ใช้งานอยู่ (In Use)</option>
                    <option value="maintenance">ซ่อมบำรุง (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">เลขไมล์เริ่มต้น (Mileage)</label>
                <input 
                  type="number" 
                  value={newMileage}
                  onChange={e => setNewMileage(Number(e.target.value))}
                  placeholder="เช่น 15000" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-400 block font-bold">ลิงก์รูปภาพ (Image URL)</label>
                <input 
                  type="text" 
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... หรือปล่อยว่าง" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 placeholder:text-slate-600 text-ellipsis overflow-hidden"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 duration-100 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> เพิ่มข้อมูลรถยนต์
              </button>
            </form>
          </div>

          {/* Right panel: Table of existing vehicles */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">กองยานพาหนะปัจจุบัน ({fleetCars.length})</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">รายการรถส่วนกลางทั้งหมดที่อยู่ในฐานข้อมูลของระบบ</p>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left whitespace-nowrap font-mono text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-4">รูปภาพ</th>
                    <th className="p-4">แบรนด์ / รุ่น</th>
                    <th className="p-4">ประเภท</th>
                    <th className="p-4">ทะเบียนรถ</th>
                    <th className="p-4 text-right">เลขไมล์ (km)</th>
                    <th className="p-4 text-center">สถานะ</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {fleetCars.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <img 
                          src={car.imageUrl} 
                          className="w-12 h-12 rounded-lg border border-slate-700 object-cover shadow" 
                          alt={`${car.brand}`}
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-4 font-bold text-slate-200">
                        {car.brand} {car.model}
                      </td>
                      <td className="p-4 text-slate-400">{car.type}</td>
                      <td className="p-4 font-bold">{car.plate}</td>
                      <td className="p-4 text-right">
                        {car.mileage?.toLocaleString() || "0"}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8.5px] uppercase font-bold border ${
                          car.status === "available" 
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" 
                            : car.status === "in_use"
                            ? "bg-amber-950/20 text-amber-400 border-amber-500/20"
                            : "bg-rose-950/20 text-rose-400 border-rose-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            car.status === "available" ? "bg-emerald-400" : car.status === "in_use" ? "bg-amber-400" : "bg-rose-400"
                          }`} />
                          {car.status === "available" ? "ว่าง" : car.status === "in_use" ? "ใช้งานอยู่" : "ซ่อมบำรุง"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteCar(car.id)}
                          className="p-2 bg-slate-900 border border-slate-800 hover:bg-rose-950/50 hover:border-rose-500/40 text-slate-500 hover:text-rose-400 rounded-lg transition active:scale-95 duration-100"
                          title="ลบรถคันนี้"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TRIP DETAIL MODAL */}
      {selectedTrip && (
        <div className="absolute inset-0 bg-[#06070c]/90 backdrop-blur-md z-50 flex items-center justify-center p-8 animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
               <div>
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Trip Details Overview</span>
                 <h2 className="text-lg font-black text-slate-100 font-display flex items-center gap-2">
                   {selectedTrip.id}
                   <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                     selectedTrip.status === "Approved" ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/30" : "bg-amber-950/50 text-amber-500 border-amber-500/30"
                   }`}>
                     {selectedTrip.status}
                   </span>
                 </h2>
               </div>
               <button onClick={() => setSelectedTrip(null)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition">
                 <X size={18} />
               </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-6 bg-slate-900/20">
              {/* Left Column: Trip Info & Visuals */}
              <div className="space-y-6">
                 {/* Summary card */}
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                      <img src={selectedTrip.vehicleImage} className="w-16 h-16 rounded-xl object-cover border border-slate-700" referrerPolicy="no-referrer" />
                      <div>
                        <div className="text-sm font-bold text-slate-200">{selectedTrip.vehicle}</div>
                        <div className="text-[10px] text-slate-400 font-mono inline-block bg-slate-800 px-2 py-0.5 rounded mt-1 border border-slate-700">{selectedTrip.plateNo}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Driver</span>
                        <div className="text-xs text-slate-200 mt-1 font-semibold">{selectedTrip.driverName}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Timeline</span>
                        <div className="text-xs text-slate-200 mt-1 font-mono">{selectedTrip.date} • {selectedTrip.outTime} - {selectedTrip.returnTime}</div>
                      </div>
                    </div>
                 </div>

                 {/* Pre/Post Inspection Photos */}
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner">
                   <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                     <Camera size={14} className="text-slate-500" />
                     ภาพถ่ายสภาพรถ (Inspection Logs)
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2 text-center">
                       <span className="text-[10px] font-bold text-slate-400 block bg-slate-800 rounded px-2 py-1 border border-slate-700">ก่อนใช้งาน (Pre-Trip)</span>
                       <div className="aspect-video bg-slate-950 rounded-lg border border-slate-700 relative overflow-hidden group">
                         <img src={selectedTrip.vehicleImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500" referrerPolicy="no-referrer" />
                         <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                           <span className="text-[8px] font-mono text-slate-300">08:25 AM</span>
                         </div>
                       </div>
                     </div>
                     <div className="space-y-2 text-center">
                       <span className="text-[10px] font-bold text-slate-400 block bg-slate-800 rounded px-2 py-1 border border-slate-700">หลังใช้คืนรถ (Post-Trip)</span>
                       <div className="aspect-video bg-slate-950 rounded-lg border border-slate-700 relative overflow-hidden group">
                         <img src={selectedTrip.vehicleImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500 contrast-125" referrerPolicy="no-referrer" />
                         <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                           <span className="text-[8px] font-mono text-slate-300">{selectedTrip.returnTime} PM</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Right Column: AI OCR & Expense */}
              <div className="space-y-6">
                 {/* Receipt & AI Result */}
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner h-full flex flex-col">
                   <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                     <FileText size={14} className="text-cyan-400" />
                     หลักฐานการเบิกจ่ายค่าน้ำมัน
                   </h3>

                   <div className="flex gap-4 mb-6">
                      <div className="w-1/3 space-y-2 text-center">
                        <span className="text-[10px] text-slate-500">ภาพถ่ายใบเสร็จ</span>
                        <div className="bg-slate-200 h-40 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center p-2 relative">
                          {/* Receipt lines mockup */}
                          <div className="w-full h-full bg-white flex flex-col items-center justify-start py-2 opacity-50">
                            <div className="w-8 h-1 bg-slate-400 mb-2"></div>
                            <div className="w-12 h-0.5 bg-slate-300 mb-1"></div>
                            <div className="w-10 h-0.5 bg-slate-300 mb-1"></div>
                            <div className="w-14 h-0.5 bg-slate-300 mb-4"></div>
                            <div className="w-full px-2 mt-auto">
                              <div className="border-t-2 border-black border-dashed w-full pt-1">
                                <div className="h-2 bg-black w-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[9px] font-mono bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">RECEIPT.JPG</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-2/3 bg-slate-950 p-4 rounded-xl border border-cyan-900/40 relative">
                        <div className="absolute top-0 right-4 -translate-y-1/2 bg-slate-900 px-2 flex items-center gap-1.5 text-cyan-400">
                          <CheckCircle size={10} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">AI OCR Extracted</span>
                        </div>
                        
                        <div className="space-y-3 mt-2">
                           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                             <span className="text-[10px] text-slate-500">Station</span>
                             <span className="text-xs font-bold text-slate-200">{selectedTrip.station}</span>
                           </div>
                           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                             <span className="text-[10px] text-slate-500">Refuel Date/Time</span>
                             <span className="text-xs font-mono text-slate-300">{selectedTrip.date} {selectedTrip.returnTime}</span>
                           </div>
                           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                             <span className="text-[10px] text-slate-500">Fuel Volume</span>
                             <span className="text-xs font-mono font-bold text-slate-200">{selectedTrip.liters.toFixed(2)} L</span>
                           </div>
                           <div className="flex justify-between items-end pt-2">
                             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                             <span className="text-xl font-mono font-black text-rose-400 tracking-tighter">฿{selectedTrip.fuelCost.toLocaleString()}</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="mt-auto pt-4 border-t border-slate-800 flex gap-3">
                     {selectedTrip.status === "Pending" ? (
                       <>
                         <button className="flex-1 py-3 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer">
                           ปฏิเสธ (Reject)
                         </button>
                         <button onClick={handleApprove} className="flex-1 py-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition cursor-pointer flex justify-center items-center gap-2">
                           <CheckCircle size={14} /> อนุมัติยอดเบิกจ่าย
                         </button>
                       </>
                     ) : (
                       <div className="w-full py-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex justify-center items-center gap-2">
                         <CheckCircle size={14} /> อนุมัติเบิกจ่ายเรียบร้อยแล้ว
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
