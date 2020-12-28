const express = require('express');
const {ObjectId} = require('mongodb');
const mongo = require('../../db/mongo');
const Router = express.Router(); 
const {formatData} = require('../../utils');

const colname = "interviewQuestion";
//获取所有数据
Router.get('/Allgoods',async (req,res)=>{
    let result = await mongo.findtotal({
        colname,
    })
})

//分页获取数据
Router.get('/list')

module.exports = Router;