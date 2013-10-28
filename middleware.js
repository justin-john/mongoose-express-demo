var express = require('express');
var cons = require('consolidate');
var hogan = require('hogan.js');

module.exports = function (app) {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.engine('html', cons.hogan);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('afgvDFdshdrt547658udgdFDfhfdFSGfs'));
    app.use(express.session());
    /* Middleware to check user is authenticated or not.
     * The "req.url" are URLs allowed without user session,
     * other routes are redirected to login
     * */
    app.use(function (req, res, next) {
        if (
                (req.session && req.session.user)
                        || req.url === '/'
                        || req.url === '/login'
                        || req.url === '/register'
                        || req.url.indexOf('/css') === 0
                        || req.url.indexOf('/js') === 0
                        || req.url.indexOf('/images') === 0
                ) {
            next();
        } else {
            return res.redirect('/login');
        }
    });
    /* Middleware to redirect to home, if session exists.
     * When user access "login" or "register" page on session,
     * the control will be redirected to "home".
     * */
    app.use(function (req, res, next) {
        if ((req.session && req.session.user) && (req.url === '/login' || req.url === '/register')) {
            return res.redirect('/');
        } else {
            next();
        }
    });
    /* Middleware to set session variable to view
     * The views can be access this session variable in templates
     * for checking user is logged in system.
     * */
    app.use(function (req, res, next) {
        if (req.session && req.session.user) {
            res.locals.user = req.session.user;
        }
        next();
    });
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    // development only
    if ('development' == app.get('env')) {
        console.log('development');
        app.use(express.errorHandler());
    }
}