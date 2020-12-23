const mysql = require('mysql');

//使用连接池方式连接数据库
//【2】创建连接池
let pool  = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '123456',
    port: 3306,  //mysql默认端口号3306
    //connectionLimit:20, //设置连接对象个数,一般不设置
    database: 'h52008', //数据库名
    multipleStatements: true, //允许创建多个连接对象
});

// let sql = 'select * from user';
// pool.query(sql,function(err,res){
//res是sql语句的查询结果
//     if(error)return;
//     let str = JSON.stringify(res);
// });

//因为后面不同的接口需要传不同的sql语句进行连接,所以导出为一个方法
/* module.exports = function(sql){
    query:pool.query(sql,function(error,res){
        //此时查询结果只可以在这个回调函数里面获取，要在不同的接口实时得到，使用promise
    })
    //要想在不同的接口中拿到就需要在这里return res
} */

module.exports = {
    query:function(sql){
        return new Promise((resolve,reject)=>{
            pool.query(sql,function(error,res){
                if(error)reject(error);
                resolve(res);
            })
        })
    }
}