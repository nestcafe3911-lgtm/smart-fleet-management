import { Request, Response } from 'express';
import { query } from '../db';
import { processReceiptWithVision } from '../services/vision.service'; 

export const uploadFuelRecord = async (req: Request, res: Response) => {
  try {
    const { bookingId, vehicleId, userId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No receipt image uploaded in form-data under key "receiptImage".' });
    }

    // 1. Process receipt with Google Cloud Vision
    const ocrResult = await processReceiptWithVision(req.file.buffer);

    // 2. Validate extracted data
    const { volume_liters, total_cost, image_hash } = ocrResult.data;
    
    if (!volume_liters || !total_cost) {
       return res.status(400).json({ 
         success: false, 
         error: 'Could not confidently read fuel volume or total paid from receipt. Please verify image clarity.' 
       });
    }

    // 3. Duplicate Detection Logic (Fraud Prevention)
    // Check if a record with exact same cost and volume exists (we assume same cost + volume + recent timeframe is a duplicate)
    // Alternatively, we could check image_hash if we added it to DB. For now, checking exact values.
    const duplicateCheck = await query(`
       SELECT id, created_at FROM fuel_records 
       WHERE volume_liters = $1 AND total_cost = $2 
       AND created_at > NOW() - INTERVAL '7 days'
       LIMIT 1
    `, [volume_liters, total_cost]);

    if (duplicateCheck.rows.length > 0) {
       return res.status(409).json({
         success: false,
         error: 'DUPLICATE_RECEIPT_DETECTED: A receipt with this exact volume and total cost was recently uploaded. Please do not submit duplicate claims.'
       });
    }

    // 4. Insert into PostgreSQL
    // For production, the image should be uploaded to GCS/S3. Here we simulate the receipt URL using a mocked URL.
    const receiptUrlMock = `https://storage.googleapis.com/fleet-bucket/receipts/${image_hash?.substring(0, 8) || 'dummy'}.jpg`;

    const insertResult = await query(`
        INSERT INTO fuel_records (
          booking_id, vehicle_id, user_id, volume_liters, total_cost, station_name, receipt_image_url, is_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [bookingId, vehicleId, userId, volume_liters, total_cost, 'Unknown Station OCR', receiptUrlMock, false]);

    // 5. Send API Response ready for frontend Auto-fill
    return res.status(201).json({
      success: true,
      message: 'Fuel record and OCR parsed successfully',
      data: insertResult.rows[0],
      ocr_data: ocrResult.data
    });

  } catch (error: any) {
    console.error('Fuel record upload error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process and save fuel record.' });
  }
};
