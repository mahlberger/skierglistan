import { Request, Response } from 'express';
import { chainService } from '../services/chain.service';
import { CreateChainInput, UpdateChainInput } from '../types';

export const chainController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    const chains = await chainService.getAll();
    res.json(chains);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid chain ID' });
      return;
    }

    const chain = await chainService.getById(id);
    if (!chain) {
      res.status(404).json({ error: 'Chain not found' });
      return;
    }

    res.json(chain);
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const input: CreateChainInput = req.body;

    if (!input.name) {
      res.status(400).json({ error: 'Missing required field: name' });
      return;
    }

    try {
      const chain = await chainService.create(input);
      res.status(201).json(chain);
    } catch {
      res.status(500).json({ error: 'Failed to create chain' });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid chain ID' });
      return;
    }

    const input: UpdateChainInput = req.body;

    const chain = await chainService.update(id, input);
    if (!chain) {
      res.status(404).json({ error: 'Chain not found' });
      return;
    }

    res.json(chain);
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid chain ID' });
      return;
    }

    const deleted = await chainService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Chain not found' });
      return;
    }

    res.status(204).send();
  }
};


