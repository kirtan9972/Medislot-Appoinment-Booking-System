import React, { useEffect } from 'react';
import API from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

/**
 * ReminderManager handles the logic for triggering appointment reminders.
 * Currently disabled as the backend endpoint is not implemented.
 */
const ReminderManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Temporarily disabled until backend endpoint is implemented
  /*
  const { user } = useAuth();

  useEffect(() => {
    const checkReminders = async () => {
      try {
        const { data } = await API.post('/notifications/check-reminders', {});
        if (data.processed > 0) {
          console.log(`[ReminderManager] Processed ${data.processed} new reminders.`);
        }
      } catch (error) {
        console.error('[ReminderManager] Failed to check reminders:', error);
      }
    };

    // Initial check
    checkReminders();

    // Check every 5 minutes (300,000 ms)
    const interval = setInterval(checkReminders, 300000);

    return () => clearInterval(interval);
  }, [user]);
  */

  return <>{children}</>;
};

export default ReminderManager;
