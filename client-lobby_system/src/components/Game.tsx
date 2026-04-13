import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Game(){
    const navigate = useNavigate()
    const { id } = useParams()
    return(
        <div>
            <h1>gameID: {id ?? ''}</h1>
            <p>Room Code:</p>
            <button className="border-4 cursor-pointer" onClick={()=> navigate('/lobby')}>back</button>
        </div>
    )
}

export default Game