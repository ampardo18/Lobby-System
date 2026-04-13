import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import '../styles/global.css'


function Login(){
    const navigate = useNavigate()
     const [formData, setFormData] = useState({
            username: '',
            password: ''
        })
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target
            setFormData({
                ...formData, 
                [name] : value
            })
        }

        const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault()
            try{
                const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    })
                })

                const data = await response.json()
                if(response.ok){
                    localStorage.setItem("token", data.token)
                    console.log(data.message, data.token)
                    navigate('/lobby', {replace: true})
                }else{
                    alert(data.message || "log-in failed")
                }
            }catch(error){
                console.error(error)
            }
        }

    return(
        <div>
            <h1 className="app-title">Welcome to the Battleship Game</h1>
            <form onSubmit={handleLogin} className="flex flex-col space-y-4 p-4 bg-gray-200 rounded-lg shadow-md max-w-md w-full mx-auto">
                <h2 className="text-l font-bold text-center">Sign-in</h2>
                <div className="flex flex-col">
                    <label>Username</label>
                    <input 
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
                    />
                </div>
                <button type="submit" className="main-buttons">Sign in</button>
                <div className="flex items-center my-2">
                    <div className="flex-1 h-px bg-black" />
                    <span className="px-2 text-sm text-black">or</span>
                    <div className="flex-1 h-px bg-black" />
                </div>
                <Link to="/register" className="text-blue-500 underline text-center">Don't have an account? Register Now</Link>      
            </form>
        </div>
    )
}

export default Login