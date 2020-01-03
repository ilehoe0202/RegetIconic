const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
listimg_product = [];
var res2=[]
axios.get('https://www.theiconic.com.au/dillon-oxford-shirt-569859.html').then(response => {
 
                    //var listimg_product = [];
                    var listimg_product="";
                    var secondtag= "";
                    var sku1="";
                    var subcategory="";
                    var charSKU = "";
                    var sizez="";
                    const getproduct = (new JSDOM(response.data)).window; 
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
                    //console.log(getsku.product)
                    //getsku = getproduct
                    //console.log(response)
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
                        "sku": sku,
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
                console.log(res2)
                }).catch(error => {
                console.log(error);
                });
            //console.log(response)
