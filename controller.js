const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);
    var fullpage = require('./fullpage.js');
    var nlegs = require('./nlegs.js')
    // GET Endpoint
    if (reqUrl.pathname == '/sample' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.sampleRequest(req, res);
    } 
    if (reqUrl.pathname == '/fullpage' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        fullpage.sampleRequest(req, res);
    } 
    if (reqUrl.pathname == '/nlegs' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        nlegs.sampleRequest(req, res);
    } 
});