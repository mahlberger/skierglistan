const up = (pgm) => {
  pgm.createTable('chains', {
    id: 'id',
    name: { type: 'text', notNull: true, unique: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  })

  pgm.createTable('facilities', {
    id: 'id',
    name: { type: 'text', notNull: true },
    city: { type: 'text', notNull: true },
    postal_code: { type: 'text', notNull: true },
    number_of_ergs: { type: 'integer', notNull: true },
    chain_id: { type: 'integer' },
    erg_brand: { type: 'text' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  })

  pgm.createIndex('facilities', ['city'])
  pgm.createIndex('facilities', ['chain_id'])
  pgm.createConstraint('facilities', 'facilities_chain_id_fkey', {
    foreignKeys: {
      columns: 'chain_id',
      references: 'chains(id)',
      onDelete: 'SET NULL',
    },
  })
}

const down = (pgm) => {
  pgm.dropTable('facilities')
  pgm.dropTable('chains')
}

module.exports = { up, down }


