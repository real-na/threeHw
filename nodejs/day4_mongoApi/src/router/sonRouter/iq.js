const express = require('express');
const mongo = require('../../db/mongo'); //导出为一个函数
const Router = express.Router();
const colname = 'interviewQuestion';
const {
    formatData,formatTime
} = require('../../utils');

//获取面试题{page,size,query,total,sort}
//sort不传默认为addtime,query为查询条件，total不传默认为true
Router.get('/list', async (req, res) => {
    let {
        query,
        page,
        size,
        total
    } = req.query;

    //把除total以外的参数传给find和findtotal方法
    for (let key in req.query) {
        if (key == 'total') {
            delete req.query[key];
        }
    }
    //如果没有传sort,sort默认为addtime
    if (!req.query.sort) {
        req.query.sort = 'addtime';
    }

    //如果没有传total,total为undefined
    if (total === undefined) {
        total = true;
    }

    console.log("req.query=", req.query);
    try {
        let rows = await mongo.find(colname, req.query);
        //成功查询到数据
        if (rows.length) {
            if (!total) {
                //传进来total为false，不要总数
                res.send(formatData({
                    code: 200,
                    data: rows,
                }))
                return;
            }
            //total为true，要总数
            let totalNum = await mongo.findtotal(colname, query);
            res.send(formatData({
                code: 200,
                page: page * 1,
                size: size * 1,
                total: totalNum.length,
                pages: Math.ceil(totalNum.length / size),
                data: rows,
            }))
        } else {
            res.send(formatData({
                code: 400
            }));
        }
    } catch (err) {
        res.send(formatData({
            code: 500
        }))
    }
});

//获取当天添加的面试题
Router.get('/today',async (req,res)=>{
    let {page=1,size=5,sort} = req.query;
    const {year,month,day} = formatTime(new Date());
    const today = `${year}-${month}-${day}`;
    const query = {addtime:{
        //年月日和时分秒之间不可以有空格
        '$gte':new Date(`${today}T00:00:00.00Z`),
        '$lte':new Date(`${today}T23:59:59.999Z`)
    }};
    //如果没有传sort,sort默认为addtime
    if (!sort) {
        req.query.sort = 'addtime';
    }
    try{
        const result = await mongo.find(colname,{query,page,size,sort});
        if(result.length){
            //返回了当天的数据
            res.send(formatData({code:200,data:result}))
        }else{
            res.send(formatData({code:400}))
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
    res.send(today);
});

//添加面试题
Router.post('/add', async (req, res) => {
    let {
        question,
        category,
        difficulty,
        hot = 1,
        userid
    } = req.body;

    let data = {
        question,
        category,
        difficulty,
        hot,
        userid,
        addtime:new Date()
    }
    try{
        const result = await mongo.insert(colname,data);
        if(result === 200){
            res.send(formatData())
        }else{
            res.send(formatData({code:400}))
        }
    }catch(err){
        res.send(formatData({code:500}))
    }
});

//获取单个面试题
Router.get('/getQues/:id' ,async (req,res)=>{
    try{
        const {id} = req.params;
        console.log("id",id);
        let result = await mongo.find(colname,{
            query:{_id:id}
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

//删除面试题
Router.delete('/:id',async (req,res)=>{
    let {id} = req.params;
    console.log("req.body=",req.body);
    try{
        const result = await mongo.remove(colname,{_id:id});
        res.send(formatData({code:result}));
    }catch(err){
        res.send(formatData({code:500}));
    }
});

//修改面试题信息
Router.put('/:id',async (req,res)=>{
    let {id} = req.params;
    console.log("req.body=",req.body);
    try{
        const result = await mongo.update(colname,{_id:id},req.body);
        res.send(formatData({code:result}));
    }catch(err){
        res.send(formatData({code:500}));
    }
})


module.exports = Router;