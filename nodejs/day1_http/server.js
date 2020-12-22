const http = require('http');
const path = require('path'); //path模块处理文件路径
const url = require('url');   //url模块处理url地址
const fs = require('fs');
const mime = require('./mime'); //引入自定义模块

//只能返回end和write里面的数据
/* const server = http.createServer((request,response)=>{
    response.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
    response.write('响应信息');
    response.end('<h1>解析成标签</h1>');
}); */

const server = http.createServer((req,res)=>{
    // console.log("req.url",req.url);
    // 获取请求文件路径
    const {pathname} = url.parse(req.url,true);
    // 转成绝对路径
    const realPath = path.join(__dirname,pathname);
    // 提取扩展名（后缀）
    const extname = path.extname(pathname).slice(1);
    
    //用文件模块返回对应访问的模块
    fs.readFile(realPath,(err,data)=>{
        // err： 报错信息，默认null
        // data: 读取文件的内容Buffer
        if(err){
            res.writeHead(400,{'Content-type':'text/plain;charset=utf-8'});
            return;
        }
    
        res.writeHead(200,{'Content-type':`${mime[extname]};charset=utf-8`});
        res.end(data);
    })
    // res.end('hhhh');
})

server.listen(2008,()=>{
    console.log("server is running on http://localhost:2008");
})