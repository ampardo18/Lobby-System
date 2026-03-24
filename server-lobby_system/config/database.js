const { Sequelize } = require('sequelize')
const path = require('path')
const result = require('dotenv').config({path: path.resolve(__dirname, './.env.development')})


const sequelize = new Sequelize(
  process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
  }
)

module.exports = sequelize