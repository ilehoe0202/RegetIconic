const axios = require('axios');
const jsdom = require("jsdom");
var fs = require('fs');
var dir = './nlegs';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
const { JSDOM } = jsdom;
axios.defaults.headers.common['Referer'] = 'http://www.nlegs.com'
axios.get('http://www.nlegs.com/more.html').then(response => {
    const getproduct = (new JSDOM(response.data)).window;
    console.log("getproduct " + getproduct)
    getlink = getproduct.document.querySelectorAll("body > div > div:nth-child(2) > div > div > div.panel-body > div > a")
    var listlink = []
    for (let i = 0; i < getlink.length; i++) { listlink[i] = "http://www.nlegs.com" + getlink[i].href }
    response =
        {
            "link": listlink,

        }
//console.log(listlink)
axios.all(listlink.map(result => axios.get(result)))
.then(axios.spread((...data) => {
    var listalbum = []
    data.forEach(element => {
    const getproduct = (new JSDOM(element.data)).window;
    getalistalbum = getproduct.document.querySelectorAll("body > div > div:nth-child(3) > div > div > table > tbody > tr > td > a")
    for (let i = 0; i < getalistalbum.length; i++) { listalbum.push("http://www.nlegs.com" + getalistalbum[i].href)}
})
    //console.log(listalbum[0])
    //
    var res2 = []
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    //let paramerterArr = ['a','b','c','d','e','f']
    listalbum.reduce(function(promise, item) {
    return promise.then(function(result) {
    return Promise.all([delay(100), axios.get(item).catch(function(error) {
        console.error(error);
    })]).then((...data) => {
    var listalbumdetail = []
    data.forEach(element => {
        const getproducti = (new JSDOM(element.data)).window;
        namealbum = getproducti.document.querySelector("body > div > div:nth-child(2) > ul > li.active");
        imglist = getproducti.document.querySelectorAll("body > div > div:nth-child(3) > div > div > div > a")
        for (let i = 0; i < imglist.length; i++) {
            test = imglist[i].href
            listimg_product[i] = "http://www.nlegs.com" + test
        }
        res2.push({
            "name": namealbum.innerHTML.replace(/\r?\n|\r/g, ""),
            "img": listimg_product,
        })
        console.log(namealbum.innerHTML)
    })
    }).catch(error => {
    console.log(error);
});
    })
    }, Promise.resolve())
    let abc = JSON.stringify(res2);
    fs.writeFileSync('./nlegs/student.json', abc);
    console.log(listalbum)
})).catch(error => {
    console.log(error);
});
}).catch(error => {
    console.log(error);
});