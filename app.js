const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/user");
const ip = require("ip");
// const groupService = require("./services/group_service");
const io = require('socket.io')(3000);

io.on('connection', socket => {
    socket.broadcast.emit('channel', 'A persion has connected');
});

io.on('chat-room', socket => {
    socket.broadcast.emit(socket.data)
});
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

app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://${ip.address()}:${port}`);
});

module.exports = app;