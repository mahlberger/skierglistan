const up = (pgm) => {
  pgm.createTable('erg_brands', {
    id: 'id',
    name: { type: 'text', notNull: true, unique: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  })

  pgm.addColumns('facilities', {
    extra_information: { type: 'text' },
    erg_brand_id: { type: 'integer' }
  })

  pgm.sql(`
    INSERT INTO erg_brands (name)
    SELECT DISTINCT erg_brand
    FROM facilities
    WHERE erg_brand IS NOT NULL
  `)

  pgm.sql(`
    UPDATE facilities f
    SET erg_brand_id = eb.id
    FROM erg_brands eb
    WHERE f.erg_brand = eb.name
  `)

  pgm.createIndex('facilities', ['erg_brand_id'])
  pgm.addConstraint('facilities', 'facilities_erg_brand_id_fkey', {
    foreignKeys: {
      columns: 'erg_brand_id',
      references: 'erg_brands(id)',
      onDelete: 'SET NULL'
    }
  })

  pgm.dropColumn('facilities', 'erg_brand')
}

const down = (pgm) => {
  pgm.addColumn('facilities', {
    erg_brand: { type: 'text' }
  })

  pgm.sql(`
    UPDATE facilities f
    SET erg_brand = eb.name
    FROM erg_brands eb
    WHERE f.erg_brand_id = eb.id
  `)

  pgm.dropConstraint('facilities', 'facilities_erg_brand_id_fkey')
  pgm.dropIndex('facilities', ['erg_brand_id'])
  pgm.dropColumns('facilities', ['erg_brand_id', 'extra_information'])
  pgm.dropTable('erg_brands')
}

module.exports = { up, down }


