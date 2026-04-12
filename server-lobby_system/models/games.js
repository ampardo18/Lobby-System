const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { nanoid } = require('nanoid')
 
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
        defaultValue: () => nanoid(6),
        unique: true
    }
})

module.exports = Games