const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes")
const app = express();
const socket = require("socket.io")

PORT = process.env.PORT || 5000
MONGO_URL = process.env.MONGOURL


app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoutes)

mongoose.connect(MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err)
})



const server = app.listen( PORT,()=>{
    console.log('Server started ' + PORT )
})

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
      });
});

