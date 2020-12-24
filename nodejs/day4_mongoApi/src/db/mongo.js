const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//数据库配置
const config = {
    dbUrl: "mongodb://localhost:27017",
    dbName: "h52008",
}

async function connect(){
    const client = await MongoClient.connect(config.dbUrl);
    //client:用来连接和关闭数据库
    let db = client.db(config.dbName);
    //db：连接数据库和操作数据库
    //查询数据库实现CRUD,返回出去单个封装
    return {
        client,
        db
    }
}

//调用connect();  //得到Promise对象：connect()方法前面加了async得到的就是Promise对象
// let test = connect();
// test.then((res)=>{
//     console.log("res=",res);
// }) 
// console.log("test=",test);

//增
/**
 * 传进来的参数是一个对象，要包括集合名colname和要插入的数据data
 * @param {Object} option ={colname:'user',data:[{},{},...]}
 */
async function insert(option){
    let {client,db} = await connect();
    
    const col = db.collection(option.colname);
    if(!Array.isArray(option.data)){
        option.data = [option.data];
    }
    let data = {};
    try{
        let result = await col.insertMany(option.data);
        console.log("insertRes=",result);
        //插入成功
        if(result.insertedCount){
            data = {flag:true}
        }else{ //插入失败
            data = {falg:false}
        }
    }catch(err){
        data={falg:false}
    }
    //关闭连接
    client.close();
    return data;
}
// 测试增加
/* let dataList = [
    {
        username:'off',
        password:'123',
    },
    {
        username:'gun',
        password:'123456',
    },
    {
        username:'roy',
        password:'654',
    }
];
insert({
    colname:'user',
    data:dataList,
}).then(res=>{
    console.log(res);
}); */

//删
/**
 * 传进来的参数是一个对象，要包括集合名colname和 删除的条件 query
 * @param {Object} option ={colname:'',query:{username:''}}
 */
async function remove(option){
    let {client,db} = await connect();
    const col = db.collection(option.colname);
    let data = {};
    try{
        let result = await col.deleteMany(option.query);
        if(result.deletedCount){//删除成功
            data = {flag:true}
        }else{
            data = {flag:false}
        }
    }catch(err){
        data = {flag:false}
    }
    //关闭连接
    client.close();
    return data;
}

//删除测试
/* remove({
    colname:'user',
    query:{username:'off'}
}); */

//改
/**
 * 参数是一个对象，要包括集合名colname和 修改的条件 query:{} 以及要修改的数据data:{}
 * @param {Object} option={colname:'',query:{查询条件},data:{goods_num:3}}
 */
async function update(option){
    let {client,db} = await connect();
    const col = db.collection(option.colname);
    let data = {};
    try{
        let result = await col.updateMany(
            option.query,
            {$set:option.data}
        );
        if(result.modifiedCount){//修改成功
            data = {flag:true,msg:"update success"}
        }else{
            data = {flag:false}
        }
        client.close();
    }catch(err){
        data = {flag:false};
    }
    return data
}
// 测试修改
/* update({
    colname:'user',
    query:{password:"654"},
    data:{like:'karry'}
}).then(res=>{
    console.log("res=",res);
}) */

//查
async function find(option){
    //默认参数
    let defOption = {
        query:{},
        page:1,
        size:10,
        sort:{}
    };
    Object.assign(defOption,option);
    let {client,db} = await connect();
    let col = db.collection(defOption.colname);

    try{
        let index = (defOption.page-1)*defOption.size
        let arr = await col
        .find(defOption.query)
        .limit(defOption.size*1)
        .skip(index)
        .sort(defOption.sort)
        .toArray();
        client.close();
        return arr;
    }catch(err){
        return err;
    }
}

//查询所有
async function findtotal(option){
    let defOption = {
        query:{}
    };
    Object.assign(defOption,option);
    let {client,db} = await connect();
    let col = db.collection(defOption.colname);

    try{
        let arr = await col
        .find(defOption.query)
        .toArray();
        client.close();
        return arr;
    }catch(err){
        return err;
    }
}
module.exports = {
    insert,
    remove,
    update,
    find,
    findtotal
}