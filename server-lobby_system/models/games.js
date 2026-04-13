const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { customAlphabet } = require('nanoid')

const code = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)
 
const Games = sequelize.define('Games', {
    gameID: {
        type: DataTypes.UUID, 
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    player1: {
        type: DataTypes.STRING,
        allowNull: true
    },
    player2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    turn: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => code(),
        unique: true
    }
})

module.exports = Games