import { Request, Response } from 'express';
import { facilityService } from '../services/facility.service';
import { chainService } from '../services/chain.service';
import { ergBrandService } from '../services/ergBrand.service';
import { CreateFacilityInput, UpdateFacilityInput } from '../types';

export const facilityController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    console.log('getAll');
    const facilities = await facilityService.getAll();
    console.log('facilities', facilities);
    res.json(facilities);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid facility ID' });
      return;
    }

    const facility = await facilityService.getById(id);
    if (!facility) {
      res.status(404).json({ error: 'Facility not found' });
      return;
    }

    res.json(facility);
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { spamGuard, ...rest } = req.body ?? {};
    if (spamGuard !== undefined && spamGuard !== null && String(spamGuard).trim().length > 0) {
      res.status(400).json({ error: 'Invalid submission' });
      return;
    }

    const input: CreateFacilityInput = rest;

    if (!input.name || !input.city || !input.postalCode || !input.streetAddress || input.numberOfErgs === undefined) {
      res.status(400).json({ error: 'Missing required fields: name, city, postalCode, streetAddress, numberOfErgs' });
      return;
    }

    if (typeof input.numberOfErgs !== 'number' || input.numberOfErgs < 0) {
      res.status(400).json({ error: 'numberOfErgs must be a non-negative number' });
      return;
    }
    if (input.extraInformation !== undefined && input.extraInformation !== null && typeof input.extraInformation !== 'string') {
      res.status(400).json({ error: 'extraInformation must be a string if provided' });
      return;
    }
    if (input.ergBrandId !== undefined && input.ergBrandId !== null && typeof input.ergBrandId !== 'number') {
      res.status(400).json({ error: 'ergBrandId must be a number if provided' });
      return;
    }
    if (input.externalUrl !== undefined && input.externalUrl !== null && typeof input.externalUrl !== 'string') {
      res.status(400).json({ error: 'externalUrl must be a string if provided' });
      return;
    }
    if (input.chainId !== undefined && input.chainId !== null) {
      const chain = await chainService.getById(input.chainId);
      if (!chain) {
        res.status(400).json({ error: 'Invalid chainId' });
        return;
      }
    }
    if (input.ergBrandId !== undefined && input.ergBrandId !== null) {
      const ergBrand = await ergBrandService.getById(input.ergBrandId);
      if (!ergBrand) {
        res.status(400).json({ error: 'Invalid ergBrandId' });
        return;
      }
    }

    try {
      const facility = await facilityService.create(input);
      res.status(201).json(facility);
    } catch {
      res.status(500).json({ error: 'Failed to create facility' });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid facility ID' });
      return;
    }

    const { spamGuard, ...rest } = req.body ?? {};
    if (spamGuard !== undefined && spamGuard !== null && String(spamGuard).trim().length > 0) {
      res.status(400).json({ error: 'Invalid submission' });
      return;
    }

    const input: UpdateFacilityInput = rest;

    if (input.numberOfErgs !== undefined && (typeof input.numberOfErgs !== 'number' || input.numberOfErgs < 0)) {
      res.status(400).json({ error: 'numberOfErgs must be a non-negative number' });
      return;
    }
    if (input.streetAddress !== undefined && typeof input.streetAddress !== 'string') {
      res.status(400).json({ error: 'streetAddress must be a string' });
      return;
    }
    if (input.extraInformation !== undefined && input.extraInformation !== null && typeof input.extraInformation !== 'string') {
      res.status(400).json({ error: 'extraInformation must be a string if provided' });
      return;
    }
    if (input.ergBrandId !== undefined && input.ergBrandId !== null && typeof input.ergBrandId !== 'number') {
      res.status(400).json({ error: 'ergBrandId must be a number if provided' });
      return;
    }
    if (input.externalUrl !== undefined && input.externalUrl !== null && typeof input.externalUrl !== 'string') {
      res.status(400).json({ error: 'externalUrl must be a string if provided' });
      return;
    }
    if (input.chainId !== undefined && input.chainId !== null) {
      const chain = await chainService.getById(input.chainId);
      if (!chain) {
        res.status(400).json({ error: 'Invalid chainId' });
        return;
      }
    }
    if (input.ergBrandId !== undefined && input.ergBrandId !== null) {
      const ergBrand = await ergBrandService.getById(input.ergBrandId);
      if (!ergBrand) {
        res.status(400).json({ error: 'Invalid ergBrandId' });
        return;
      }
    }

    const facility = await facilityService.update(id, input);
    if (!facility) {
      res.status(404).json({ error: 'Facility not found' });
      return;
    }

    res.json(facility);
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid facility ID' });
      return;
    }

    const deleted = await facilityService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Facility not found' });
      return;
    }

    res.status(204).send();
  }
};

