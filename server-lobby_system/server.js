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

app.use(cors())
app.use(express.json())

app.use(
  expressjwt({
    secret: process.env.JWT_SECRET, 
    algorithms: ['HS256']
  }).unless({ path: ['/login', '/register', '/'] })
)


app.get("/api/title", (req, res) => {
  res.json({ Title: "Welcome to the Battleship Game" })
})

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body

  try{
    const user = await User.findOne({ where: {email} })
    if (!user){
      res.status(400)
      return res.json({ message: 'Invalid email' })
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
  const { firstname, lastname, email, password } = req.body

  try{ 
    const email_exists = await User.findOne({ where: { email } })
    if (email_exists){
      res.status(400)
      return res.json({ message: 'Email already exists!'})
    }
    const hashedPassword = await hashStr(password)
    const newUser = await User.create({
      firstname, 
      lastname,
      email,
      password: hashedPassword
    })
    res.json({ message: 'Sign up is successful', userId: newUser.id })
  } catch(error){
    console.error('Error during sign up', error)
    res.status(500)
  }
})

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
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    })
})
