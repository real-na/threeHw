//[1]引入模块
const express = require('express');
//导入总路由对象
const allRouter = require('./api/allRouter');
const app = express();

//开启静态资源服务器
app.use(express.static('../public'));

// let goodsList = [];
// for (let i = 0;i<20;i++){
//     let goods = {
//         id:i+1,
//         name:'goods'+i,
//         imgUrl:'img/goods'+i+'.jpg',
//         price:(Math.random()*10000).toFixed(2),
//     }
//     goodsList.push(goods);
// }
// app.use('/goods',(req,res)=>{
//     res.send()
// })

//进入总路由
app.use(allRouter); 

app.listen(20082,()=>{
    console.log("server is running on http://localhost:20082");
})