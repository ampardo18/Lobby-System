import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./components/Login"
import "./styles/global.css"
import Register from "./components/Register"
import Game from "./components/Game"
import Battleship from "./components/BattleshipLobby"
import App from "./App"

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />}></Route>
      <Route path="/game" element={<Game />}></Route>
      <Route path="/game/:id" element={<Game />}></Route>
      <Route path="/lobby" element={<Battleship />}></Route>
    </Routes>
  </BrowserRouter>
);
