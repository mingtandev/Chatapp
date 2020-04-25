var express = require("express");
var app = express();
var server = require("http").Server(app);
var mongoose = require("mongoose");
const io=require("socket.io")(server);

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.set("views","./views");

//mongodb

var chats = require("./models/chat");

chats.find().sort({_id : 1}).then(function(data){
    console.log(data);
});


mongoose.connect('mongodb://localhost:27017/chatapp',{useNewUrlParser: true},function(err){
    if(err){
        throw err;
    }
    console.log("DB connect successfull");
})
//socket

io.on("connection",(socket)=>{

     console.log(chats);   
    console.log("Connect : " + socket.id);

    //Socket nhan emit tu client
    socket.on("from-client-chat-mess",(msg)=>{
        var newChat = new chats({
            content:msg,
        })
        newChat.save(function(err){
            if(err)
                throw err;
        })
        io.sockets.emit("from-server-chat-mess",msg);
    })

    socket.on("Disconnect",() =>{
        console.log(socket.id + " is disconneted")
    })
    
})

app.get("/",(req,res)=>{
    chats.find().then(function(data){
        res.render("client",{
            chatHistory : data
        });

    }).catch(function(err){
        res.json("Err : ", err);
    })
})


server.listen(3000);