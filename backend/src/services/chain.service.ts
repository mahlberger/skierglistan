import { query } from '../database/connection';
import { Chain, CreateChainInput, UpdateChainInput } from '../types';

export const chainService = {
  getAll: async (): Promise<Chain[]> => {
    const result = await query('SELECT id, name FROM chains ORDER BY id');
    return result.rows as Chain[];
  },

  getById: async (id: number): Promise<Chain | null> => {
    const result = await query('SELECT id, name FROM chains WHERE id = $1', [id]);
    return result.rows[0] as Chain | null;
  },

  create: async (input: CreateChainInput): Promise<Chain> => {
    const result = await query('INSERT INTO chains (name) VALUES ($1) RETURNING id, name', [input.name]);
    return result.rows[0] as Chain;
  },

  update: async (id: number, input: UpdateChainInput): Promise<Chain | null> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }

    if (fields.length === 0) {
      return await chainService.getById(id);
    }

    values.push(id);
    const result = await query(`UPDATE chains SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name`, values);
    return result.rows[0] as Chain | null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await query('DELETE FROM chains WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};


