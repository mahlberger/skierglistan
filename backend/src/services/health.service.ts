import { query } from '../database/connection';

export const healthService = {
  checkDatabase: async () : Promise<{ database: string, timestamp: string }> => {
    const result = await query('SELECT NOW() as current_time');
    return {
      database: 'connected',
      timestamp: result.rows[0].current_time
    };
  }
};

