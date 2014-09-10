// Stripped down version of - A Simple JSONP Proxy for NodeJS by - http://twitter.com/oJshua
'use strict';

var http = require('http'),
    url = require('url'),
    request = require('request');

var port = parseInt(process.env.PORT) || 8001;

http.createServer(function(req, res) {
    var params = url.parse(req.url, true).query;
    function sendUsage() {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
        });
        res.write('npm registry jsonp proxy\n\n');
        res.write('Usage:\n');
        res.write('\tpath: The path to access, (required).\n');
        res.write('\tcallback: The function name to use for the JSON response.\n');
        return res.end();
    }
    function sendFailBoat() {
        res.writeHead(400, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
        });
        res.write('Whoops. Something failed');
        return res.end();
    }
    function sendJSONP(data) {
        var callback = params.callback;
        var headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        };
        if(callback) {
            headers['Content-Type'] = 'application/javascript';
        }
        res.writeHead(200, headers);
        var body = callback ? callback + '(' + data + ')' : data;
        res.write(body);
        return res.end();
    }
    if (!params.path) {
        sendUsage();
    } else {
        request('http://registry.npmjs.org/' + params.path, function(err, response, body) {
            if (!err) {
                sendJSONP(body);
            } else {
                sendFailBoat();
            }
        });
    }
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port);
