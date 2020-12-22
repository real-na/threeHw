# 常用第三方的模块

## Express
>Express 是一个第三方模块，对原生模块封装了一套更灵活、更简洁的应用框架，其在 Node.js 环境的地位和作用好比 jQuery 在前端的地位和作用。使用 Express 可以快速地搭建一个完整功能的网站

### 安装
```bash
    npm install express
```

### 使用
```javascript
    //引入模块
    var express = require('express');
//启动一个服务器
    var app = express();

    //开启服务器，监听端口8080：
    app.listen(8080, function(){
        console.log('Server running on http://localhost:8080');
    });
```


## Express中间件(middleware)
>中间件是一个封装了某些处理数据功能的函数，在request或response调用之前执行，从本质上来说，一个Express应用其实就是在调用各种中间件

### 使用中间件
格式：`app.use([path],...middlewares)`

### 中间件分类

#### 内置中间件：

* `express.static(root, [options])`
    基于 server-static 开发的中间件，负责托管 Express 应用内的静态资源，如：图片， CSS, JavaScript 等，一般用于实现静态资源服务器
    * root 参数指的是静态资源文件所在的根目录。
    * options 对象是可选的，支持以下属性：
        * maxAge

    ```javascript
        // express实现静态资源服务器
        app.use(express.static('./public'));
    ```

* `express.json()`

* `express.urlencoded()`

* `express.Router()`

##### Router中间件的使用

+ server.js

```js
//[1]引入模块
const express = require('express');
//导入总路由对象
const allRouter = require('./api/allRouter');
const app = express();

//开启静态资源服务器
app.use(express.static('../public'));

//进入总路由
app.use(allRouter); 

app.listen(20082,()=>{
    console.log("server is running on http://localhost:20082");
})
```

+ server.js文件同级api文件夹下的allRouter.js文件

```js
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
```

+ sonRouter文件夹下面的子路由，以goods.js为例

```js
//express已经在server.js引入,这里算是第二次就会从缓存里面拿
const express = require('express');
//Router中间件
const Router = express.Router();

let goodslist = [];
for(let i=0;i<20;i++){
    let goods = {
        id:i+1,
        name:'goods'+i,
        imgurl:'img/goods'+i + '.jpg',
        price:(Math.random()*10000).toFixed(2)
    }
    goodslist.push(goods);
}

Router.get('/list',(req,res)=>{
    res.send(goodslist);
});

Router.get('/details/:id',(req,res)=>{
    // console.log("req=",req);
    const {params} = req;
    // console.log("params=",params);
    let currentData = goodslist.find(item=>item.id == params.id);
    res.send(currentData);
});

module.exports = Router;
```



#### 自定义中间件

就是一个函数

```js
const myMiddleWear = function(req,res,next){
    //这里的req,res是经过express处理的，之前http里面的是原生的
}
```

格式为：`function(request,response,next){}`
* next():next是一个方法，因为一个应用中可以使用多个中间件，而要想运行下一个中间件，那么上一个中间件必须运行
```js
    app.use((req,res,next)=>{
        // 任何请求都进入此中间件
    });

    app.use('/goods',(req,res,next)=>{
        //只有请求地址为/goods时才进入此中间件
        let goodslis
    })
```

#### 常用第三方中间件
* body-parser：解析body中的数据到`request.body`
* multer：用于处理FormData数据（表单的 `enctype="multipart/form-data"`属性）
* cookie-parser ：解析客户端cookie中的数据到`request.cookies`
* express-session ：解析服务端生成的sessionid对应的session数据到`request.session`属性
* http-proxy-middleware : 服务器代理中间件

### 中间件执行过程

next：是一个方法，调用后才会执行下一个中间件

`static()`中间件的处理逻辑：找到静态资源则不会执行后面的中间件，如果找不到静态资源内部会自动next()

## 传参方式

- 动态路由传参：/goods/:id
  - 前端传递：/goods/1
  - 获取：`req.params.id`
- 请求头传参
  - 前端：比如用ajax发送post请求，需要xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded'),
    这种就是通过请求头传递的参数
  - 后端：`req.get(Content-type)`
- url查询参数(get)： /goods?page=1&size=10
  - 前端传递：postman测试的时候写在params里面（用ajax也是直接拼接在路径上的，或者写在data参数里面）   
  - 获取：`req.query`
- 请求体传参(post,put,delete) 
  - 前端传递：postman写在body下面（ajax就是直接凭借在send里面）
  - 获取：`req.body`，body接收到的数据需要使用中间件进行处理



