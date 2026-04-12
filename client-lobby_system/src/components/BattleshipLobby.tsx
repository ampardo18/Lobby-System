import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from 'react'
import '../styles/global.css'
import profileIcon from '../assets/profile-icon.png'
import { io } from 'socket.io-client'

const socket = io(`${import.meta.env.VITE_PUBLIC_HOST}`, {
  auth: {
    token: localStorage.getItem('token')
  }
})


function Battleship(){
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [ user, setUser ] = useState<{firstname: string; lastname: string; username: string} | null>(null)
    const [ games, setGames ] = useState<{id: string; player1: string; player2: string; status: string | null}[]>([])
    const [ gameCode, setGameCode ] = useState('')
    const dropdownref = useRef<HTMLDivElement | null>(null)


    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login', {replace: true})
    }

    const handleGameCreation = () => {
        socket.emit('createGame', (response : {success: boolean; gameID?: string}) => {
            if(!response.success || !response.gameID){
                console.log('Failed to create game')
                return
            }
            console.log('Created game succesfully with id: ', response.gameID)
            navigate(`/game/${response.gameID}`)
        })
    }

    const handleJoinGameMatchmaking = () => {
        socket.emit('joinGameMatchmaking', (response: {success: boolean; gameID?: string; message?: string}) => {
            if (!response.success || !response.gameID) {
                console.log('Failed to join:', response.message)
                return
            }
            console.log('Successfully joined game with id:', response.gameID)
            navigate(`/game/${response.gameID}`)
        })
    }

    const handleJoinGameCode = () => {
        socket.emit('joinGameCode', gameCode, (response: {success: boolean; gameID?: string; message?: string}) => { 
            if (!response.success || !response.gameID) {
                console.log('Failed to join:', response.message)
                return
            }
            console.log('Successfully joined game with id:', response.gameID)
            navigate(`/game/${response.gameID}`)
        })
    }

  
    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch(`${import.meta.env.VITE_PUBLIC_HOST}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then((data) =>{
            console.log(data)
            setUser(data)
        })

    }, [])

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if(dropdownref.current && !dropdownref.current.contains(event.target as Node)){
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return() => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    })

    useEffect(() => {
        socket.on('listGames', (gamesList) => {
            setGames(gamesList)
        })
        return () => {
            socket.off('listGames')
        }
    })

    return(
        <div>
            <header className="bg-blue-300">
                <div className="flex items-center justify-between p-4"> 
                    <h1 className="app-title">Battleship Games</h1>
                    <div className="relative" ref={dropdownref}>
                        <button className="profile-button" onClick={() => setIsOpen(!isOpen)}><img src={profileIcon}/></button>
                        {isOpen && (
                            <div className="user-menu">
                                <div className="flex flex-col items-center space-y-1">
                                    <p className="text-sm font-semibold text-gray-900 mt-2">{user?.username}</p>
                                    <img src={profileIcon} className="w-10 h-10 border-3 rounded-full"/>
                                    <p className="text-sm">Signed in as: </p>
                                    <p className="text-sm">{user?.firstname} {user?.lastname}</p>
                                    <button className="main-buttons mb-2" onClick={handleLogout}>Logout</button>
                    
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className="flex justify-between gap-12 p-4 w-3/4 mx-auto">
                <div className="bg-gray-400 w-1/2 h-32 text-center p-4">
                    <h1 className="text-2xl font-bold mb-4">Game Creation</h1>
                    <div className="flex gap-4">
                        <button className="main-buttons" onClick={handleGameCreation}>Create Game</button>
                        <button className="main-buttons" >Join Game</button>
                    </div>
                </div>
                <div className="bg-gray-400 w-2/3 h-32 text-center p-4">
                    <h1 className="text-2xl font-bold">Active Games</h1>
                    {games.length === 0 ? (
                        <p>No active games</p>
                    ) : (
                        games.map(game => (
                            <div key={game.id} className="flex flex-col justify-between items-center bg-gray-200 rounded">
                                <span>{game.player1} vs {game.player2} - {game.status}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
   
    )

}

export default Battleship