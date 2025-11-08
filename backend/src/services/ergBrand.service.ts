import { query } from '../database/connection';
import { ErgBrand, CreateErgBrandInput, UpdateErgBrandInput } from '../types';

export const ergBrandService = {
  getAll: async (): Promise<ErgBrand[]> => {
    const result = await query('SELECT id, name FROM erg_brands ORDER BY id');
    return result.rows as ErgBrand[];
  },

  getById: async (id: number): Promise<ErgBrand | null> => {
    const result = await query('SELECT id, name FROM erg_brands WHERE id = $1', [id]);
    return result.rows[0] as ErgBrand | null;
  },

  create: async (input: CreateErgBrandInput): Promise<ErgBrand> => {
    const result = await query('INSERT INTO erg_brands (name) VALUES ($1) RETURNING id, name', [input.name]);
    return result.rows[0] as ErgBrand;
  },

  update: async (id: number, input: UpdateErgBrandInput): Promise<ErgBrand | null> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }

    if (fields.length === 0) {
      return await ergBrandService.getById(id);
    }

    values.push(id);
    const result = await query(`UPDATE erg_brands SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name`, values);
    return result.rows[0] as ErgBrand | null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await query('DELETE FROM erg_brands WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};


