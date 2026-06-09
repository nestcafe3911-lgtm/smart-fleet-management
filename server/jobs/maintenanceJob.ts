import cron from 'node-cron';
import { query } from '../db';
import admin from 'firebase-admin';

// Initialize Firebase Admin (lazy load or safe init if credentials exist)
// In production, ensure GOOGLE_APPLICATION_CREDENTIALS is set,
// or initialize with a service account object.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
        // credential: admin.credential.applicationDefault() 
        // Assuming default credential will be used if set in environment
    });
  } catch (err) {
    console.warn("Firebase Admin init skipped. Proceeding with mock/simulated notifications in dev mode.");
  }
}

// Helper to send push notifications to admins/managers
const notifyAdmins = async (title: string, body: string) => {
  try {
    // 1. Fetch valid device tokens for users with role 'admin' or 'manager'
    // Note: You would normally have a 'device_tokens' table or field on the users table.
    // We are simulating the query here.
    const adminQuery = await query(`
      -- SELECT device_token FROM user_device_tokens 
      -- JOIN users ON users.id = user_device_tokens.user_id 
      -- WHERE users.role IN ('admin', 'manager') AND device_token IS NOT NULL
      SELECT id FROM users WHERE role IN ('admin', 'manager')
    `);
    
    // For demonstration, simulating device tokens
    const mockTokens = ["mock_device_token_1", "mock_device_token_2"];

    if (admin.apps.length > 0 && mockTokens.length > 0) {
      // Use Firebase Admin to send messages
      // SendMulticast is the modern way to send to multiple devices
      await admin.messaging().sendEachForMulticast({
        tokens: mockTokens,
        notification: {
          title,
          body
        }
      });
      console.log(`[Maintenance Job] Sent real push notification: ${title}`);
    } else {
      console.log(`[Maintenance Job - Simulated Push] Title: ${title} | Body: ${body}`);
    }
  } catch (error) {
    console.error(`[Maintenance Job] Error sending push notification:`, error);
  }
};

export const checkMaintenanceSchedule = async () => {
  console.log('[Maintenance Job] Starting daily maintenance check...');
  
  try {
    // 1. Find upcoming maintenance logs and cross-check with actual vehicle mileage
    const result = await query(`
      SELECT 
        m.id AS log_id,
        m.component_type,
        m.due_date,
        m.target_mileage,
        m.status,
        m.description,
        v.id AS vehicle_id,
        v.brand,
        v.model,
        v.plate_no,
        v.mileage AS current_mileage
      FROM maintenance_logs m
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.status IN ('upcoming', 'warning')
    `);

    const logs = result.rows;
    let warningCount = 0;
    let criticalCount = 0;

    for (const log of logs) {
      let isWarning = false;
      let isCritical = false;

      // a) Date-based checking
      if (log.due_date) {
        const dueDate = new Date(log.due_date);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          isCritical = true;
        } else if (diffDays <= 14) {
          isWarning = true;
        }
      }

      // b) Mileage-based checking
      if (log.target_mileage && log.current_mileage !== null && log.current_mileage !== undefined) {
        const diffMileage = log.target_mileage - log.current_mileage;
        
        if (diffMileage <= 0) {
          isCritical = true;
        } else if (diffMileage <= 1000) {
          // If we're already critical from date, keep it critical
          if (!isCritical) isWarning = true; 
        }
      }

      // 2. Update Database and notify if status changed
      if (isCritical && log.status !== 'critical') {
        await query(`UPDATE maintenance_logs SET status = 'critical' WHERE id = $1`, [log.log_id]);
        criticalCount++;
        
        await notifyAdmins(
          '🚨 ฉุกเฉิน: เกินกำหนดซ่อมบำรุง!',
          `รถ ${log.brand} ${log.model} (${log.plate_no}) เกินกำหนดการสำหรับ: ${log.description}`
        );
      } 
      else if (isWarning && log.status !== 'warning' && !isCritical) {
        await query(`UPDATE maintenance_logs SET status = 'warning' WHERE id = $1`, [log.log_id]);
        warningCount++;
        
        await notifyAdmins(
          '⚠️ แจ้งเตือนซ่อมบำรุง',
          `รถ ${log.brand} ${log.model} (${log.plate_no}) ใกล้ถึงกำหนด: ${log.description}`
        );
      }
    }

    console.log(`[Maintenance Job] Check completed. New Warnings: ${warningCount}, New Criticals: ${criticalCount}.`);
  } catch (error) {
    console.error('[Maintenance Job] Unexpected error during maintenance check:', error);
  }
};

// Schedule it to run every midnight
export const startMaintenanceCron = () => {
  cron.schedule('0 0 * * *', () => {
    checkMaintenanceSchedule();
  });
  console.log('[Maintenance Job] Cron scheduled: Daily at midnight (0 0 * * *)');
};
