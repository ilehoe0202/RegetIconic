const url = require('url');
var request = require("request");
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function alertFinished(){

    console.log('Finished add data');
}
async function parseData(error, response, body) {
    if (error) throw new Error(error);
  
    //console.log(body);
    const getproduct = (await new JSDOM(body)).window; 
    vip = getproduct.document.querySelectorAll("#product > div.row.product-content > section.small-12.columns.product-views.large-8.product-views-grid > div.row.product-gallery > div.small-12.columns.product-images.show-for-large-up > div > div > div >a")
    for(let i =0;i<vip.length;i++)
    { test = vip[i].href
    listimg_product[i] =await "https://static.theiconic.com.au/p/" + test.substring(test.indexOf("%2Fp%2F")+7,test.length) 
    console.log(listimg_product[i])
    }
    console.log("done parse")
    //console.log(listimg_product)
    return listimg_product;
  }
function getimg (get_products,callback){

    request(get_products,parseData)
    callback();
}

exports.sampleRequest = async function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var name = 'World';
    var altname = 'heyhey'
    var link = 'nolink'
    var b;
    var get_products
    var listimg_product=[];
    if (reqUrl.query.link) {
        console.log(reqUrl.query.link)
        link = reqUrl.query.link
        //link = "https://www.theiconic.com.au/womens-shoes-boots/?page=1&sort=popularity&brand=blundstone"
        console.log(link)
        axios.get(link).then(response => {
            const getproduct = (new JSDOM(response.data)).window; 
            console.log("getproduct "+getproduct)
            getlink = getproduct.document.querySelectorAll("#catalog-images-wrapper > div > div > figure > a:nth-child(1)")
            var listlink = []
            for(let i =0;i<getlink.length;i++)
            { listlink[i] = "https://www.theiconic.com.au"+getlink[i].href}
            response = 
            {
                "link": listlink,
        
            }
            var dem=1;
            var res2=[]
            //let a = listlink.map(result =>{console.log(result)})
            axios.all(listlink.map(result =>axios.get(result)))
            .then(axios.spread((...data)=>{
                data.forEach(element => {
                    console.log(dem++)
                    //var listimg_product = [];
                    var listimg_product="";
                    var secondtag= "";
                    var sku1="";
                    var subcategory="";
                    var charSKU = "";
                    var sizez="";
                    const getproduct = (new JSDOM(element.data)).window; 
                    a = getproduct.document.querySelector("#product > script:nth-child(1)").text
                    getsku = JSON.parse(a)
                    imglist = getproduct.document.querySelectorAll("#product > div.row.product-content > section.small-12.columns.product-views.large-8.product-views-grid > div.row.product-gallery > div.small-12.columns.product-images.show-for-large-up > div > div > div >a")
                    detail = getproduct.document.querySelector("#productDetails > div > div");
                    nameproduct = getproduct.document.querySelector("#product > div.row.product-content > section.small-12.columns.product-information.large-4 > div > div:nth-child(1) > div:nth-child(1) > h1")
                    brand = getsku.product.brand.name;
                    subcategory = getsku.product.subcategory.name;
                    category = getsku.product.department.name+" > "+getsku.product.category.name;
                    getsku.product.simples.map(prod=>{ sizez += prod.original_size + "|"})
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
                    res2.push({
                        "sku": getsku.sku,
                        "name":nameproduct.innerHTML.replace(/\r?\n|\r/g, "") ,
                        "price" : getsku.product.price, 
                        "img": listimg_product,
                        "bodytext": bodytext,
                        "size": sizez,
                        "brand": brand,
                        "gender" : gender,
                        "subcategory" : subcategory,
                        "tag": brand+", "+gender+", "+getsku.product.category.name,
                        "category": category,
                        })

                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(res2));
                console.log(res2)
            })).catch(error => {
                console.log(error);
                });
            //console.log(response)
        }).catch(error => {
        console.log(error);
        });
      // await request(get_products,parseData)
       //b= item;

    

    }
    
    //console.log(b)
};