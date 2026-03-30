import { useNavigate } from "react-router-dom"

function Game(){
    const navigate = useNavigate()
    return(
        <div>
            <h1>game</h1>
            <button className="border-4 cursor-pointer" onClick={()=> navigate('/lobby')}>back</button>
        </div>
    )
}

export default Game