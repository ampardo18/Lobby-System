import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function App() {
  const navigate = useNavigate()
  return (
     <div className="flex flex-col justify-center items-center">
      <motion.h1
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="app-title"
      >Welcome to the Battleship Game
      </motion.h1>

      <motion.button 
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="cursor-pointer font-bold rounded-lg bg-green-600 w-1/5 h-10 transform transition-transform duration-200 hover:scale-105"
        onClick={()=> navigate("/login", { replace: true })}>
          
        Sign-in
      </motion.button>
       
     
    </div>
  )
}

export default App
