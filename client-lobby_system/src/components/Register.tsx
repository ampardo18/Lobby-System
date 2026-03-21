
import { useNavigate } from "react-router-dom"



function Register(){

    const navigate = useNavigate()
    return(
        <form className="mx-auto max-w-md flex flex-col space-y-4 p-4 bg-gray-200 rounded-lg w-full shadow-md">
            <h2 className="text-l font-bold text-center">Register</h2>
            <div className="flex items-center space-x-4 space-y-4">
                <label>First Name : </label>
                <input 
                    type="text"
                    className="flex-1 border rounded p-1"
                />
            </div>
            <div className="flex items-center space-x-4 space-y-4">
                <label>Last Name : </label>
                <input
                    type="text"
                    className="flex-1 border rounded p-1"
                />
            </div>
            <div className="flex items-center space-x-4 space-y-4">
                <label>Username :  </label>
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
            <button className="main-buttons" onClick={() => navigate("/login", { replace: true })}>Register</button>
        </form>
    )
}

export default Register