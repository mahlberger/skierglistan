import { query } from '../database/connection';

export const listService = {
  getList: async () : Promise<{ list: { id: string, name: string }[] }> => {
    const result = await query("SELECT '1' as id, 'Skierglistan' as name");
    return {
      list: result.rows
    };
  }
};

