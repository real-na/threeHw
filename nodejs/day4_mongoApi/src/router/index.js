const express = require('express');
const Router = express.Router();

const userRouter = require('./sonRouter/user');
const goodsRouter = require('./sonRouter/goods');
const iqRouter = require('./sonRouter/iq');

Router.use(express.urlencoded({extended:true}),express.json());

Router.use('/user',userRouter);
Router.use('/goods',goodsRouter);
Router.use('/iq',iqRouter);

module.exports = Router;