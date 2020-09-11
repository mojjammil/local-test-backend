const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express() // Setup server for app requiring express
const server = http.Server(app)
const io = socketio(server) // Initialize our server with socket.io


const PORT = process.env.PORT || 8000

// Add JWT token to project 

// Return token when login 

// Send token on request 

// Create function to protect routers 

// Add Funtion/Middleware  to routers

// Modify response to decode the token

if(process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}



try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('MongoDB connected successfully')
} catch(error) {
    console.log(error)
}

// Wesocket
const connectedUsers = {} //Memory for server to store users
// Then we will try our connection for the first time with socket io
io.on('connection', socket => {
    // Let's test frontend and backend together with console.log
    console.log('User is connected with: ', socket.id) // Everytime user is assigned new connection ID
    // console.log(socket.handshake.query) // Handshake with user
    // Since we know that the query from handshake contains user property, let's destructure
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
    
    io.emit('mojo', {data: 'hello-world'})
})

// app.use()
// Websocket connection middleware which will work before the jwt verification middleware runs, and then server processes all requests
app.use((req, res, next) => {
	req.io = io
	req.connectedUsers = connectedUsers
	return next()
})

app.use(cors())
app.use(express.json())
// Set up the server to handle static files from files path
// We use the same directory path of the original place where we are uploading files so let's get path from upload.js
// But the server file is located only one directory inside the root so let's fix directory navigation
app.use('/files', express.static(path.resolve(__dirname, "..", "files")))
app.use(routes)

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})