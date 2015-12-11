var express = require('express');
var app = express();
app.use('/',express.static('./')).listen(8000);
console.log('server listening on port 8000');