const Games = require('../models/games')
const Users = require('../models/users')

module.exports = function(io){

    async function broadcastGameList(targetSocket = null){
        const games = await Games.findAll()
        const gameList = games.map(game => ({
            gameID: game.gameID,
            player1: game.player1,
            player2: game.player2,
            status: game.status,
            winner: game.winner,
            turn: game.turn
        
        }))

        if (targetSocket) {
            targetSocket.emit('listGames', gameList)
        } else {
            io.emit('listGames', gameList)
        }
    }
    io.on('connection', (socket) => {
        
        console.log('User connected: ', socket.user.userID)
        broadcastGameList(socket)
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.user.userID)
        })

        socket.on('createGame', async (callback) => {
            try{
                const user = await Users.findByPk(socket.user.userID)
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
                const user = await Users.findByPk(socket.user.userID)
                const openGames = await Games.findAll({ where: { status: 'Matchmaking', player2: null } })

                if (!openGames.length) {
                    return callback({success: false, message: 'No games available'})
                }

                const game = openGames[Math.floor(Math.random() * openGames.length)]
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

                const user = await Users.findByPk(socket.user.userID)
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