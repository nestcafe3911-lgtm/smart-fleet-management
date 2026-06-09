import { Request, Response } from 'express';
import { query } from '../db';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, vehicleId, startTime, endTime, purpose, isUrgent, approverId } = req.body;

    // Validate urgent booking
    if (isUrgent && !approverId) {
      return res.status(400).json({ success: false, error: 'Urgent bookings require an approverId.' });
    }

    const status = isUrgent ? 'pending' : 'approved'; // Logic simulation: Urgent requires manual approval from Manager

    const insertResult = await query(`
      INSERT INTO bookings (
        user_id, vehicle_id, approver_id, start_time, end_time, purpose, status, is_urgent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      userId, vehicleId, isUrgent ? approverId : null, startTime, endTime, purpose, status, isUrgent
    ]);

    // Optional: Update vehicle status to 'in_use' if booking is immediately active
    // await query(`UPDATE vehicles SET status = 'in_use' WHERE id = $1`, [vehicleId]);

    return res.status(201).json({
      success: true,
      data: insertResult.rows[0],
      message: isUrgent ? 'Urgent booking requested. Waiting for approval.' : 'Booking created successfully.'
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, error: 'Error creating booking' });
  }
};
