const express = require("express")
const socket = require("socket.io")

const app = express()
const server = app.listen(3000, ()=>{
    console.log("Server is running in 3000")
})

const io = socket(server)

function getRandomInteger(max) {
    return Math.floor(Math.random() * Math.floor(max-1)) + 1;
}

let playerList = {}
let KP = {}
let PC = {}

io.on('connection', (socket)=>{
    const url = socket.request.headers.referer
    const splitted = url.split("/")
    const roomID = splitted[splitted.length - 1];
    console.log("ROOM"+roomID)
    if (!playerList[roomID]) playerList[roomID] = {}
    if (!KP[roomID]) KP[roomID] = {}

    socket.on("register", (msg)=>{
        let token = msg.token;
        socket.join(roomID);
        if (!msg.token || !(msg.token in playerList)) {
            token = Math.random().toString(36).substring(7);
            playerList[roomID][token] = msg.name
            if (msg.type == "PC") {
                console.log(PC[roomID])
                if (!PC[roomID]) PC[roomID] = []
                PC[roomID].push(msg.name)
                io.to(roomID).emit("message", {msg: `调查员 ${msg.name} 加入了房间`})
            } else {
                if (!KP[roomID]) KP[roomID] = []
                KP[roomID].push(msg.name)
                io.to(roomID).emit("message", {msg: `KP ${msg.name} 加入了房间`})
            }
        }
        io.to(roomID).emit("playerList", {PC:PC[roomID], KP:KP[roomID], token})
        console.log(msg)
        console.log(PC)
        console.log(KP)
        console.log(token)
    })

    socket.on("message", (msg)=>{
        console.log(socket.id)
        console.log(msg)
        io.to(roomID).emit("message", {msg:`${playerList[roomID][msg.token]}: ${msg.msg}`})
    })

    socket.on("dice", (msg)=>{
        let value = 0;
        console.log(msg.dices)
        for (let i = 0; i < msg.dices.length; i++) {
            for(let j = 0; j < msg.dices[i]["value"]; j++) {
                console.log(parseInt(msg.dices[i]["name"].substring(1)))
                value += getRandomInteger(parseInt(msg.dices[i]["name"].substring(1)))
            }
        }
        value += parseInt(msg.bias)
        if (!msg.dark) {
            io.to(roomID).emit("message", {msg:`玩家 ${playerList[roomID][msg.token]} 掷了一个 ${msg.bias!=0?msg.bias+"+":''}${msg.dice_name}, 最终结果为 ${value}`})
        } else {
            socket.emit("message", {msg: `你做了一个暗投 ${msg.bias!=0?msg.bias+"+":''}${msg.dice_name}, 最终结果为 ${value}`})
            socket.broadcast.emit("message", {msg:`玩家 ${playerList[roomID][msg.token]} 做了一个暗投`})
        }
    })

    socket.on("examine", (msg)=>{
    })
})




