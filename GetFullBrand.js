const url = require('url');
var request = require("request");
const axios = require('axios');
const jsdom = require("jsdom");
const pLimit = require('p-limit');
const fs = require('fs');
const limit = pLimit(3);
const { JSDOM } = jsdom;
listlink = ['https://www.theiconic.com.au/tommy-hilfiger/','https://www.theiconic.com.au/adidas-performance/'];
//listlink=['https://www.theiconic.com.au/womens-shoes-dress-shoes/','https://www.theiconic.com.au/womens-shoes-dress-shoes/?&sort=popularity&category=70'];




 
// var tinhsotrang = new Promise(function(resolve, reject){
//     request(link[0], function (error, response, body) {
//         const getproduct = (new JSDOM(body)).window;
//         getnumberproduct = getproduct.document.querySelector("#catalog").getAttribute("data-total-items");
//         numberpage=1 + parseInt(Number(getnumberproduct)/48);
//         brand = getproduct.document.querySelector("#catalog-header > h1").innerHTML.trim();
//         res.push({   
//         "brandname": brand,
//         "sumproduct":getnumberproduct,
//         "numberpage":numberpage,
//         })
//     resolve(res)
//     });
    
// });

// var tinhsotrangbrand = new Promise((resolve)=>{
// for(i=0;i<link.length;i++){
// request(link[i], function (error, response, body) {
// //   console.error('error:', error); // Print the error if one occurred
// //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
// //   console.log('body:', body); // Print the HTML for the Google homepage.
//     const getproduct = (new JSDOM(body)).window;
//     getnumberproduct = getproduct.document.querySelector("#catalog").getAttribute("data-total-items");
//     numberpage=1 + parseInt(Number(getnumberproduct)/48);
//     a = body.url;
//     brand = getproduct.document.querySelector("#catalog-header > h1").innerHTML.trim();
//     // var listlink = [link];
//     // for (let i = 1; i < numberpage; i++) { listlink[i] = link + "?page="+(i+1) }
    // res.push({   
    //     "brandname": brand,
    //     "sumproduct":getnumberproduct,
    //     "numberpage":numberpage,

    // })
// });
// }
// resolve(res);
// });
// console.log('Asynchronous request made.');

//tinhsotrang.then(function(data){console.log(data)});
function genurl(e){
    e2 = [e.link];
    for (let i = 1; i < e.numberpage; i++) { e2[i] = e.link + "?page="+(i+1) }
    return e2;
}
function geturlproduct(e){
    e2 = genurl(e);
    // return axios.get(e.link).then(response=>{
    //             let urlproduct =[];
    //             const getproduct = (new JSDOM(response.data)).window; 
    //             getlink = getproduct.document.querySelectorAll("#catalog-images-wrapper > div > div > figure > a:nth-child(1)");
    //             Array.from(getlink).map(result=>{urlproduct.push("https://www.theiconic.com.au"+result.href)});
    //             //console.log(urlproduct)
    //             return urlproduct;
    //             //for(let i =0;i<getlink.length;i++){dem++; urlproduct.push({"STT":dem,"url":"https://www.theiconic.com.au"+getlink[i].href})}
    //         })
    const urlproduct =[];
    return Promise.all(e2.map(result => axios.get(result)))
    .then(function(data){
        data.forEach(element=>{
            const getproduct = (new JSDOM(element.data)).window;  
            getlink = getproduct.document.querySelectorAll("#catalog-images-wrapper > div > div > figure > a:nth-child(1)");
            //console.log(urlproduct);
            Array.from(getlink).map(result=>{urlproduct.push("https://www.theiconic.com.au"+result.href)});
        })
        return urlproduct;
    })
        
}
Promise.all(listlink.map(result => axios.get(result)))
    .then(function(data){
        var res=[];
        data.forEach(element =>{
            const getproduct = (new JSDOM(element.data)).window; 
            getnumberproduct = getproduct.document.querySelector("#catalog").getAttribute("data-total-items");
            numberpage=1 + parseInt(Number(getnumberproduct)/48);
            brand = getproduct.document.querySelector("#catalog-header > h1").innerHTML.trim();
            res.push({   
                "brandname": brand,
                "sumproduct":getnumberproduct,
                "numberpage":numberpage,
                "link":element.config.url,
            })
        })
        return res;
    })
    .then((data)=>{
        var uproduct=[]
        var dem = 0;
        console.log(data)
        return Promise.all(data.map(element=>geturlproduct(element))).then(res=>{return uproduct=res})
    })
    .then((data)=>{
        e=[]
        for(i=0;i<data.length;i++){
        e = e.concat(data[i]);
    }
    return e;
    })
    .then((data)=>{ e = data.join('\n');console.log(e);fs.writeFile('mynewfile3.txt', e, function (err) {
        if (err) throw err;
        console.log('Replaced!');
      });});  