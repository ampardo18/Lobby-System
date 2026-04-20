import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getSocket } from '../utils/socket'

function Game(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [ gameDetails, setGameDetails ] = useState<{player1: string; player2: string; status: string; code: string; turn: string} | null>(null)
    const [ user, setUser ] = useState<{username: string} | null>(null)
    const [ selected, setSelected ] = useState<number[]>([])
    const [ canPlaceShips, setCanPlaceShips ] = useState(false)

    const token = localStorage.getItem('token')
    if(!token) return
    const socket = getSocket(token)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_PUBLIC_HOST}/user`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => setUser(data))
    }, [])

    useEffect(() => {
        socket.emit('getGameDetails', id, (response: {success: boolean; gameDetails?: typeof gameDetails; message?: string}) => {
            if(response.success && response.gameDetails){
                setGameDetails(response.gameDetails)
            }else{
                console.log(response.message)
            }
        })
    }, [id])

    useEffect(() => {
        socket.on('gameStart', (gameStartData: { gameID: string; player1: string; player2: string; turn: string}) => {
            console.log('Game started successfully: ', gameStartData)
            if(gameStartData.gameID === id && gameStartData.turn === 'player1' && user?.username === gameStartData.player1 && gameDetails?.status === 'Playing'){
                setCanPlaceShips(true)
            }
        })

        socket.off('gameStart')
    })

    const toggleCell = (index: number) => {
        setSelected(prev => 
            prev.includes(index)
            ? prev.filter(i => i !== index)
            : [...prev, index]
        )
    }

    return(
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="relative bg-blue-400 flex items-center justify-center h-12">
                <button className="cursor-pointer absolute left-4" onClick={()=> navigate('/lobby')}><ArrowLeft size={30}/></button>
                <h1 className="font-bold text-2xl">{gameDetails?.player1} vs {gameDetails?.player2}</h1>
            </header>
            <div className="flex flex-col flex-1 items-center justify-center gap-4">
                {gameDetails?.status === 'Playing' && (
                    <h2 className="text-sm text-black font-bold">
                        {user?.username === (gameDetails.turn === 'player 1' ? gameDetails.player1 : gameDetails.player2)
                        ? 'It is your turn!'
                        : `It is your opponent's turn!`
                        }
                    </h2>
                )}
                <div className="grid grid-cols-5 gap-1">
                    {Array.from({length: 5 * 5}).map((_, index) => (
                        <div 
                            key={index}
                            className={`grid-design ${selected.includes(index) ? "bg-blue-400 ": "bg-blue-200 hover:bg-blue-300"}`}
                            onClick={() => toggleCell(index)}
                            role="button"
                        />
                    ))}
                </div> 
                <button className="submit-play-button">Submit Ships</button>
                <p className="absolute bottom-4 left-4">Game Code: {gameDetails?.code}</p>
            </div>

        </div>
       
    )
}

export default Game