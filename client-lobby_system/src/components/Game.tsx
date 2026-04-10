import { useNavigate, useParams } from 'react-router-dom'

function Game(){
    const navigate = useNavigate()
    const { id } = useParams()
    return(
        <div>
            <h1>game {id ?? ''}</h1>
            <button className="border-4 cursor-pointer" onClick={()=> navigate('/lobby')}>back</button>
        </div>
    )
}

export default Game