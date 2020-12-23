const express = require('express');
const Router = express.Router();

const userRouter = require('./sonRouter/user');
const goodsRouter = require('./sonRouter/goods');
Router.use(express.urlencoded(),express.json());
Router.use('/user',userRouter);
Router.use('/goods',goodsRouter);

module.exports = Router;