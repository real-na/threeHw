const express = require('express');
const Router = express.Router();

const userRouter = require('./sonRouter/user');
const goodsRouter = require('./sonRouter/goods');

const cors = require('../filter/cors');
Router.use(cors);

Router.use(express.urlencoded({extended:true}),express.json());

Router.use('/user',userRouter);
Router.use('/goods',goodsRouter);

module.exports = Router;