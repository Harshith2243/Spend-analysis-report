const Sequelize = require('sequelize')
const path = require('path')

// Use SQLite by default for local development (no MySQL setup required)
const storagePath = path.join(__dirname, '..', 'database.sqlite')
const connection = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
})

module.exports = { connection }
