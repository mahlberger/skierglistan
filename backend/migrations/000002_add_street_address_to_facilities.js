const up = (pgm) => {
  pgm.addColumn('facilities', {
    street_address: { type: 'text', notNull: true, default: '' }
  })
  pgm.alterColumn('facilities', 'street_address', { default: null })
}

const down = (pgm) => {
  pgm.dropColumn('facilities', 'street_address')
}

module.exports = { up, down }


