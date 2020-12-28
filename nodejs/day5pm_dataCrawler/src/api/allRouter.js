const express = require('express');
const Router = express();

//引入子路由
// const cartRouter = require('./sonRouter/cart');

//使用转换post|put|delete请求的中间件
Router.use(express.urlencoded(),express.json());

//把这个路由配置放在所有路由的前面，方便调用next操作
Router.use((req, res, next) => {
    //无论什么接口进来，都给你进来，并且添加头信息
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization,Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,GET,DELETE,OPTIONS");

    // 跨域请求CORS中的预请求OPTIONS
    if (req.method == "OPTIONS") {
        res.sendStatus(200);/*让options请求快速返回*/
    } else {
        next();
    }
});

//使用子路由中间件
// Router.use('/cart',cartRouter);

let data = [{
    username:'gun',
    password:123456,
}];
//jsonp接口
Router.get('/jsonp',(req,res)=>{
    let {callback} = req.query;
    res.send(`${callback}(${JSON.stringify(data)})`)
});

//CORS请求
Router.post('/cors',(req,res)=>{
    res.send(data);
})

//反向代理
const {createProxyMiddleware} = require('http-proxy-middleware');

//发起请求的接口：http://localhost:3001/sinaapi/api/config/list 
//真实的接口：https://m.weibo.cn/api/config/list（这个接口下才有数据）

//配置信息得到中间件
const sinaProxy = createProxyMiddleware({
    target:'https://m.weibo.cn',
    changeOrigin: true,  //是否代理：true表示代理
    pathRewrite:{
        "^/sinaapi": "/",
    }
});

Router.use('/sinaapi',sinaProxy);

//导出总路由模块
module.exports = Router;