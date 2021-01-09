let request = require('../utils/request');

//分页获取列表页数据
function getList({query={},page=1,size=20,sort=''}){
    // console.log("query=",query,page,size,sort);
    return request.get('/goods/list',{params:{
        query,
        page,
        size,
        sort,
    }})
}

// 支持正则的 query={name:'华为'}
function regGet({query={},page=1,size=20,sort=''}){
    return request.get('/goods/regList',{params:{
        query,
        page,
        size,
        sort,
    }})
}

// 获取详情页数据
function getDetails(id){
    return request.get('/goods/details/'+id)
}

module.exports = {
    getList,
    regGet,
    getDetails
}