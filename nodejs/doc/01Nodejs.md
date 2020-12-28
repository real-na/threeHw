+ 前端：javascript = ECMAScript + BOM + DOM

  + 客户端语言：代码在客户端执行

    网页的图片请求，css请求，js请求等静态资源都是放在服务器，需要下载到客户端执行

+ 后端：Node JS = ECMAScript + 服务器概念（request + response）

  + nodejs是后端语言，在服务器执行的js
  + console、JSON、npm模块



# NodeJS

## 复习二阶段内容

### http服务器
* 静态资源服务器
    * 使用模块
        * http
        * fs
        * url
        * path
    * 了解文件mime类型
        * 默认纯文本：text/plain

    ```js
        const http = require('http');
        const fs = require('fs');
        const url = require('url')
        const path = require('path');
        const mine = require('./module/mime')
    
        const server = http.createServer((req,res)=>{
            const {pathname} = url.parse(req.url);
            const realpath = path.join(__dirname,pathname);
            const extname = path.extname(pathname).substring(1);
            fs.readFile(realpath,(err,data)=>{
                if(err){
                    return res.end('404');
                }
                res.writeHead(200,{'content-type':mime[extname] + ';charset=utf8'});
                res.end(data);
            })
        })
    
        server.listen(1000,()=>{
            console.log('server is running on port 1000')
        })
    ```

* 部署到服务器

### 模块化规范
* CommonJS      node.js
  * 导出：module.exports | exports
  * 引入：require()
* CMD           require.js
* AMD           sea.js
* ES Module     ES6

### 模块分类

>Nodejs 模块系统采用commonJS规范。一般情况模块可分为三类：

* 原生模块（Nodejs内置模块）

    * http
    * fs
    * path
    * url

* 自定义模块
    * 文件
    * 目录

* 第三方模块
    > 通过`npm install`命令安装到`node_modules`目录
    >
    > + 生产依赖：--save          -S
    >   + 把安装信息记录在dependencies里面
    > + 开发依赖：--save-dev  -D
    >   + 把安装信息记录在dev-dependencies里面

```javascript
    //hello.js

    function hello(){
        return 'hello laoxie';
    }

    //对外暴露接口（commonJS规范）
    module.exports = hello;
```

#### 原理
在nodejs中，任一脚本文件都会自动写入一个包装函数中（所以每个模块具有独立作用域），并传入以下参数

* exports: 当前模块的导出对象
* require: 引入模块的方法
* module: 当前模块对象
* __filename: 当前文件的绝对路径
* __dirname: 当前文件所在目录的绝对路径

```js
    (function(exports,require,module,__filename,__dirname){
        // 我们编写的模块代码
    })
```

#### 导出模块

>如果没有这句话，引入模块时 就会得到 空对象

* module.exports
>对外暴露单个接口，一个模块中只能有一个 `module.exports`，多个会被覆盖。

* exports
>exports 为 `module.exports`的引用，一个模块中可以使用多次

```javascript
    //person.js
    function setName(){
        return 'laoxie'
    }

    function setAge(){
        return 18
    }

    // 对外暴露接口
    exports.setName = setName;
    exports.setAge = setAge;

```

#### 引入模块: require()

>引入模块，使用nodejs内置的require()方法，一种同步的模板引入方式

```javascript
    //page.js
    
    //得到一个对象，包含暴露的setName,setAge方法
    let person = require('./person.js');

    // 既然是得到对象，也可以直接解构
    let {setName,setAge} = require('./person.js');

```

* require 方法中的文件查找策略

![require](./img/模块加载过程.jpg "查找策略")

windows系统的系统变量：比如supervisor以后，如果当前目录找不到supervisor这个变量，就会去**环境变量**里面找（环境变量中的PATH）：先找用户变量，再到系统变量

- 用户变量
- 系统变量