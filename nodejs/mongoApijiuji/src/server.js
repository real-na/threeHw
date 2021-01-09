const express = require('express');

const app = express();
const allRouter = require('./router');
app.use(express.static('../public'));

app.use('/',allRouter);
app.listen(2008,()=>{
    console.log("server is running on http://localhost:2008");
})