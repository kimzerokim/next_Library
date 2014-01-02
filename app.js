/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view option', { layout: false });
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//start
app.get('/', routes.start);
app.get('/error', routes.error);

//login
app.get('/login', routes.login);
app.post('/loginComplete', routes.loginEnter);

//register
app.get('/register', routes.register);
app.post('/registerComplete', routes.registerEnter);

//main
app.get('/:id', routes.main);


//create Node Server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});