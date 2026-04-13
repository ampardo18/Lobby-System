import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from 'react'
import '../styles/global.css'
import profileIcon from '../assets/profile-icon.png'
import { io } from 'socket.io-client'


function Battleship(){
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [ isJoinOpen, setIsJoinOpen ] = useState(false)
    const [ user, setUser ] = useState<{firstname: string; lastname: string; username: string} | null>(null)
    const [ games, setGames ] = useState<{gameID: string; player1: string; player2: string; turn: string; status: string | null}[]>([])
    const [ gameCode, setGameCode ] = useState('')
    const profileRef = useRef<HTMLDivElement | null>(null)
    const joinRef = useRef<HTMLDivElement | null>(null)
    const socketRef = useRef<any>(null)


    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token) return

        socketRef.current = io(import.meta.env.VITE_PUBLIC_HOST, {
            auth: { token }
        })

        socketRef.current.on('connection', () => {
            console.log('Socket succesffuly connected: ', socketRef.current.id)
        })
    }, [])

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
            const target = event.target as Node
            const clickedInsideProfile = profileRef.current?.contains(target)
            const clickedInsideJoin = joinRef.current?.contains(target)

            if (!clickedInsideProfile && !clickedInsideJoin) {
                setIsProfileOpen(false)
                setIsJoinOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    useEffect(() => {
        socketRef.current?.on('listGames', (gamesList: {gameID: string; player1: string; player2: string; turn: string; status: string | null}[]) => {
            setGames(gamesList)
        })
        return () => {
            socketRef.current?.off('listGames')
        }
    }, [])


    const handleLogout = () => {
        console.log('Disconnect Successful: ', socketRef.current?.id)
        socketRef.current?.disconnect()
        socketRef.current = null
        localStorage.removeItem('token')
        navigate('/login', {replace: true})
    }

    const handleGameCreation = () => {
        socketRef.current?.emit('createGame', (response : {success: boolean; gameID?: string}) => {
            if(!response.success || !response.gameID){
                console.log('Failed to create game')
                return
            }
            console.log('Created game succesfully with id: ', response.gameID)
            navigate(`/game/${response.gameID}`)
        })
    }

    const handleJoinGameMatchmaking = () => {
        socketRef.current?.emit('joinGameMatchmaking', (response: {success: boolean; gameID?: string; message?: string}) => {
            if (!response.success || !response.gameID) {
                console.log('Failed to join:', response.message)
                return
            }
            console.log('Successfully joined game with id:', response.gameID)
            navigate(`/game/${response.gameID}`)
        })
    }

    const handleJoinGameCode = () => {
        socketRef.current?.emit('joinGameCode', gameCode, (response: {success: boolean; gameID?: string; message?: string}) => { 
            if (!response.success || !response.gameID) {
                console.log('Failed to join:', response.message)
                return
            }
            console.log('Successfully joined game with id:', response.gameID)
            navigate(`/game/${response.gameID}`)
        })
    }

    return(
        <div>
            <header className="bg-blue-400">
                <div className="flex items-center justify-between p-4"> 
                    <h1 className="app-title">Battleship Games</h1>
                    <div className="relative" ref={profileRef}>
                        <button className="profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}><img src={profileIcon}/></button>
                        {isProfileOpen && (
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
                <div className="bg-gray-400 w-1/2 h-32 text-center p-4 rounded-2xl">
                    <h1 className="text-2xl font-bold mb-4">Game Creation</h1>
                    <div className="flex gap-4">
                        <button className="main-buttons" onClick={handleGameCreation}>Create Game</button>
                        <button className="main-buttons" onClick={() => setIsJoinOpen(!isJoinOpen)}>Join Game</button>
                        {isJoinOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-80" ref={joinRef}>
                                    <button className="main-buttons text-sm" onClick={handleJoinGameMatchmaking}>Random Matchmaking</button>
                                    <div className="flex items-center my-4">
                                        <div className="flex-1 h-px bg-black" />
                                        <span className="px-2 text-sm text-black">or</span>
                                        <div className="flex-1 h-px bg-black" />
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                        type="text"
                                        placeholder='Enter game code'
                                        onChange={e => setGameCode(e.target.value)}
                                        className='w-full border rounded p-2 mb-4'
                                        />
                                        <button className="main-buttons" onClick={handleJoinGameCode}>Join</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-gray-400 w-2/3 h-32 text-center p-4 rounded-2xl">
                    <h1 className="text-2xl font-bold">Active Games</h1>
                    {games.length === 0 ? (
                        <p>No active games</p>
                    ) : (
                        games.map(game => (
                            <div key={game.gameID} className="flex flex-col justify-between items-center bg-gray-200 rounded">
                                <span>{game.player1} vs {game.player2} - Status: {game.status} - Current Turn: {game.turn}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
   
    )

}

export default Battleship