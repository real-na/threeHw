const request = require('request');
const cheerio = require('cheerio');

//目标地址
const url = 'https://m.happigo.com';
//目标地址是html页面的地址

//发起请求，获取目标地址内容
// for(let i = 3;i<=7;i++){}
request(url,(err,res,body)=>{
    //body就是整个页面结构的内容
    const $ = cheerio.load(body);
    //$('.box)表示获取body内的class名为box的盒子
    let goodsList = [];
    $('.good-prod .items').each((idx,item)=>{
        console.log(1);
        let $item = $(item);
        let $info = $item.find('.g-info');
        let name = $info.find('.g-name').text();
        console.log("name=",name);
        let oldPrice = $info.find('.g-price i').text();
        let newPrice = $info.find('.g-price').filter(()=>{
            return this.nodeType === 3;
        }).text();
        let imgUrl = $item.find('.g-img img').attr('data-original');

        //可以以数组的形式获取小图片数组
        // let imgs = Array.from($el.find('.swiper_content img').map((idx,el)=>$(el).attr('orginalsrc')));

        let goods = {
            name,oldPrice,newPrice,imgUrl
        };
        goodsList.push(goods);
    });
    console.log("goodsList=",goodsList);

})