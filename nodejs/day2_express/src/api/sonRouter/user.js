const express = require('express');
const Router = express.Router();

Router.get('/login',(req,res)=>{
    res.send('登录');
});

Router.post('/reg',(req,res)=>{
    res.send('注册');
});

module.exports = Router;