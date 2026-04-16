import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { io } from 'socket.io-client'

function Game(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [ gameDetails, setGameDetails ] = useState<{player1: string; player2: string; status: string; code: string} | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token) return
        const socket = io(import.meta.env.VITE_PUBLIC_HOST, {
            auth: { token }
        })
        console.log('gameid',id)
        socket.emit('getGameDetails', id, (response: {success: boolean; gameDetails?: typeof gameDetails; message?: string}) => {
            if(response.success && response.gameDetails){
                setGameDetails(response.gameDetails)
            }else{
                console.log(response.message)
            }
        })
    }, [id])

    return(
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="relative bg-blue-400 flex items-center justify-center h-12">
                <button className="cursor-pointer absolute left-4" onClick={()=> navigate('/lobby')}><ArrowLeft size={30}/></button>
                <h1 className="font-bold text-2xl">{gameDetails?.player1} vs {gameDetails?.player2}</h1>
            </header>
            <div className="flex flex-col flex-1 items-center justify-center gap-4">
                <div className="grid grid-cols-5 gap-1">
                    {Array.from({length: 5 * 5}).map((_, index) => (
                        <div 
                            key={index}
                            className="w-16 h-16 bg-blue-200 border border-blue-400"
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