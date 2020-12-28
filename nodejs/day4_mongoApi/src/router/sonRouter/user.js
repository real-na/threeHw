const express = require('express');
const mongo = require('../../db/mongo'); //导出为一个函数
const Router = express.Router();
const colname = 'user';
const {formatData} = require('../../utils');
/* 
用户管理相关接口：
    * 验证用户名是否存在 get
    * 注册 post
    * 登录 get 7天免登录
    * 验证  token 
    * 查询某个用户信息 get 
    * 查询列表 get
    * 删除用户 delete
    * 修改密码 put
    * 上传头像 post
*/

//查询用户名是否存在
Router.get('/check',async (req,res)=>{
    const {username} = req.query;
    console.log("username=",username);
    try{
        const result = await mongo.find(colname,{
            query:{username}
        });
        console.log("result=",result);
        if(result.length){
            //result不为空表示数据库里找到了一样用户名的数据
            res.send(formatData({code:400,msg:'username exist'}));
        }else{
            if(result === 500){ //连接数据库出错
                res.send(formatData({code:500}));
            }else{
                res.send(formatData());
            }
        }
    }catch(err){
        res.send(formatData({code:500,data:err}));
    }
});

//注册
Router.post('/reg', async (req,res) => {
    const {username,password} = req.body;
    try{
        let result = await mongo.insert(colname,
            {username,password,regtime:new Date()}
        );
        if(result === 200){
            //注册成功
            res.send(formatData({code:200,msg:'reg success'}));
        }else if(result === 400){
            res.send(formatData({code:400,msg:'reg fail'}));
        }
    }catch(err){
        res.send(formatData({code:500}));
    }
});

//登录：结合token
// Router.get() 

//http://localhost:20084/user/list?
//query={type: 'wx'}&page=1&size=5&sort=regtime,1
// 分页查询用户
Router.get('/list',async (req,res)=>{
    let {query,page,size} = req.query;
    console.log("req.query=",req.query);

    try{
        let rows = await mongo.find(colname,req.query);
        let total = await mongo.findtotal(colname,query);
        
        if(rows.length){
            res.send(formatData({
                code:200,
                page:page*1,
                size:size*1,
                total:total.length,
                pages:Math.ceil(total.length/size),
                data:rows,
            }))
        }else{
            res.send(formatData({code:400}));
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
});

//查询所有用户


module.exports = Router;
