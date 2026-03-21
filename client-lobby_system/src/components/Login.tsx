
import { Link, useNavigate } from "react-router-dom"
import '../styles/global.css'


function Login(){
    const navigate = useNavigate()
    return(
        <form className="mx-auto max-w-md flex flex-col space-y-4 p-4 bg-gray-200 rounded-lg w-full shadow-md">
            <h2 className="text-l font-bold text-center">Sign-in</h2>
            <div className="flex items-center space-x-4 space-y-4">
                <label>Username : </label>
                <input 
                    type="text"
                    className="flex-1 border rounded p-1"
                />
            </div>
            <div className="flex items-center space-x-4 space-y-4">
                <label>Password : </label>
                <input
                    type="text"
                    className="flex-1 border rounded p-1"
                />
            </div>
            <button className="main-buttons" onClick={() => navigate("/lobby", { replace: true })}>Sign in</button>
            <Link to="/register" className="text-blue-500 underline text-center">Don't have an account? Register Now</Link>
            
        </form>
    )
}

export default Login