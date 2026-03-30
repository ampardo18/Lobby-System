
import { useNavigate } from "react-router-dom"
import React, { useState } from 'react'


function Register(){

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData, 
            [name] : value
        })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
                const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    password: formData.password
                })
            })
            
            const data = await response.json();
            if(response.ok){
                navigate('/login', {replace: true})
            }else{
                alert(data.message || "Registration failed")
            }       
        }catch(error){
            console.error(error)
        }
    }

    return(
        <div>
            <h1 className="app-title">Welcome to the Battleship Game</h1>
            <form onSubmit={handleRegister} className="mx-auto max-w-md flex flex-col space-y-4 p-4 bg-gray-200 rounded-lg w-full shadow-md">
                <h2 className="text-l font-bold text-center">Register</h2>
                <div className="flex flex-col">
                    <label>First Name</label>
                    <input 
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                <button type="submit" className="main-buttons">Register</button>
            </form>
        </div>
    )
}

export default Register