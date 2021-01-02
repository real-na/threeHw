const express = require('express');
const http = require('http');
const ws = require('ws');

const app = express();
app.use(express.static('../public'));

let server = http.Server(app);

let SocketServer = ws.Server;
let wss = new SocketServer({
    server,
    port: 1001
});

wss.on('connection',(client)=>{
    //接收客户端传过来的消息
    client.on('message',(data)=>{
        //广播用户登录和推出的消息给每一个用户
        console.log("data=",data);
        wss.clients.forEach((aClient)=>{
            aClient.send(data);
        })
    })
})

server.listen(20087, () => {
    console.log("server is running on http://localhost:20087");
});