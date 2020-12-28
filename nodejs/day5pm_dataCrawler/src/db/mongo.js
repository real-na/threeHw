// const mongodb,{ObjectId} = require('mongodb');
// const MongoClient = mongodb.MongoClient;
const {MongoClient,ObjectId} = require('mongodb');

//数据库配置
const config = {
    dbUrl: "mongodb://localhost:27017",
    dbName: "h52008",
}

async function connect(){
    const client = await MongoClient.connect(config.dbUrl,{ useUnifiedTopology: true });
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
 * 传进来的参数是一个数组0（增加的内容） 和  字符串（集合名）
 * @param {String} colname = 'user' 集合名
 * @param {Array} data = [{},{},...] 要插入的数据data
 */
async function insert(colname,data){
    let {client,db} = await connect();
    
    const col = db.collection(colname);
    if(!Array.isArray(data)){
        data = [data];
    }
    let code;
    try{
        let result = await col.insertMany(data);
        console.log("insertRes=",result);
        //插入成功
        if(result.insertedCount){
            code = 200;
        }else{ //插入失败
            code = 400;
        }
    }catch(err){
        code = 500;
    }
    //关闭连接
    client.close();
    return code;
}
// 测试增加
/* let dataList = [
    {
        username:'offsb',
        password:'123',
    },
    {
        username:'gungun',
        password:'123456',
    },
    {
        username:'ooroy',
        password:'654',
    }
];
insert('user',dataList)*/

/* insert('user',{username:'karry',password:'1234'}).then(res=>{
    console.log(res);
});  */

//删
/**
 * 传进来的参数是一个对象（删除的条件） 和  字符串（集合名）
 * @param {Object} query = {username:''} 删除的条件
 * @param {String} colname = 'user' ; 集合名
 */
async function remove(colname,query){
    let {client,db} = await connect();
    const col = db.collection(colname);
    if(query._id){
        // {_id:'5ec64ea8e362ce3ef0a95009'} -> {_id:ObjectId("5ec64ea8e362ce3ef0a95009")}
        query._id = ObjectId(query._id);
    }
    let code ;
    try{
        let result = await col.deleteMany(query);
        if(result.deletedCount){//删除成功
            code = 200
        }else{
            code = 400
        }
    }catch(err){
        code = 500
    }
    //关闭连接
    client.close();
    return code;
}

//删除测试
/* remove('user',{_id:'5ec64ea8e362ce3ef0a95009'}).then(res=>{
    console.log(res);
}); */

//改
/**
 * 参数 要包括 集合名colname 和 修改的条件 query:{} 以及要修改的数据data:{}
 * @param {String} colname = 'user'
 * @param {Object} query = {查询条件}  修改的条件
 * @param {Object} data = {goods_num:3} 要修改的数据
 */
async function update(colname,query,data){
    let {client,db} = await connect()
    const col = db.collection(colname);
    if(query._id){
        query._id = ObjectId(query._id);
    }
    let code;
    try{
        let result = await col.updateMany(
            query,
            {$set:data}
        );
        if(result.modifiedCount){//修改成功
            code = 200;
        }else{
            code = 400;
        }
        client.close();
    }catch(err){
        code = 500;
    }
    return code;
}
// 测试修改
/* update('user',{_id:"5ec64ea8e362ce3ef0a95009"},{like:'wkarry'}).then(res=>{
    console.log("res=",res);
}) */

//查
/**
 * query:查询条件，page页码，size:每页条数，sort:排序：
 * sort:'addtime,1'===>按照addtime升序排序，后面没有,1默认降序
 * @param {String} colname ='interviewQuestion' 集合名
 * @param {*} param1 = {query:{},page:1,size:10,sort=''}
 */
async function find(colname,{query = {},page=1,size = 10,sort=''} = {}){
    let {client,db} = await connect();

    //处理查询条件
    if(typeof(query) === 'string'){
        query = eval("(" + query + ")");
        // console.log("query=",typeof query);  
    }
    if(query._id){
        query._id = ObjectId(query._id);
    }

    //sort存在才处理排序,如果sort不存在,就直接不排序,检查用户名是否存在
    let sortRule = {};
    if(sort){
        sort = sort.split(',');
        if(sort.length === 1){
            sort[1] = -1; //默认降序排序.sort({key:-1})
        };
        sortRule = {[sort[0]]:sort[1]*1};
    }

    //页码
    let index = (page-1)*size;

    let col = db.collection(colname);

    // console.log("index=",index);
    // console.log("sort=",sortRule);
    // console.log("size=",size);
    // console.log("query=",query);

    try{
        let arr = await col
        .find(query)
        .sort(sortRule)
        .skip(index)
        .limit(size*1)
        .toArray();
        client.close();
        return arr;
    }catch(err){
        return 500;
    }
}

//查询所有
async function findtotal(colname,query={}){
    console.log("query=",query);
    let {client,db} = await connect();
    let col = db.collection(colname);

    //处理查询条件
    if(typeof(query) === 'string'){
        query = eval("(" + query + ")");
        // console.log("query=",typeof query);  
    }

    try{
        let arr = await col
        .find(query)
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
