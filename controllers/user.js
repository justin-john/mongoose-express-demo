
/*
 * User Controller
 * @Author Justin John Mathews
 */

var user = function () {
    var UserModel = require('../models/users'),
        list = function (req, res) {
            res.render('index');
        },
        register = function (req, res) {
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            var schema = {
                'email': req.param('email'),
                'username': req.param('username'),
                'password': req.param('password')
            };
            /* Check the passwords are match */
            if (req.param('password') === req.param('repassword')) {
                UserModel.saveUser(schema, function (e, user, result) {
                    if (e) {
                        console.log(e);
                        var obj = {
                            'email': schema.email,
                            'username': schema.username
                        };
                        /* MongoError Check: Errors triggered from MongoDB.
                         *  Error code: 11000 shows already same value is existed for unique indexed field.
                         *
                         * */
                        if (e.code == 11000) {
                            var duplicatedValue = e.err.match(/"\S*/);
                            obj.message = 'The ' + duplicatedValue[0] + ' is already taken. Please take another one!';
                        } else if (e.errors) {
                            for (var key in e.errors) {
                              if (e.errors.hasOwnProperty(key)) {
                                obj.message = e.errors[key].type;
                              }
                            }
                        } else {
                            obj.message = 'Sorry, Something weired!';
                        }
                        res.render('register', obj);
                    } else {
                        req.session.user = schema.username;
                        res.redirect('/');
                    }
                });
            } else {
                var obj = {
                    'email': schema.email,
                    'username': schema.username,
                    'message': 'Passwords do not match!'
                };
                res.render('register', obj);
            }
        },
        login = function (req, res) {
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            /*  Executes the query as a findOne() operation, passing the first found document to the callback.
            *
            *  ####Example
            *  model.findOne(conditions, callback);
            * */
            UserModel.findOne({
                '$or': [
                    { 'email': req.param('email') },
                    { 'username': req.param('email') }
                ],
                password: req.param('password')
            }, function (err, doc) {
                if (err) {
                    res.render('login', { 'message': "Sorry, something gone wrong!" });
                } else if (doc) {
                    req.session.user = doc.username;
                    res.redirect('/');
                } else {
                    res.render('login', { 'message': "Email/Username or password is wrong!" });
                }
            });
        },
        logout = function (req, res) {
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            if (req.session && req.session.user) {
                delete req.session.user;
            }
            res.redirect('/login');
        },
        viewProfile = function (req, res) {
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            /* Executes this query as an findOne operation with retrieving needed fields only.
            *
            *  ####Example
            *  model.findOne(conditions, fieldsNeededInResult, callback);
            * */
            UserModel.findOne(
                /* The condition to find query */
                { 'username': req.session.user },
                /*  The query result will contain only "email" and "username",
                 *  but "_id" is removed from result.
                 *  A field prefixed with "-" is removed from result and fields without any prefix are included in result.
                 * */
                '-_id email username',
                function (err, doc) {
                    console.log(err, doc);
                    if (err) {
                        res.render('login', { 'message': "Sorry, We can't find a user!" });
                    } else {
                        res.render('profile', doc);
                    }
                }
            );
        },
        saveProfile = function (req, res) {
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            var updateSchema = {
                'email': req.param('email'),
                'username': req.param('username')
            };
            /*  Executes this query as an update() operation.
            *
            *  ####Example
            *  model.update(condition, updateDocument, callback);
            * */
            UserModel.update(
                /* The condition to find query */
                { 'username': req.session.user },
                updateSchema,
                function (e, resultSet) {
                    console.log(e, resultSet);
                    var obj = updateSchema;
                    if (e) {
                        if (e.code == 11001) {
                            obj.error = true;
                            var duplicatedValue = e.err.match(/"\S*/);
                            obj.message = 'The ' + duplicatedValue[0] + ' is already taken for another user!';
                        } else if (e.errors) {
                            obj.error = true;
                            for (var key in e.errors) {
                                if (e.errors.hasOwnProperty(key)) {
                                    obj.message = e.errors[key].type;
                                }
                            }
                        }
                    } else {
                        delete req.session.user;
                        req.session.user = obj.username;
                        obj.success = true;
                        obj.message = "Successfully updated your profile...";
                    }
                    res.render('profile', obj);
                }
            );
        },
        renderPasswordPage = function (req, res) {
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            res.render('password');
        },
        /* First middleware method for route "app.post('/password', ..."  */   
        findLoggedUser = function (req, res, next) {
            req.loggedUser = null;
            res.locals.partials = {
                header: 'elements/header',
                footer: 'elements/footer'
            };
            var condition = { 'username': req.session.user };
            UserModel.findOne(condition, '_id password', function(e, user) {
                if(!e && user) {
                    req.loggedUser = user;
                } else {
                    return res.render('password', { 'error': true, 'message': "Sorry, user doesn't exist!" });
                }
                next();
            });

        },
        /* Second middleware method for route "app.post('/password', ..."  */
        checkCurrentPasswordMatch = function (req, res, next) {
            req.checkCurrentPasswordMatch = false;
            if (req.loggedUser.password == req.param('currentpassword')) {
                req.checkCurrentPasswordMatch = true;
            } else {
                return res.render('password', { 'error': true, 'message': "The current password is wrong!" });
            }
            next();
        },
        /* Third middleware method for route "app.post('/password', ..."  */
        checkPasswordsMatch = function (req, res, next) {
            req.checkPasswordsMatch = false;
            if (req.param('password') == req.param('repassword')) {
                req.checkPasswordsMatch = true;
            } else {
                return res.render('password', { 'error': true, 'message': "Passwords do not match!" });
            }
            next();
        },
        /* Final callback method for route "app.post('/password', ..."  */
        changePassword = function (req, res) {
            var passwordSchema = {
                'password': req.param('password')
            },
            condition = { 'username': req.session.user };
            /*  Executes this query as an update() operation.
            *
            *  ####Example
            *  model.update(condition, updateDocument, callback);
            * */
            UserModel.update(
                /* The condition to find query */
                condition,
                passwordSchema,
                function (e, resultSet) {
                    var obj = {};
                    if (e) {
                        if (e.errors) {
                            obj.error = true;
                            for (var key in e.errors) {
                                if (e.errors.hasOwnProperty(key)) {
                                    obj.message = e.errors[key].type;
                                }
                            }
                        }
                    } else {
                        obj.success = true;
                        obj.message = "Successfully updated your profile...";
                    }
                    res.render('password', obj);
                }
            );
        };

    return {
        list: list,
        register: register,
        login: login,
        logout: logout,
        viewProfile: viewProfile,
        profile: saveProfile,
        renderPasswordPage: renderPasswordPage,
        findLoggedUser: findLoggedUser,
        checkCurrentPasswordMatch: checkCurrentPasswordMatch,
        checkPasswordsMatch: checkPasswordsMatch,
        password: changePassword
    };
}();

module.exports = user;
