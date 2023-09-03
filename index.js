// const express=require("express");
// var app=express();
// var http=require("http");
// const cors=require("cors");
// const corsOptions ={
//    origin:'http://localhost:3000', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }
// const server=http.createServer(app);
// const socketio=require("socket.io");
// const io=socketio(server);//parameter is raw http server


// io.on("connection",(socket)=>{//this function runs on every new connection
//     //socket is for every induvidual connection



// })

// server.listen(5000,()=>{
//     console.log("it is running")
// })







//for docs: https://socket.io/docs/v4/server-initialization/
const express = require("express");

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {

    cors: {
        origin: "http://localhost:3000"
    }
});

let onlineUsers = [];
const adduser = (username, socketId) => {//username and socket will come from client side
//    console.log(onlineUsers.find(user => user.username === username))
    !onlineUsers.some(user => user.username === username) && onlineUsers.push({username, socketId})
   console.log(onlineUsers);
}
const removeUser=(socketId)=>{
    onlineUsers=onlineUsers.filter(user=>user.socketId!==socketId);
}

const getUser=(username)=>{
    return onlineUsers.find((user)=>user.username===username);
}



io.on("connection", (socket) => {
    io.emit("firstevent", "hello first boy")
   socket.on("newuser",(username)=>{
       console.log(username)
       adduser(username,socket.id)
   })
   socket.on("arrange",({sender, reciever})=>{
      const recieve=getUser( reciever);
      console.log(recieve);
      io.to(recieve.socketId).emit("notified",{
          sender
      });
   })
   socket.on("notified",({sender,reciever})=>{
       const recieve=getUser(reciever);
       console.log(sender);
       io.to(recieve.socketId).emit("getNofi",{
           send:sender
       })
   })

    console.log("connected some")
    socket.on("disconnect", () => {
      removeUser(socket.id)
    })
    // ...
});
app.get("/", (req, res) => {
    res.send("helllllllllo 500000")
})
httpServer.listen(5000, () => {
    console.log("running")
});