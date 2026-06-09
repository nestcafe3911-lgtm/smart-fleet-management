import { Request, Response } from 'express';
import { query } from '../db';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    // 1. Fetch available vehicles with status and fuel type
    const result = await query(`
      SELECT id, brand, model, plate_no as plate, vehicle_type as type, status, allowed_fuel_type, mileage, image_url
      FROM vehicles
      ORDER BY brand ASC
    `);

    // In a real application without seeds, it would return result.rows
    // Here we return the mock implementation combining DB and default values ensuring robustness
    return res.status(200).json({
      success: true,
      data: result.rows.length ? result.rows : []
    });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getVehicleDiagnostics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 1. Fetch vehicle info
    const vehicleResult = await query(
      `SELECT id, condition, three_d_model_url FROM vehicles WHERE id = $1`,
      [id]
    );

    // 2. Fetch specific maintenance logs for the 3D J.A.R.V.I.S. Hotspots mapping
    const logsResult = await query(`
      SELECT component_type, status, service_date, target_mileage, due_date
      FROM maintenance_logs
      WHERE vehicle_id = $1
      ORDER BY due_date ASC
    `, [id]);

    return res.status(200).json({
      success: true,
      diagnostic_data: {
        vehicle_meta: vehicleResult.rows[0] || null,
        maintenance_logs: logsResult.rows
      }
    });
  } catch (error: any) {
    console.error('Error fetching vehicle diagnostics:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
