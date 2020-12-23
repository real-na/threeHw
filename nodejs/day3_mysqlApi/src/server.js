const express = require('express');

const app = express();
const allRouter = require('./api');
app.use(express.static('../public'));

app.use('/',allRouter);
app.listen(20083,()=>{
    console.log("server is running on http://localhost:20083");
})