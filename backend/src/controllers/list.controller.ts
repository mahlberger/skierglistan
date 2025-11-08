import { Request, Response } from 'express';
import { listService } from '../services/list.service';

export const listController = {
  getList: async (req: Request, res: Response) : Promise<void> => {
    const list = await listService.getList();
    res.json(list);
  }
};

