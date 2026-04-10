const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3100;
const path = require('path')
const result = require('dotenv').config({path: path.resolve(__dirname, './.env.development')})
const bcrypt = require('bcryptjs')
const { expressjwt } = require('express-jwt')
const jwt = require('jsonwebtoken')
const User = require('./models/users')
const sequelize = require('./config/database')
const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

app.use(
  expressjwt({
    secret: process.env.JWT_SECRET, 
    algorithms: ['HS256']
  }).unless({ path: ['/login', '/register', '/', '/socket.io'] })
)

io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) {
    return next(new Error('Authentication error'))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'))
    socket.user = decoded
    next()
  })
})

app.get("/api/title", (req, res) => {
  res.json({ Title: "Welcome to the Battleship Game" })
})

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body

  try{
    const user = await User.findOne({ where: {username} })
    if (!user){
      res.status(400)
      return res.json({ message: 'Invalid username' })
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    console.log(passwordValid)
    if(!passwordValid){
      res.status(400)
      return res.json({ message: 'Invalid password' })
    }
    const token = await generateJWT(user)
    res.json({ message: 'Login successful', token })
    
  }catch(error){
    console.error({ message: 'error during login', error })
    res.status(500)
  }
})

app.post("/register", async (req, res) => {
  const { firstname, lastname, username, password } = req.body

  try{ 
    const username_exists = await User.findOne({ where: { username } })
    if (username_exists){
      res.status(400)
      return res.json({ message: 'Username already exists!'})
    }
    const hashedPassword = await hashStr(password)
    const newUser = await User.create({
      firstname, 
      lastname,
      username,
      password: hashedPassword
    })
    res.json({ message: 'Sign up is successful', userId: newUser.id })
  } catch(error){
    console.error('Error during sign up', error)
    res.status(500)
  }
})

app.get('/user', async (req, res) => {
  try{
    const user = await User.findByPk(req.auth.id, {
      attributes: ['firstname', 'lastname', 'username']
    })
    if(!user){
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  }catch(error){
    res.status(500).json({ message: 'Server error' })
  }
})

require('./utils/gamelogic')(io)

function generateJWT(user) {
  return new Promise((resolve, reject) => {
    jwt.sign({id: user.id}, process.env.JWT_SECRET, { algorithm: 'HS256'}, function(err, token) {
      if (err) {
        console.error("Error signing JWT:", err);
        return reject(err);
      }
      resolve(token);
    });

  });
}

async function hashStr(str){
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(str, salt);  
}

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
