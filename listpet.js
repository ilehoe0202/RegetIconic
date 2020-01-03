const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


axios.get('https://www.petstock.com.au/pet/filter/bravecto-b-1467').then(response => {
    const getproduct = (new JSDOM(response.data)).window;
    console.log("getproduct " + getproduct)
    getlink = getproduct.document.querySelectorAll("div.products > div > a.desc")
    
    var listlink = [];
    var listnameproduct = [];
    for (let i = 0; i < getlink.length; i++) { listlink[i] = "https://www.petstock.com.au/" + getlink[i].href;listname = getlink[i].textContent.trim().replace("\n"," ") }
    response =
        {
            "link": listlink,
            "product": listname,
        }
        console.log(response);
        console.log(listlink)
	var dem = 1;
	var res2 = []
    
    axios.all(listlink.map(result => axios.get(result)))
        .then(axios.spread((...data) => {
            data.forEach(element => {
                console.log(dem++)
                var listimg_product = [];
                const getproduct = (new JSDOM(element.data)).window;
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
				
				
            });
            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'application/json');
            // res.end(JSON.stringify(response));
            console.log(res2)
        }));	
    //console.log(response)
}).catch(error => {
    console.log(error);
});