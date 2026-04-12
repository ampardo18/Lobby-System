const {v4: uuidv4} = require('uuid')
const Games = require('../models/games')
const Users = require('../models/users')

module.exports = function(io){

    async function broadcastGameList(){
        const games = await Games.findAll()
        const gameList = games.map(game => ({
            id: game.gameID,
            player1: game.player1,
            player2: game.player2,
            status: game.status,
            turn: game.turn
        }))

        io.emit('listGames', gameList)
    }
    io.on('connection', (socket) => {
        socket.on('createGame', async (callback) => {
            try{
                const user = await Users.findById(socket.user.userID)
                const game = await Games.create({
                    player1: user.username,
                    status: 'Matchmaking'
                })
                socket.join(game.gameID)
                await broadcastGameList()
                callback({success: true, gameID: game.gameID})
            }catch(error){
                console.error(error)
                callback({success: false})
            }
        })

        socket.on('joinGameMatchmaking', async (callback) => {
            try{
                const user = await Users.findById(socket.user.userID)
                const game = await Games.findOne({ where: {status: 'Matchmaking'}})

                if(!game || game.player2){
                    return callback({success: false, message: 'No games available'})
                }

                game.player2 = user.username
                game.status = 'Playing'
                game.turn = 'player 1'
                await game.save()
                socket.join(game.gameID)
                await broadcastGameList()
                io.to(game.gameID).emit('gameStart', { gameID: game.gameID, player1: game.player1, player2: game.player2 })
                callback({success: true, gameID: game.gameID})

            }catch(error){
                console.error(error)
                callback({success: false})
            }
        })

        socket.on('joinGameCode', async (code, callback) => {
            try{   
                const game = await Games.findOne({where: {gameJoinCode: code, status: 'Matchmaking'}})
                if(!game || game.player2){
                    return callback({ success: false, message: 'Game not available'})
                }

                const user = await Users.findById(socket.user.userID)
                game.player2 = user.username
                game.status = 'Playing'
                game.turn = 'player 1'
                await game.save()
                socket.join(game.gameID)
                await broadcastGameList()
                io.to(game.gameID).emit('gameStart', { gameID: game.gameID, player1: game.player1, player2: game.player2 })
                callback({success: true, gameID: game.gameID})


            }catch(error){
                console.error(error)
                callback({success: false})
            }
        })
    })
}