//[1]引入模块
const express = require('express');
//导入总路由对象
const allRouter = require('./api/allRouter');
const app = express();

//开启静态资源服务器
app.use(express.static('../public'));

//进入总路由
app.use(allRouter); 

app.listen(20085,()=>{
    console.log("server is running on http://localhost:20085");
})