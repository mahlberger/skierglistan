import { Request, Response } from 'express';
import { ergBrandService } from '../services/ergBrand.service';
import { CreateErgBrandInput, UpdateErgBrandInput } from '../types';

export const ergBrandController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    const ergBrands = await ergBrandService.getAll();
    res.json(ergBrands);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid erg brand ID' });
      return;
    }

    const ergBrand = await ergBrandService.getById(id);
    if (!ergBrand) {
      res.status(404).json({ error: 'Erg brand not found' });
      return;
    }

    res.json(ergBrand);
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const input: CreateErgBrandInput = req.body;

    if (!input.name) {
      res.status(400).json({ error: 'Missing required field: name' });
      return;
    }

    try {
      const ergBrand = await ergBrandService.create(input);
      res.status(201).json(ergBrand);
    } catch {
      res.status(500).json({ error: 'Failed to create erg brand' });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid erg brand ID' });
      return;
    }

    const input: UpdateErgBrandInput = req.body;

    const ergBrand = await ergBrandService.update(id, input);
    if (!ergBrand) {
      res.status(404).json({ error: 'Erg brand not found' });
      return;
    }

    res.json(ergBrand);
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid erg brand ID' });
      return;
    }

    const deleted = await ergBrandService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Erg brand not found' });
      return;
    }

    res.status(204).send();
  }
};


