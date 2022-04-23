const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/user");
const ip = require("ip");
// const groupService = require("./services/group_service");
const io = require('socket.io')(3000);

// io.on('connection', socket => {
//     console.log('connection')
//     io.emit('channel', 'A persion has connected');
// });

// io.on('chat-room', socket => {
//     console.log('chat-room')
//     io.broadcast.emit(socket.data)
// });
require("dotenv/config");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
});

app.use(express.static("./images"))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/user', user)

app.get("/", (req, res) => {
    console.log(req.url);
    console.log(req.headers);
    console.log(req.body);
    console.log(req.ip);
    res.send(req.headers, req.data, req.ip, req.router, req.body);
});

const server = app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://${ip.address()}:${port}`);
});

// const io = socket(server);
const users = {}
const rooms = {}

//Socket.io Connection------------------
io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)
    // var username =''
    // var roomname=''    
    socket.on('user', (userdata) => {
        const data = JSON.parse(userdata);
        // username =data.name
        users[socket.id] = data.name
        // roomname =data.room
        rooms[socket.id] = data.room
        console.log(data.name)
        socket.join(`${rooms[socket.id]}`)
        console.log(`${users[socket.id]} has joined the room : ${rooms[socket.id]}`)
        io.to(`${rooms[socket.id]}`).emit('user', JSON.stringify(users[socket.id]));
        io.to(`${rooms[socket.id]}`).emit('connection', users[socket.id] + " has joined the chat")
    })
    socket.on('chat message', (msg) => {
        const mydata = JSON.parse(msg)
        const chat = mydata.chat

        const send = {
            username: users[socket.id],
            chat: chat
        }
        socket.broadcast.to(`${rooms[socket.id]}`).emit('chat message', JSON.stringify(send))
        console.log('FROM : ' + users[socket.id] + '-' + rooms[socket.id] + ' : ' + chat)
    })
    socket.on('chat image', (img) => {
        const img_data = Json.parse(img)
        const my_img = img_data.chat
        const send = {
            username: users[socket.id],
            chat: my_img
        }
        socket.broadcast.to(`${rooms[socket.id]}`).emit('chat image', Json.stringify(send))
        console.log('Image URL: ' + rooms[socket.id] + "-" + users[socket.id] + " : " + chat)
    })
})



module.exports = app;