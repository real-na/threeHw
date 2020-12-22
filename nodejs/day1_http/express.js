const express = require('express');
const app = express();

//开启静态资源服务器
app.use(express.static('./'));

app.listen(20081,()=>{
    console.log('server is running on http://localhost:20081');
})