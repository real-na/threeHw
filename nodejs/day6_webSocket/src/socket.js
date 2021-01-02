const ws = require('ws');

const SocketServer = ws.Server;

//创建Socket服务端
const wws = new SocketServer({
    port:1001,
});

//connection：连接监听，当客户端连接到服务端时触发该事件
wws.on('connection',(client)=>{
    client.on('close',()=>{
        console.log('当前用户已断开连接');
    });

    //接收客户端传过来的消息
    client.on('message',(data)=>{
        console.log("data=",data);
    });

    //返回信息给客户端
    client.send('返回消息');
})