const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const mongo = require('./db/mongo');

const serverUrl = 'http://localhost:20086/';
// 目标地址
const url = 'http://store.lining.com/shop/goodsCate-sale,desc,1,15s15_122,15_122_m,15_122_ls15_122_10,15_122_10_m,15_122_10_l-0-0-15_122_10,15_122_10_m,15_122_10_l-0s0-0-0-min,max-0.html';

// 发起请求，获取目标地址内容
request(url,async (err,res,body)=>{
    const $ = cheerio.load(body);
    let goodslist = [];
    $('.selItem').each((idx,el)=>{
        let $el = $(el);
        let $price = $el.find('.price');

        //图片拼接成本地路径存入数据库
        let bigimg = $el.find('.selMainPic img').attr('orginalsrc');
        // 获取图片名称
        let filename = path.basename(bigimg); //xxx.jpg
        let newBigimg = serverUrl + 'img/' + filename;

        let name = $el.find('.hgoodsName').text();
        let price = $price.text().slice(1)*1;
        let sku = $price.attr('sku');
        let newImgs = [];
        $el.find('.swiper_content img').map((idx,el)=>{
            let smallUrl = $(el).attr('orginalsrc');
            let filenames = path.basename(smallUrl);
            console.log("filenames");
            let smallImg = serverUrl + 'img/small/' + filenames;
            newImgs.push(smallImg);
            //爬取小图到本地
            let fileStreams = fs.createWriteStream('../public/img/small/'+filenames);
            request(smallUrl).pipe(fileStreams);
        });

        let goods = {
            sku,
            name,
            newBigimg,
            price,
            newImgs,
        }
        goodslist.push(goods);

        // 2. 爬取大图到本地
        const fileStream = fs.createWriteStream('../public/img/'+filename);
        // request请求图片地址，返回一个数据流Stream
        request(bigimg).pipe(fileStream);
    });

    // ========> 封装好的操作数据库的接口插入数据库
    let result = await mongo.insert('dataCrawler',goodslist);
    console.log(result);
});