var express = require('express');
var app = express();

app.use('/js', express.static(__dirname + '/js'));
app.use('/dist', express.static(__dirname + '/../dist'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/misc', express.static(__dirname + '/misc'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(__dirname  + '/index.html');
});
app.listen(process.env.PORT || 8000);
console.log('server listening on port 8000 ...');