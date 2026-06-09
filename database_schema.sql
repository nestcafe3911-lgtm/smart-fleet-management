-- ==============================================================================
-- Enterprise Fleet Management System - Database Schema (PostgreSQL)
-- ==============================================================================

-- 1. USERS TABLE
-- เก็บข้อมูลพนักงานและแอดมิน (แยก Role: user, admin, manager)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'user', 'admin', 'manager'
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEHICLES TABLE
-- เก็บข้อมูลรถยนต์ 
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    plate_no VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    
    status VARCHAR(50) NOT NULL DEFAULT 'available', -- 'available', 'in_use', 'maintenance'
    allowed_fuel_type VARCHAR(50) NOT NULL, -- 'E20', 'Diesel', 'EV', etc.
    mileage INTEGER DEFAULT 0,
    condition VARCHAR(255),
    
    image_url TEXT,
    three_d_model_url TEXT, -- สำหรับดึงไปแสดงผล 3D Model ในหน้า J.A.R.V.I.S Maintenance
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BOOKINGS TABLE
-- ระบบสระรถยนต์ส่วนกลาง
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES users(id) ON DELETE SET NULL, -- หัวหน้าผู้อนุมัติ (บังคับกรณีกดจองด่วน)
    
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Trip Inspection & Tracking (ข้อมูลนำรถออกและคืนรถ)
    start_mileage INTEGER,
    end_mileage INTEGER,
    pre_trip_image_url TEXT,
    post_trip_image_url TEXT,
    check_in_lat DECIMAL(10, 8), -- พิกัด GPS จุดจอด
    check_in_lng DECIMAL(11, 8),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FUEL RECORDS TABLE
-- เบิกค่าน้ำมัน & AI OCR
CREATE TABLE fuel_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE, -- ผูกกับทริปการจอง
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    volume_liters DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    station_name VARCHAR(255),
    receipt_image_url TEXT,
    
    -- AI OCR Verification
    ocr_confidence DECIMAL(5, 2),
    is_verified BOOLEAN DEFAULT FALSE, -- แอดมินกด approve จะเปลี่ยนเป็น TRUE
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MAINTENANCE LOGS TABLE
-- Digital Twin 3D Data & Maintenance History
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    component_type VARCHAR(50) NOT NULL, -- 'engine', 'tires', 'fuel_system', 'brakes', etc. (อ้างอิงจุด Hotspot 3D)
    description TEXT NOT NULL,
    
    status VARCHAR(50) NOT NULL DEFAULT 'upcoming', -- 'completed', 'upcoming', 'overdue'
    
    service_date TIMESTAMP WITH TIME ZONE, -- วันที่เข้ารับบริการ (ถ้า completed)
    target_mileage INTEGER, -- กำหนดระยะทางรอบถัดไป
    due_date TIMESTAMP WITH TIME ZONE, -- กำหนดวันที่รอบถัดไป (ถ้ามี)
    
    cost DECIMAL(10, 2),
    performed_by VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXING FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_fuel_records_booking_id ON fuel_records(booking_id);
CREATE INDEX idx_maintenance_logs_vehicle_id ON maintenance_logs(vehicle_id);
CREATE INDEX idx_maintenance_logs_component_type ON maintenance_logs(component_type);
