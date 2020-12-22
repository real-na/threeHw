const express = require('express');
const Router = express();

//引入子路由
const goodsRouter = require('./sonRouter/goods');
const userRouter = require('./sonRouter/user');
// const cartRouter = require('./sonRouter/cart');

//使用转换post|put|delete请求的中间件
Router.use(express.urlencoded(),express.json());

//使用子路由中间件
Router.use('/goods',goodsRouter);
Router.use('/user',userRouter);
// Router.use('/cart',cartRouter);

//导出总路由模块
module.exports = Router;