import { Request, Response } from 'express';
import { healthService } from '../services/health.service';

export const healthController = {
  check: async (req: Request, res: Response) : Promise<void> => {
    try {
      const databaseStatus = await healthService.checkDatabase();
      res.json({ 
        status: 'ok',
        ...databaseStatus
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ 
        status: 'error',
        error: 'Database connection failed' 
      });
    }
  }
};

