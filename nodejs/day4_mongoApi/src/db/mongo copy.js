const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

/* 1、不传回调返回为一个pending状态的promise对象*/
//client3相当于是执行了resolve()的client1
//const client1 = MongoClient.connect("mongodb://localhost:27017");
	console.log(client1)// = Promise { <pending> }
client1.then(res=>{
    console.log("client=",res); //res的结果跟client3一样
});

/* 2、连接mongoDB,传了回调，回调函数里面有一个client可以用来连接数据库*/
 const client2 =  //传了回调返回值为undefined 
  MongoClient.connect("mongodb://localhost:27017", function(err, client3) {
    if(err) throw err;
    // 连接数据库，无则自动创建
    let db = client.db('laoxie');
    //获取数据库里面的user集合
    const col = db.collection('user');
    const result = col.find();

    /* 获取集合中的数据 */
    //result.toArray()得到的是一个pendding状态的promise对象
    //1、回调函数的写法
    result.toArray(function(err,rows){
        console.log(rows)
    });

    //Promise的写法
    result.toArray().then(rows=>console.log(rows))

    //async|await的写法
    const rows = await result.toArray();
    console.log(rows);
 });