## 定义路由
* 服务器知识
    * 请求对象：request
    * 响应对象：response
    * 前后端分离(BSR)与服务器渲染(SSR)的概念等 
* 接口规范：RESTfulAPI
    * 请求类型
    * 请求路径
* 获取请求参数
    * 参数通过请求路径传递（get）：request.query
    * 参数通过请求体/formData（post）：request.body
    * 动态路由：request.params

#### GET
```javascript
    // 定义主页路由,当我们访问：`http://localhost:8080/`时触发
    app.get('/', function(request, response){
        response.send('首页');
    });

    //定义任意路由(如：cart) ，当我们访问：`http://localhost:8080/cart`时触发
    app.get('/cart', function(request, response){
        response.send('购物车页面');
    })

    //访问地址：http://localhost:8080/search?keyword=iphonX
    app.get('/search', function(request, response){
        var params = {
            username: request.query.keyword
        }
        response.send(params);
    });

	//动态路由
    //访问地址：http://localhost:8080/goods/10086，
    app.get('/goods/:id', function(request, response){
   	//获取动态路由参数：req.params
        var params = {
            username: request.params.id
        }
        response.send(params);
    });
```

#### POST
>post 参数接收，可依赖第三方模块 `body-parser` 作为**express中间件**进行转换会更方便、更简单

* post传参：body-parser
    * string：bodyParser.urlencoded()
    * json：bodyParser.json()
    ```javascript
        //参数接受和 GET 基本一样，不同的在于 GET 是 request.query 而 POST 的是 request.body
        var bodyParser = require('body-parser');

        // 创建urlencoded 编码解析（把请求头content-type值为application/x-www-form-urlencoded时的数据格式化到request.body中）
        var urlencodedParser = bodyParser.urlencoded({ extended: false });

        // 创建json编码解析（把请求头content-type值为application/json时的数据格式化到request.body中）
        const jsonParser = bodyParser.json();

        app.post('/getUsers', urlencodedParser, function (request, response) {
            var params = {
                username: request.body.username,
                age: request.body.age
            }
        response.send(params);
        });
    ```
* 图片上传：multer
    * multipart/form-data
    ```js
        // @文件上传
        const multer  = require('multer')
        const path = require('path');
        // 设置上传文件路径
        // let upload = multer({ dest: 'uploads/' })
    
        // 配置上传参数
        let storage = multer.diskStorage({
            // destination: function (req, file, cb) {
            //   cb(null, './uploads/');
            // },
    
            // 上传文件保存目录，无则自动创建
            destination:'./uploads/',
    
            // 格式化文件名
            filename: function (req, file, cb) {
                // 获取文件后缀名
                let ext = path.extname(file.originalname);
    
                cb(null, file.fieldname + '-' + Date.now() + ext);
            }
        })
        
        // 设置文件保存目录
        let upload = multer({storage});
    ```


        Router.post('/avatar',upload.single('avatar'),async (req,res)=>{
            // 后端如何接收文件格式的数据
            // post -> req.body
            // 文件 -> multer中间件格式化到req.file
            console.log('avatar:',req.file)
    
            res.send(formatData({data:req.file}))
    
        })
    ```

#### 跨域支持
>把这个路由配置放在所有路由的前面，方便调用next操作

```javascript
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,PATCH,DELETE,OPTIONS");

        // 跨域请求CORS中的预请求
        if(req.method=="OPTIONS") {
            res.sendStatus(200);/*让options请求快速返回*/
        } else{
            next();
        }
    });
```
> 复杂跨域：
* 非GET、HEAD、POST请求。
* POST请求的Content-Type不是application/x-www-form-urlencoded, multipart/form-data, 或text/plain。
* 添加了自定义header，例如Token。

#### 代理服务器
代理服务器最关键和主要的作用就是请求转发，即代理服务器将实际的浏览器请求转发至目标服务器，

* 实现这个功能，关键就在下面两点：
    - 请求转发至目标服务器。
    - 响应转发至浏览器。

* 无论请求还是响应，转发有需要关注两个点：
    - 请求或响应头。
    >http请求是无状态的，我们使用session的方式验证用户权限，session等经常保存在cookie中，所以，头的转发是必须的。
    - 请求或响应实体数据。

* 利用http-proxy-middleware实现代理
    > webpack代理服务器使用的中间件

---

【案例】

* 利用express实现静态资源服务器
* 利用路由编写RESTful规范的数据接口

【练习】

* 注册登录接口
    * 加密解密知识