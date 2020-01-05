const axios = require('axios');
const jsdom = require("jsdom");
const pLimit = require('p-limit');
const { JSDOM } = jsdom;
const limit = pLimit(2);
const fs = require('fs');

var done =0;
var csv = [];
var dem = 0;

function readFile(filename, enc){
  return new Promise(function (fulfill, reject){
    fs.readFile(filename, enc, function (err, res){
      if (err) reject(err);
      else fulfill(res);
    });
  });
}
readFile('mynewfile3.txt','utf8')
.then(res => {
    return res.toString().split('\n');
})
.then(res =>{
    urls = res;
    let promises = urls.map(url => {
    return limit(() => axios.get(url).then(response =>{
        var listimg_product="";
        var secondtag= "";
        var sku1="";
        var subcategory="";
        var charSKU = "";
        var sizez="";
        var sizeqty="";
        var numsize=0;
        var sizei = [];
        var sizeqtyi =[]
        const getproduct = (new JSDOM(response.data)).window;
        a = getproduct.document.querySelector("#product > script:nth-child(1)").text
        getsku = JSON.parse(a)
        imglist = getproduct.document.querySelectorAll("#product > div.row.product-content > section.small-12.columns.product-views.large-8.product-views-grid > div.row.product-gallery > div.small-12.columns.product-images.show-for-large-up > div > div > div >a")
        detail = getproduct.document.querySelector("#productDetails > div > div");
        nameproduct = getproduct.document.querySelector("#product > div.row.product-content > section.small-12.columns.product-information.large-4 > div > div:nth-child(1) > div:nth-child(1) > h1")
        brand = getsku.product.brand.name;
        subcategory = getsku.product.subcategory.name;
        category = getsku.product.department.name+" > "+getsku.product.category.name;
        getsku.product.simples.map(prod=>{sizei[numsize]=prod.original_size;sizeqtyi[numsize]=prod.quantity; numsize++;sizez += prod.original_size + "|";sizeqty+=prod.quantity+"|";})
        gender = getsku.product.gender.name.replace("unisex","Female|Male")
        gender = gender.charAt(0).toUpperCase() + gender.slice(1)
        charSKU = getsku.sku.split('');
        sku = charSKU.map(skuu => {x = skuu.charCodeAt(0)+2;return String.fromCharCode((x>=48&&x<=57)||(x<=90&&x>=65) ? x : x < 65 ? x -10 : x-26) } ).join("");
        for(let i =0;i<imglist.length;i++)
        { test = imglist[i].href
        // listimg_product[i] ="https://static.theiconic.com.au/p/" + test.substring(test.indexOf("%2Fp%2F")+7,test.length) 
        // //console.log("imglist "+listimg_product[i])
        listimg_product+= "https://static.theiconic.com.au/p/" + test.substring(test.indexOf("%2Fp%2F")+7,test.length)
        if(i<imglist.length-1)
        {
            listimg_product += ", "
        }
        }
        bodytext = detail.innerHTML.replace(/\r?\n|\r/g, "").replace("THE ICONIC","AFASHION")
        full = {
            "sku": getsku.sku,
            "name":nameproduct.innerHTML.replace(/\r?\n|\r/g, "") ,
            "price" : getsku.product.price, 
            "img": listimg_product,
            "bodytext": bodytext,
            "size": sizez,
            "sizeqty": sizeqty,
            "sizei":sizei,
            "sizeqtyi":sizeqtyi,
            "numsize":numsize,
            "brand": brand,
            "gender" : gender,
            "subcategory" : subcategory,
            "tag": brand+", "+gender+", "+getsku.product.category.name,
            "category": category,
        }
        done=done+1;
        nameproduct = getproduct.document.querySelector("#product > div.row.product-content > section.small-12.columns.product-information.large-4 > div > div:nth-child(1) > div:nth-child(1) > h1").innerHTML.trim();
        return [full,done];
    }).then((res)=>{
        dem++;
        csv[dem]="variable,"+res[0].sku+","+res[0].name+",1,0,visible,\""+res[0].bodytext+"\",1,,,,1,"+res[0].category+",\""+res[0].tag+"\",\""+res[0].img +"\",,Size,"+res[0].size+","+res[0].brand+","+res[0].gender+","+res[0].subcategory;
        for(i=0;i<res[0].numsize;i++)
        {
            dem++;
            csv[dem]="variation,,"+res[0].name+",1,0,visible,,1,"+res[0].sizeqtyi[i]+",,"+res[0].price+",1,,,,"+res[0].sku+",Size,"+res[0].sizei[i]+",,,";
        }
        console.log(res[1]);return res[0];
        }));
});

    (async () => {
    csv[0] = "Type,SKU,Name,Published,Is featured?,Visibility in catalog,Description,In stock?,Stock,Sale price,Regular price,Allow customer reviews?,Categories,Tags,Images,Parent,Attribute 1 name,Attribute 1 value(s),Brand,Gender,Sub Category";

    // Only three promises are run at once (as defined above)
    const result = await Promise.all(promises).then(()=>{
        e = csv.join('\n');
        fs.writeFile('test.csv', e, function (err) {
        if (err) throw err;
        console.log(e);
        });
    });
    console.log(result);
})();
    return console.log(res);
})
console.log('after calling readFile');


