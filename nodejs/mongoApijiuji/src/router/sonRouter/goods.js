const express = require('express');
const {
    ObjectId
} = require('mongodb');
const mongo = require('../../db/mongo');
const Router = express.Router();
const {
    formatData
} = require('../../utils');

const colname = "list";
//获取所有商品
Router.get('/Allgoods', async (req, res) => {
    const {
        query = {}
    } = req.query;
    console.log("query=",query);
    try {
        let result = await mongo.findtotal(colname, query);
        if (result.length) {
            res.send(formatData({
                code: 200,
                data: result
            }));
        } else {
            res.send(formatData({
                code: 400
            }))
        }
    } catch (err) {
        res.send(formatData({code:500}))
    }
});

//分页获取商品
Router.get('/list',async (req,res)=>{
    let {query={},page=1,size=10} = req.query;
    //如果没有传sort就不排序,sort后面可以用，拼接1表示升序，-1表示降序
    //query是查询条件，比如面试题按公司查
    // console.log("query1=",query);  
    //处理查询条件
    if (typeof (query) === 'string') {
        req.query.query = eval("(" + query + ")");
        // console.log("query2=",query);  
    }
    // console.log("req.query=",req.query);
    try{
        let rows = await mongo.find(colname,req.query);
        if(rows.length){
            let totalNum = await mongo.findtotal(colname,query);
            res.send(formatData({
                code:200,
                page:page*1,
                size: size * 1,
                total: totalNum.length,
                pages: Math.ceil(totalNum.length / size),
                data: rows,
            }))
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
});

//正则查询也可以分页
Router.get('/regList',async (req,res)=>{
    let {query={},page=1,size=10} = req.query;
    //处理查询条件
    let newQuery = {};
    if (typeof (query) === 'string') {
        newQuery = eval("(" + query + ")");
        for(let key in newQuery){
            newQuery[key] = new RegExp(newQuery[key]);
        };
        req.query.query = newQuery;
    }
    console.log("req.query=",req.query);
    try{
        let rows = await mongo.find(colname,req.query);
        if(rows.length){
            let totalNum = await mongo.findtotal(colname,newQuery);
            res.send(formatData({
                code:200,
                page:page*1,
                size: size * 1,
                total: totalNum.length,
                pages: Math.ceil(totalNum.length / size),
                data: rows,
            }))
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
});

//获取商品详情
Router.get('/details/:ppid' ,async (req,res)=>{
    try{
        console.log("req.params=",req.params);
        const {ppid} = req.params;
        // console.log("id",id);
        let result = await mongo.find(colname,{
            query:{ppid:ppid*1}
        });
        if(result.length){
            res.send(formatData({code:200,data:result}));
        }else{
            res.send(formatData({code:400}));
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
});

module.exports = Router;