import { query } from '../database/connection';
import { Facility, CreateFacilityInput, UpdateFacilityInput } from '../types';

export const facilityService = {
  getAll: async (): Promise<Facility[]> => {
    const result = await query(
      'SELECT f.id, f.name, f.city, f.postal_code as "postalCode", f.street_address as "streetAddress", f.number_of_ergs as "numberOfErgs", c.name as "chainName", eb.name as "ergBrandName", f.extra_information as "extraInformation", f.external_url as "externalUrl" FROM facilities f LEFT JOIN chains c ON c.id = f.chain_id LEFT JOIN erg_brands eb ON eb.id = f.erg_brand_id ORDER BY f.id'
    );
    return result.rows as Facility[];
  },

  getById: async (id: number): Promise<Facility | null> => {
    const result = await query(
      'SELECT f.id, f.name, f.city, f.postal_code as "postalCode", f.street_address as "streetAddress", f.number_of_ergs as "numberOfErgs", c.name as "chainName", eb.name as "ergBrandName", f.extra_information as "extraInformation", f.external_url as "externalUrl" FROM facilities f LEFT JOIN chains c ON c.id = f.chain_id LEFT JOIN erg_brands eb ON eb.id = f.erg_brand_id WHERE f.id = $1',
      [id]
    );
    return result.rows[0] as Facility | null;
  },

  create: async (input: CreateFacilityInput): Promise<Facility> => {
    const result = await query(
      'WITH inserted AS (INSERT INTO facilities (name, city, postal_code, street_address, number_of_ergs, chain_id, erg_brand_id, extra_information, external_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, city, postal_code, street_address, number_of_ergs, chain_id, erg_brand_id, extra_information, external_url) SELECT i.id, i.name, i.city, i.postal_code as "postalCode", i.street_address as "streetAddress", i.number_of_ergs as "numberOfErgs", c.name as "chainName", eb.name as "ergBrandName", i.extra_information as "extraInformation", i.external_url as "externalUrl" FROM inserted i LEFT JOIN chains c ON c.id = i.chain_id LEFT JOIN erg_brands eb ON eb.id = i.erg_brand_id',
      [input.name, input.city, input.postalCode, input.streetAddress, input.numberOfErgs, input.chainId ?? null, input.ergBrandId ?? null, input.extraInformation ?? null, input.externalUrl ?? null]
    );
    return result.rows[0] as Facility;
  },

  update: async (id: number, input: UpdateFacilityInput): Promise<Facility | null> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }
    if (input.city !== undefined) {
      fields.push(`city = $${paramIndex++}`);
      values.push(input.city);
    }
    if (input.postalCode !== undefined) {
      fields.push(`postal_code = $${paramIndex++}`);
      values.push(input.postalCode);
    }
    if (input.streetAddress !== undefined) {
      fields.push(`street_address = $${paramIndex++}`);
      values.push(input.streetAddress);
    }
    if (input.extraInformation !== undefined) {
      fields.push(`extra_information = $${paramIndex++}`);
      values.push(input.extraInformation);
    }
    if (input.externalUrl !== undefined) {
      fields.push(`external_url = $${paramIndex++}`);
      values.push(input.externalUrl);
    }
    if (input.numberOfErgs !== undefined) {
      fields.push(`number_of_ergs = $${paramIndex++}`);
      values.push(input.numberOfErgs);
    }
    if (input.chainId !== undefined) {
      fields.push(`chain_id = $${paramIndex++}`);
      values.push(input.chainId);
    }
    if (input.ergBrandId !== undefined) {
      fields.push(`erg_brand_id = $${paramIndex++}`);
      values.push(input.ergBrandId);
    }

    if (fields.length === 0) {
      return await facilityService.getById(id);
    }

    values.push(id);
    const result = await query(
      `WITH updated AS (UPDATE facilities SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, city, postal_code, street_address, number_of_ergs, chain_id, erg_brand_id, extra_information, external_url) SELECT u.id, u.name, u.city, u.postal_code as "postalCode", u.street_address as "streetAddress", u.number_of_ergs as "numberOfErgs", c.name as "chainName", eb.name as "ergBrandName", u.extra_information as "extraInformation", u.external_url as "externalUrl" FROM updated u LEFT JOIN chains c ON c.id = u.chain_id LEFT JOIN erg_brands eb ON eb.id = u.erg_brand_id`,
      values
    );
    return result.rows[0] as Facility | null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await query('DELETE FROM facilities WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};

