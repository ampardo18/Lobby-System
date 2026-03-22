const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3100;

app.use(cors());

app.get("/api/home", (req, res) => {
  res.json({ message: "Welcome to Battleship Game" })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    });