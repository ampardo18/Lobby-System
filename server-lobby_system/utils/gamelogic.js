const {v4: uuidv4} = require('uuid')

module.exports = function(io){

    const games = []
    function broadcastGameList(){
        const gameList = games.map(games => ({
            id: games.id,
            player1: games.players[0] || null,
            player2: games.players[1] || null,
            status: games.status
        }))

        io.emit('listGames', gameList)
    }
    io.on('connection', (socket) => {
        socket.on('createGame', (username, callback) => {
            const gameID = `${uuidv4().split('-')[0]}`

            const newGame = {
                id: gameID,
                players: [username],
                boards: {},
                status: 'Matchmaking',
                turn: null
            }
            games.push(newGame)
            socket.join(gameID)

            broadcastGameList()
            callback(gameID)
        })

        socket.on('joinGame', (username, callback) => {
            let game = games.find(g => g.stage === 'Matchmaking')

            if (!game || game.players.length >= 2) return callback(false);

            game.players.push(username)
            game.status = 'Playing'
            socket.join(gameID)
            broadcastGameList()
            io.to(game.id).emit('gameStart', { gameID: game.id, players: game.players })
            callback(true);
        })
    })
}