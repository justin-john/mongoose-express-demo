var IndexController = require('./controllers');
var UserController = require('./controllers/user');

module.exports = function (app) {
    /* Normal Routes */
    app.get('/', IndexController.index);
    app.get('/register', IndexController.renderRegisterPage);
    app.post('/register', UserController.register);
    app.get('/login', IndexController.renderLoginPage);
    app.post('/login', UserController.login);
    app.get('/logout', UserController.logout);
    app.get('/users', UserController.list);
    app.get('/profile', UserController.viewProfile);
    app.post('/profile', UserController.profile);
    app.get('/password', UserController.renderPasswordPage);
    /*
    *  Another approach on handling routes.
    *  We can write different middlewares in a single route,
    *  and pass the result of one middleware to another middleware
    *  by using request & response object
    *
    *  ####Example
    *  app.post('/password', [middleware1, middleware2, middleware3], callback);
    *
    *  Advantages of this approach
    *    *- To avoid the deep nesting for single callback methods.
    *    *- Easily Readable code
    * */
    app.post('/password',
            [
                UserController.findLoggedUser,
                UserController.checkCurrentPasswordMatch,
                UserController.checkPasswordsMatch
            ],
            UserController.password);
}
