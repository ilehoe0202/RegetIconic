const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
listimg_product = [];
var res2=[]
axios.get('https://www.petstock.com.au/product/dog/bravecto-spot-on-for-dogs-20-40kg-blue/64288').then(response => {
 
                    //var listimg_product = [];
                    var listimg_product="";
                    var secondtag= "";
                    var sku1="";
                    var charSKU = "";
                    var sizez="";
                    const getproduct = (new JSDOM(response.data)).window; 
					sku = getproduct.document.querySelector("#etalage > li > a").getAttribute('data-sku')
					name = getproduct.document.querySelector(" div > div > section > h1").innerHTML.trim();
					category = getproduct.document.querySelector("#app > div.main > ul > li:nth-child(3) > a > span").textContent;
					img = "https://www.petstock.com.au"+getproduct.document.querySelector("#etalage > li > a > img").src;
					price = getproduct.document.querySelector(" div > div > section > div > div > meta:nth-child(2)").content
					brandname = getproduct.document.getElementsByClassName("product content-area")[0].attributes[9].textContent;
					bodytext = getproduct.document.querySelector("#tab1").children[0].innerHTML.trim()
					ingredient = getproduct.document.querySelector("#tab2").innerHTML.trim()
                    res2.push({
                        "sku": sku,
                        "name":name ,
						"category": category,
                        "img": img,
                        "price" : price, 		
                        "brand": brandname,						
                        "bodytext": bodytext,
                        "ingredient" : ingredient,
                        })
					
				console.log(res2);
				
                }).catch(error => {
                console.log(error);
                });
            //console.log(response)
