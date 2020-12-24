const e = require('express');
const express = require('express');
const mysql = require('../../db/mysql'); //导出为一个函数
const Router = express.Router();

const {formatData} = require('../../utils');
/* 
用户管理相关接口：
    * 查询用户名是否存在 get
    * 注册 post
    * 登录 get 7天免登录
    * 查询列表 get
    * 删除用户 delete
    * 修改密码 put
*/

//查询用户名是否存在
Router.get('/check',(req,res)=>{
    const {username} = req.query;
    // console.log("username=",username);
    let sql = `select username from user where username = '${username}'`;
    mysql.query(sql).then(result=>{
        if(result.length > 0){
            res.send(formatData({code:400,msg:'username exist'}));
        }else{
            res.send(formatData());
        }
    }).catch(reason=>{
        res.send(formatData({code:500,data:reason}));
    });

});

//注册
Router.post('/reg', async (req,res) => {
    const {username,password} = req.body;
    let sql = `insert into user (username,password) values ('${username}','${password}')`;
    try{
        let result = await mysql.query(sql);
        if(result.affectedRows){
            res.send(formatData({code:200,msg:'reg success'}));
        }else{
            res.send(formatData({code:400,msg:'reg fail'}));
        }
    }catch(err){
        res.send(formatData({code:500}));
    }
})

// 查询所有用户
Router.get('/alluser',async (req,res)=>{
    let sql = 'select * from user';
    try{
        let rows = await mysql.query(sql);
        if(rows){
            res.send(formatData({code:200,data:rows}))
        }else{
            res.send(formatData({code:400}));
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
});


module.exports = Router;