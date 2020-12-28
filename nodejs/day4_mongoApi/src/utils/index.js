function formatData(obj={}){
    //{code=200,flag=true,data=[],msg="success"}={}
    //设置默认值，如果调用formatData()不传参,形参拿到为undefined,不能解构
    //所以要给{code=200,flag=true,data=[],msg="success"}一个默认值空对象{}
    let defObj = {
        code:200,
        flag:true,
        data:[],
        msg:'',
    }
    // console.log(obj,111);
    Object.assign(defObj,obj);
    // console.log(defObj,222);

    let {code,msg} = defObj;
    if(code === 200){
        defObj.msg = !msg?'success':msg;
    }
    if(code === 400){
        defObj.flag = false;
        defObj.msg = !msg?'fail':msg;
    };
    if(code === 500){
        defObj.flag = false;
        defObj.msg = 'database error';
    }
    return defObj
}

//格式化时间的方法
/* 补0函数*/
function addZero(num) {
    var res = num < 10 ? '0' + num : '' + num;
    return res;
}
/* 生成想要的格式的时间,返回为对象
参数为用new Date得到的这种格式的Sat Aug 15 2020 11:16:36 GMT+0800 (中国标准时间)
*/
function formatTime(date) {
    function addZero(num) {
        var res = num < 10 ? '0' + num : '' + num;
        return res;
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = date.getDay();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var sec = date.getSeconds();

    // 判断星期几
    var weeks = '天一二三四五六';

    weeks = '星期' + weeks[week];
    var obj = {
        year: year,
        month: addZero(month),
        day: addZero(day),
        hours: addZero(hours),
        minutes: addZero(minutes),
        sec: addZero(sec),
        week: weeks
    };
    return obj;
}

module.exports = {
    formatData,
    formatTime
}