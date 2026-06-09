import React, { useState, useRef, useEffect } from "react";
import { CarBrand } from "../types";
import { Move, Settings, Zap, Compass, RefreshCw, Eye } from "lucide-react";

interface Props {
  activeBrand: CarBrand;
}

export default function ThreeDGarage({ activeBrand }: Props) {
  const [yaw, setYaw] = useState<number>(30); // angle in degrees
  const [pitch, setPitch] = useState<number>(15); // angle in degrees
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<"wireframe" | "solid" | "internal">("wireframe");
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  // Rotate back to home on double click
  const handleReset = () => {
    setYaw(30);
    setPitch(15);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;
    setYaw((prev) => (prev + deltaX * 0.7) % 360);
    setPitch((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.7)));
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Modern SVG calculation for structural wireframe rendering of a premium sedan/coupe
  // We model points in 3D: [x, y, z] and translate via yaw/pitch standard Euler rotations to screen coord projection [X, Y]
  const projectPoint = (x: number, y: number, z: number) => {
    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    // Rotate around Y-axis (Yaw)
    let x1 = x * Math.cos(radYaw) - z * Math.sin(radYaw);
    let z1 = x * Math.sin(radYaw) + z * Math.cos(radYaw);
    let y1 = y;

    // Rotate around X-axis (Pitch)
    let x2 = x1;
    let y2 = y1 * Math.cos(radPitch) - z1 * Math.sin(radPitch);
    let z2 = y1 * Math.sin(radPitch) + z1 * Math.cos(radPitch);

    // Dynamic perspective zoom scaling
    const depth = 220;
    const scale = depth / (depth + z2);
    
    // Screen mappings relative to a 400x250 canvas center (200, 125)
    const px = 200 + x2 * scale * 1.5;
    const py = 125 + y2 * scale * 1.5;
    return { x: px, y: py };
  };

  // Defining relative 3D coordinate map for our sleek supercar mockup
  // Coordinates are designed around center: Body length ~120, width ~50, height ~35
  const size = { L: 100, W: 45, H: 28 };

  // Generate Projected Points dictionary
  const pts: { [key: string]: { x: number; y: number } } = {
    // Wheels setup
    fl_wheel: projectPoint(-65, 14, -size.W * 0.9),
    fr_wheel: projectPoint(-65, 14, size.W * 0.9),
    bl_wheel: projectPoint(65, 14, -size.W * 0.9),
    br_wheel: projectPoint(65, 14, size.W * 0.9),

    // Lower Chassis
    front_tip_l: projectPoint(-105, 5, -size.W * 0.6),
    front_tip_r: projectPoint(-105, 5, size.W * 0.6),
    back_tip_l: projectPoint(100, 2, -size.W * 0.7),
    back_tip_r: projectPoint(100, 2, size.W * 0.7),

    sill_l_f: projectPoint(-65, 10, -size.W * 0.82),
    sill_r_f: projectPoint(-65, 10, size.W * 0.82),
    sill_l_b: projectPoint(65, 10, -size.W * 0.85),
    sill_r_b: projectPoint(65, 10, size.W * 0.85),

    // Hood / Windshield
    bonnet_front_l: projectPoint(-92, -5, -size.W * 0.55),
    bonnet_front_r: projectPoint(-92, -5, size.W * 0.55),
    windshield_base_l: projectPoint(-40, -12, -size.W * 0.65),
    windshield_base_r: projectPoint(-40, -12, size.W * 0.65),
    
    // Roofline
    roof_front_l: projectPoint(-5, -28, -size.W * 0.55),
    roof_front_r: projectPoint(-5, -28, size.W * 0.55),
    roof_rear_l: projectPoint(40, -26, -size.W * 0.55),
    roof_rear_r: projectPoint(40, -26, size.W * 0.55),

    // Trunk
    boot_l: projectPoint(85, -10, -size.W * 0.65),
    boot_r: projectPoint(85, -10, size.W * 0.65),

    // Simulated Active Door outline (openable in 3D rotation projection!)
    door_hinge_top_l: projectPoint(-32, -12, -size.W * 0.66),
    door_hinge_base_l: projectPoint(-35, 10, -size.W * 0.82),
    // Compute door edge rotated outwards if doorOpen toggle behaves dynamically!
    door_edge_top_l: projectPoint(
      doorOpen ? -5 : 15, 
      -22, 
      doorOpen ? -size.W * 1.5 : -size.W * 0.60
    ),
    door_edge_base_l: projectPoint(
      doorOpen ? -10 : 18, 
      10, 
      doorOpen ? -size.W * 1.6 : -size.W * 0.84
    ),

    // Battery modules under the floor (Engine / Internals view layer)
    bat_f_l: projectPoint(-45, 12, -size.W * 0.7),
    bat_f_r: projectPoint(-45, 12, size.W * 0.7),
    bat_b_l: projectPoint(45, 12, -size.W * 0.7),
    bat_b_r: projectPoint(45, 12, size.W * 0.7),
  };

  const activeColor = activeBrand.brandColor;

  return (
    <div id="garage-container" className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 relative shadow-2xl overflow-hidden">
      {/* Background glow syncing with brand */}
      <div 
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-all duration-700" 
        style={{ backgroundColor: activeColor }}
      />
      
      {/* Header controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="text-slate-400 animate-pulse" size={20} />
            3D Interactive Smart Garage
          </h2>
          <p className="text-xs text-slate-400">
            Drag to Rotate • Double Click to Centered • Live Telemetry
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg text-xs border border-slate-700/60 shadow-inner">
          <button 
            onClick={() => setActiveLayer("wireframe")} 
            className={`px-3 py-1 rounded-md transition-all font-medium ${activeLayer === "wireframe" ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-100"}`}
          >
            Holo-Wire
          </button>
          <button 
            onClick={() => setActiveLayer("solid")} 
            className={`px-3 py-1 rounded-md transition-all font-medium ${activeLayer === "solid" ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-100"}`}
          >
            Chassis
          </button>
          <button 
            onClick={() => setActiveLayer("internal")} 
            className={`px-3 py-1 rounded-md transition-all font-medium ${activeLayer === "internal" ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-100"}`}
          >
            EV Core
          </button>
        </div>
      </div>

      {/* Main 3D Stage */}
      <div 
        className="w-full relative h-[250px] bg-slate-950/80 rounded-xl cursor-grab active:cursor-grabbing border border-slate-800 flex items-center justify-center select-none shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onDoubleClick={handleReset}
      >
        <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 bg-slate-900/60 px-2 py-1 rounded border border-slate-800 leading-normal">
          ROT_Y: {Math.round(yaw)}° <br/>
          ROT_X: {Math.round(pitch)}° <br/>
          FOCUS: {activeBrand.modelName}
        </div>

        {/* Action icons row inside canvas */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
          <button 
            onClick={() => setDoorOpen(!doorOpen)} 
            className={`px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider border rounded transition ${doorOpen ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-800 text-slate-400 border-slate-700"}`}
          >
            Doors {doorOpen ? "Open" : "Close"}
          </button>
          <button 
            onClick={() => setHeadlightsOn(!headlightsOn)} 
            className={`px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider border rounded transition ${headlightsOn ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-slate-800 text-slate-400 border-slate-700"}`}
          >
            Beam {headlightsOn ? "On" : "Off"}
          </button>
          <button 
            onClick={handleReset}
            title="Reset view"
            className="p-1 text-slate-400 hover:text-slate-100 bg-slate-800 rounded border border-slate-700"
          >
            <RefreshCw size={12} />
          </button>
        </div>

        {/* 3D Wireframe SVG rendering engine */}
        <svg className="w-full h-full overflow-visible pointer-events-none" viewBox="0 0 400 250">
          {/* Ground Circular grid shadow */}
          <ellipse cx="200" cy="180" rx="140" ry="25" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="200" cy="180" rx="90" ry="16" fill="none" stroke="#334155" strokeWidth="1.5" />
          
          {/* Hologram dynamic particles */}
          <circle cx="160" cy="140" r="1.5" fill={activeColor} opacity="0.4" className="animate-ping" />
          <circle cx="250" cy="120" r="1.5" fill={activeColor} opacity="0.5" className="animate-pulse" />

          {/* Underglow Neon lighting */}
          <g opacity="0.35">
            <ellipse 
              cx="200" 
              cy="180" 
              rx="110" 
              ry="20" 
              fill={`url(#neonGlow-${activeBrand.id})`} 
            />
          </g>

          <defs>
            <radialGradient id={`neonGlow-${activeBrand.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Headlights active beams projections (If headlights true and front is facing left or slightly front) */}
          {headlightsOn && (
            <g opacity="0.6">
              {/* Left Beam */}
              <polygon 
                points={`${pts.front_tip_l.x},${pts.front_tip_l.y} ${pts.front_tip_l.x - 170},${pts.front_tip_l.y + 40} ${pts.front_tip_l.x - 130},${pts.front_tip_l.y - 60}`} 
                fill={`url(#beamLeft)`} 
              />
              {/* Right Beam */}
              <polygon 
                points={`${pts.front_tip_r.x},${pts.front_tip_r.y} ${pts.front_tip_r.x - 150},${pts.front_tip_r.y + 70} ${pts.front_tip_r.x - 110},${pts.front_tip_r.y - 45}`} 
                fill={`url(#beamRight)`} 
              />

              <defs>
                <linearGradient id="beamLeft" x1="1" y1="0.5" x2="0" y2="0.6">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" style={{ stopColor: activeColor }} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="beamRight" x1="1" y1="0.5" x2="0" y2="0.6">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" style={{ stopColor: activeColor }} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </linearGradient>
              </defs>
            </g>
          )}

          {/* Draw EV Battery module if Core View active */}
          {activeLayer === "internal" && (
            <g stroke="#10b981" fill="#10b981" fillOpacity="0.12" strokeWidth="1.5">
              <polygon points={`${pts.bat_f_l.x},${pts.bat_f_l.y} ${pts.bat_f_r.x},${pts.bat_f_r.y} ${pts.bat_b_r.x},${pts.bat_b_r.y} ${pts.bat_b_l.x},${pts.bat_b_l.y}`} />
              <line x1={pts.bat_f_l.x} y1={pts.bat_f_l.y} x2={pts.bat_b_l.x} y2={pts.bat_b_l.y} strokeDasharray="3 3" />
              <line x1={pts.bat_f_r.x} y1={pts.bat_f_r.y} x2={pts.bat_b_r.x} y2={pts.bat_b_r.y} strokeDasharray="3 3" />
              {/* Energy flows wire indicators */}
              <circle cx={(pts.bat_f_l.x + pts.bat_b_l.x)/2} cy={(pts.bat_f_l.y + pts.bat_b_l.y)/2} r="3" fill="#34d399" className="animate-ping" />
            </g>
          )}

          {/* SOLID CHASSIS SHADING */}
          {activeLayer === "solid" && (
            <g fill="#1e293b" fillOpacity="0.8" stroke={activeColor} strokeWidth="1">
              {/* Hood */}
              <polygon points={`${pts.front_tip_l.x},${pts.front_tip_l.y} ${pts.front_tip_r.x},${pts.front_tip_r.y} ${pts.bonnet_front_r.x},${pts.bonnet_front_r.y} ${pts.bonnet_front_l.x},${pts.bonnet_front_l.y}`} />
              {/* Bonnet plane to windshield */}
              <polygon points={`${pts.bonnet_front_l.x},${pts.bonnet_front_l.y} ${pts.bonnet_front_r.x},${pts.bonnet_front_r.y} ${pts.windshield_base_r.x},${pts.windshield_base_r.y} ${pts.windshield_base_l.x},${pts.windshield_base_l.y}`} fill="#334155" fillOpacity="0.7" />
              {/* Screen glass */}
              <polygon points={`${pts.windshield_base_l.x},${pts.windshield_base_l.y} ${pts.windshield_base_r.x},${pts.windshield_base_r.y} ${pts.roof_front_r.x},${pts.roof_front_r.y} ${pts.roof_front_l.x},${pts.roof_front_l.y}`} fill="#020617" fillOpacity="0.9" />
              {/* Roof */}
              <polygon points={`${pts.roof_front_l.x},${pts.roof_front_l.y} ${pts.roof_front_r.x},${pts.roof_front_r.y} ${pts.roof_rear_r.x},${pts.roof_rear_r.y} ${pts.roof_rear_l.x},${pts.roof_rear_l.y}`} fill="#1e293b" />
              {/* Rear windscreen to boot */}
              <polygon points={`${pts.roof_rear_l.x},${pts.roof_rear_l.y} ${pts.roof_rear_r.x},${pts.roof_rear_r.y} ${pts.boot_r.x},${pts.boot_r.y} ${pts.boot_l.x},${pts.boot_l.y}`} fill="#0f172a" />
              {/* Side profile Left */}
              <polygon points={`${pts.front_tip_l.x},${pts.front_tip_l.y} ${pts.bonnet_front_l.x},${pts.bonnet_front_l.y} ${pts.windshield_base_l.x},${pts.windshield_base_l.y} ${pts.roof_front_l.x},${pts.roof_front_l.y} ${pts.roof_rear_l.x},${pts.roof_rear_l.y} ${pts.boot_l.x},${pts.boot_l.y} ${pts.back_tip_l.x},${pts.back_tip_l.y} ${pts.sill_l_b.x},${pts.sill_l_b.y} ${pts.sill_l_f.x},${pts.sill_l_f.y}`} fill="#0f172a" fillOpacity="0.85" />
            </g>
          )}

          {/* MAIN HOLOGRAM WIREFRAME STRUCTURAL LINES */}
          <g stroke={activeColor} strokeWidth="1.25" opacity={activeLayer === "wireframe" ? "0.85" : "0.5"} fill="none">
            {/* Front Bumper lines */}
            <line x1={pts.front_tip_l.x} y1={pts.front_tip_l.y} x2={pts.front_tip_r.x} y2={pts.front_tip_r.y} />
            <line x1={pts.front_tip_l.x} y1={pts.front_tip_l.y} x2={pts.bonnet_front_l.x} y2={pts.bonnet_front_l.y} />
            <line x1={pts.front_tip_r.x} y1={pts.front_tip_r.y} x2={pts.bonnet_front_r.x} y2={pts.bonnet_front_r.y} />
            
            {/* Bonnet mesh lines */}
            <line x1={pts.bonnet_front_l.x} y1={pts.bonnet_front_l.y} x2={pts.bonnet_front_r.x} y2={pts.bonnet_front_r.y} />
            <line x1={pts.bonnet_front_l.x} y1={pts.bonnet_front_l.y} x2={pts.windshield_base_l.x} y2={pts.windshield_base_l.y} />
            <line x1={pts.bonnet_front_r.x} y1={pts.bonnet_front_r.y} x2={pts.windshield_base_r.x} y2={pts.windshield_base_r.y} />
            <line x1={(pts.bonnet_front_l.x+pts.bonnet_front_r.x)/2} y1={(pts.bonnet_front_l.y+pts.bonnet_front_r.y)/2} x2={(pts.windshield_base_l.x+pts.windshield_base_r.x)/2} y2={(pts.windshield_base_l.y+pts.windshield_base_r.y)/2} strokeWidth="0.5" strokeDasharray="2 2" />

            {/* Windshield frame */}
            <line x1={pts.windshield_base_l.x} y1={pts.windshield_base_l.y} x2={pts.windshield_base_r.x} y2={pts.windshield_base_r.y} />
            <line x1={pts.windshield_base_l.x} y1={pts.windshield_base_l.y} x2={pts.roof_front_l.x} y2={pts.roof_front_l.y} strokeWidth="1.8" />
            <line x1={pts.windshield_base_r.x} y1={pts.windshield_base_r.y} x2={pts.roof_front_r.x} y2={pts.roof_front_r.y} strokeWidth="1.8" />
            
            {/* Roof lines */}
            <line x1={pts.roof_front_l.x} y1={pts.roof_front_l.y} x2={pts.roof_front_r.x} y2={pts.roof_front_r.y} />
            <line x1={pts.roof_front_l.x} y1={pts.roof_front_l.y} x2={pts.roof_rear_l.x} y2={pts.roof_rear_l.y} />
            <line x1={pts.roof_front_r.x} y1={pts.roof_front_r.y} x2={pts.roof_rear_r.x} y2={pts.roof_rear_r.y} />
            <line x1={pts.roof_rear_l.x} y1={pts.roof_rear_l.y} x2={pts.roof_rear_r.x} y2={pts.roof_rear_r.y} />

            {/* Rear windshield to Trunk */}
            <line x1={pts.roof_rear_l.x} y1={pts.roof_rear_l.y} x2={pts.boot_l.x} y2={pts.boot_l.y} />
            <line x1={pts.roof_rear_r.x} y1={pts.roof_rear_r.y} x2={pts.boot_r.x} y2={pts.boot_r.y} />
            <line x1={pts.boot_l.x} y1={pts.boot_l.y} x2={pts.boot_r.x} y2={pts.boot_r.y} />
            
            {/* Rear Bumper back tip */}
            <line x1={pts.boot_l.x} y1={pts.boot_l.y} x2={pts.back_tip_l.x} y2={pts.back_tip_l.y} />
            <line x1={pts.boot_r.x} y1={pts.boot_r.y} x2={pts.back_tip_r.x} y2={pts.back_tip_r.y} />
            <line x1={pts.back_tip_l.x} y1={pts.back_tip_l.y} x2={pts.back_tip_r.x} y2={pts.back_tip_r.y} strokeWidth="1.8" />

            {/* Side Profiles and doors frame */}
            <line x1={pts.front_tip_l.x} y1={pts.front_tip_l.y} x2={pts.sill_l_f.x} y2={pts.sill_l_f.y} />
            <line x1={pts.front_tip_r.x} y1={pts.front_tip_r.y} x2={pts.sill_r_f.x} y2={pts.sill_r_f.y} />
            <line x1={pts.sill_l_f.x} y1={pts.sill_l_f.y} x2={pts.sill_l_b.x} y2={pts.sill_l_b.y} strokeWidth="1.8" />
            <line x1={pts.sill_r_f.x} y1={pts.sill_r_f.y} x2={pts.sill_r_b.x} y2={pts.sill_r_b.y} strokeWidth="1.8" />
            <line x1={pts.sill_l_b.x} y1={pts.sill_l_b.y} x2={pts.back_tip_l.x} y2={pts.back_tip_l.y} />
            <line x1={pts.sill_r_b.x} y1={pts.sill_r_b.y} x2={pts.back_tip_r.x} y2={pts.back_tip_r.y} />

            {/* DYNAMIC DOOR LINES (open/close based on doorOpen state variable!) */}
            <line x1={pts.door_hinge_top_l.x} y1={pts.door_hinge_top_l.y} x2={pts.door_edge_top_l.x} y2={pts.door_edge_top_l.y} stroke="#f43f5e" strokeWidth={doorOpen ? "2" : "1.25"} />
            <line x1={pts.door_hinge_base_l.x} y1={pts.door_hinge_base_l.y} x2={pts.door_edge_base_l.x} y2={pts.door_edge_base_l.y} stroke="#f43f5e" strokeWidth={doorOpen ? "2" : "1.25"} />
            <line x1={pts.door_edge_top_l.x} y1={pts.door_edge_top_l.y} x2={pts.door_edge_base_l.x} y2={pts.door_edge_base_l.y} stroke="#f43f5e" strokeWidth={doorOpen ? "2.2" : "1.25"} />

            {/* Tail lights connection */}
            <line x1={pts.back_tip_l.x} y1={pts.back_tip_l.y} x2={pts.back_tip_r.x} y2={pts.back_tip_r.y} stroke="#f43f5e" strokeWidth="2.5" />
          </g>

          {/* Wheel Cylinders/Circles (drawn with high visibility) */}
          <g fill="#020617" stroke={activeColor} strokeWidth="2.5">
            {/* Front Left Wheel */}
            <circle cx={pts.fl_wheel.x} cy={pts.fl_wheel.y} r="15" />
            <circle cx={pts.fl_wheel.x} cy={pts.fl_wheel.y} r="6" fill={activeColor} fillOpacity="0.4" />
            {/* Front Right Wheel */}
            <circle cx={pts.fr_wheel.x} cy={pts.fr_wheel.y} r="15" />
            <circle cx={pts.fr_wheel.x} cy={pts.fr_wheel.y} r="6" fill={activeColor} fillOpacity="0.4" />
            {/* Back Left Wheel */}
            <circle cx={pts.bl_wheel.x} cy={pts.bl_wheel.y} r="15.5" />
            <circle cx={pts.bl_wheel.x} cy={pts.bl_wheel.y} r="6.5" fill={activeColor} fillOpacity="0.4" />
            {/* Back Right Wheel */}
            <circle cx={pts.br_wheel.x} cy={pts.br_wheel.y} r="15.5" />
            <circle cx={pts.br_wheel.x} cy={pts.br_wheel.y} r="6.5" fill={activeColor} fillOpacity="0.4" />
          </g>

          {/* Interactive touch HUD vectors overlay */}
          <g opacity="0.85">
            {/* Odometer anchor text sensor */}
            <line x1={pts.roof_front_l.x} y1={pts.roof_front_l.y} x2={pts.roof_front_l.x - 30} y2={pts.roof_front_l.y - 30} stroke="#475569" strokeWidth="1" />
            <circle cx={pts.roof_front_l.x - 30} cy={pts.roof_front_l.y - 30} r="2.5" fill={activeColor} />
            <text x={pts.roof_front_l.x - 35} y={pts.roof_front_l.y - 36} fontSize="8" fill="#cbd5e1" fontFamily="monospace" textAnchor="end">
              SYS STATUS: 100% OK
            </text>
          </g>
        </svg>

        {/* Floating guidance */}
        <div className="absolute top-3 right-3 text-[10px] font-medium text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          REAL-TIME 3D PERSPECTIVE
        </div>
      </div>

      {/* Visual Stats Row in Garage */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-mono">EV Range Estimate</span>
          <span className="text-sm font-semibold text-slate-200 font-mono">{activeBrand.specs.range}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-mono">Battery Capacity</span>
          <span className="text-sm font-semibold text-slate-200 font-mono">{activeBrand.specs.battery}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-mono">Performance Output</span>
          <span className="text-sm font-semibold text-slate-200 font-mono">{activeBrand.specs.hp} HP</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-mono">Current Theme</span>
          <span className="text-xs font-semibold uppercase flex items-center gap-1.5 mt-0.5" style={{ color: activeColor }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: activeColor }}></span>
            {activeBrand.name} Premium
          </span>
        </div>
      </div>
    </div>
  );
}
