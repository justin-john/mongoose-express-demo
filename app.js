
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var express = require('express');
var middleware = require('./middleware');
var routes = require('./routes');
var http = require('http');

var app = express();
mongoose.set('debug', true);
// all environments
mongoose.connect('mongodb://localhost/yourdatabasename', function (err) {
    if (err) throw err;
    /* All Middlewares  are placed in "middleware.js" file */
    middleware(app);
    /* All routes are placed in "routes.js" file */
    routes(app);

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Mongoose demo server listening on port ' + app.get('port'));
    });
});
