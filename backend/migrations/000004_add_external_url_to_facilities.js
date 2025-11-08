const up = (pgm) => {
  pgm.addColumn('facilities', {
    external_url: { type: 'text' }
  })
}

const down = (pgm) => {
  pgm.dropColumn('facilities', 'external_url')
}

module.exports = { up, down }


