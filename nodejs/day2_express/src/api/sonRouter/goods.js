//express已经在server.js引入,这里算是第二次就会从缓存里面拿
const express = require('express');
//Router中间件
const Router = express.Router();

let goodslist = [];
for(let i=0;i<20;i++){
    let goods = {
        id:i+1,
        name:'goods'+i,
        imgurl:'img/goods'+i + '.jpg',
        price:(Math.random()*10000).toFixed(2)
    }
    goodslist.push(goods);
}

Router.get('/list',(req,res)=>{
    res.send(goodslist);
});

Router.get('/details/:id',(req,res)=>{
    // console.log("req=",req);
    const {params} = req;
    // console.log("params=",params);
    let currentData = goodslist.find(item=>item.id == params.id);
    res.send(currentData);
});

module.exports = Router;