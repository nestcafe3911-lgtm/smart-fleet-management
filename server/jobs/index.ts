import { startMaintenanceCron } from './maintenanceJob';

export const startCronJobs = () => {
  console.log('[Cron] Initializing all scheduled jobs...');
  startMaintenanceCron();
};
