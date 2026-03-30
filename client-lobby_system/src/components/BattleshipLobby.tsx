import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from 'react'
import '../styles/global.css'
import profileIcon from '../assets/profile-icon.png'


function Battleship(){
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [ user, setUser ] = useState<{firstname: string; lastname: string; email: string} | null>(null)
    const dropdownref = useRef<HTMLDivElement | null>(null)


    const handelLogout = () => {
        localStorage.removeItem('token')
        navigate('/login', {replace: true})
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


    return(
        <div>
            
            <header className="bg-blue-300">
                <div className="flex items-center justify-between p-4"> 
                    <h1 className="app-title">Battleship Games</h1>
                    <div className="relative" ref={dropdownref}>
                        <button className="profile-button" onClick={() => setIsOpen(!isOpen)}><img src={profileIcon}/></button>
                        {isOpen && (
                            <div className="absolute right-5 mt-2 w-64 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="flex flex-col items-center space-y-1">
                                    <p className="text-sm font-semibold text-gray-900 mt-2">{user?.email}</p>
                                    <img src={profileIcon} className="w-10 h-10 border-3 rounded-full"/>
                                    <p className="text-sm">Signed in as: </p>
                                    <p className="text-sm">{user?.firstname} {user?.lastname}</p>
                                    <button className="main-buttons mb-2" onClick={handelLogout}>Logout</button>
                    
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

        </div>
   
    )

}

export default Battleship