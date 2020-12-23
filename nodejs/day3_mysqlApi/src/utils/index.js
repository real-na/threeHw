function formatData({code=200,flag=true,data=[],msg}={}){
    //{code=200,flag=true,data=[],msg="success"}={}
    //设置默认值，如果调用formatData()不传参,形参拿到为undefined,不能解构
    //所以要给{code=200,flag=true,data=[],msg="success"}一个默认值空对象{}
    if(code === 200){
        msg = !msg?'success':msg;
    }
    if(code === 400){
        flag = false;
        msg = !msg?'fail':msg;
    };
    if(code === 500){
        flag = false;
        msg = 'database error';
    }
    return {
        code,
        flag,
        data,
        msg,
    }
}

module.exports = {
    formatData,
}