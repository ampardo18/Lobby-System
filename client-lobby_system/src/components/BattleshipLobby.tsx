import { useNavigate } from "react-router-dom"

function Battleship(){
    const navigate = useNavigate()

    const handelLogout = () => {
        localStorage.removeItem('token')
        navigate('/login', {replace: true})
    }

    return(
        <div>
            <h1>lobby</h1>
            <button className="main-buttons" onClick={handelLogout}>Logout</button>
        </div>
   
    )

}

export default Battleship