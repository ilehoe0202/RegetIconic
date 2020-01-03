const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
axios.get('http://www.nlegs.com/show/201910.html').then(response => {
    const getproduct = (new JSDOM(response.data)).window;
    console.log("getproduct " + getproduct)
    getlink = getproduct.document.querySelectorAll("body > div > div:nth-child(3) > div > div > table > tbody > tr > td > a")
    var listlink = []
    for (let i = 0; i < getlink.length; i++) { listlink[i] = "http://www.nlegs.com" + getlink[i].href }
    response =
        {
            "link": listlink,

        }
    //console.log(listlink)
    var res2 = []
    axios.all(listlink.map(result => axios.get(result)))
    .then(axios.spread((...data) => {
        data.forEach(element => {
            const getproduct = (new JSDOM(element.data)).window;
            var listimg_product = [];
            namealbum = getproduct.document.querySelector("body > div > div:nth-child(2) > ul > li.active");
            imglist = getproduct.document.querySelectorAll("body > div > div:nth-child(3) > div > div > div > a")
            for (let i = 0; i < imglist.length; i++) {
                test = imglist[i].href
                listimg_product[i] = "http://www.nlegs.com" + test.substring(test.indexOf("%2Fp%2F") + 7, test.length)
            }
            res2.push({
                "name": namealbum.innerHTML.replace(/\r?\n|\r/g, ""),
                "img": listimg_product,
            })
        })
        console.log(res2)
        }));
}).catch(error => {
    console.log(error);
});