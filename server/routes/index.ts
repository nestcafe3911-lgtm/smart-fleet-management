import { Router } from 'express';
import multer from 'multer';
import { getVehicles, getVehicleDiagnostics } from '../controllers/vehicle.controller';
import { createBooking } from '../controllers/booking.controller';
import { uploadFuelRecord } from '../controllers/fuel.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- 1. Vehicle Routes ---
router.get('/vehicles', getVehicles);
router.get('/vehicles/:id/diagnostic', getVehicleDiagnostics);

// --- 2. Booking Routes ---
router.post('/bookings', createBooking);

// --- 3. Fuel & OCR Routes ---
// The frontend must use form-data with the key "receiptImage"
router.post('/fuel-records', upload.single('receiptImage'), uploadFuelRecord);

export default router;
