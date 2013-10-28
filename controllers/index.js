
/*
 * Index Controller
 * @Author Justin John Mathews
 */

var home = function () {
    var UserModel = require('../models/users'),
    /*
     *  Push sample user data
     * */
        pushDummyData = function (req, res) {
            var usersArray = [
                { 'email': 'angeline@xxx.xx', 'username': 'angeline', 'password': 'angel1' },
                { 'email': 'justin@xxx.xx', 'username': 'justin', 'password': 'justin1' }
            ];
            /*  Executes the query as a create() operation, creating the all documents to database.
             *
             *  ####Example
             *  var schema = { 'username': 'angeline', 'password': 'angel1' };
             *  model.create(schema, callback);
             * */

            UserModel.create(usersArray, function (e, j, s) {
                /* Partials are used to include external templates like header.html and footer.html to a template */
                res.render('index', {
                    partials: {
                        header: 'elements/header',
                        footer: 'elements/footer'
                    },
                    list: usersArray
                });
            });
        },
    /*
     *  Render to index page
     * */
        index = function (req, res) {
            /*  Executes the query as a find() operation, passing the all documents to the callback.
             *
             *  ####Example
             *  model.find(conditions, callback);
             * */
            UserModel.find({}, function (err, docs) {
                console.log(err, docs);
                if (err) {
                    res.render('index', { 'message': "Sorry, something gone wrong!" });
                } else if (docs && docs.length) {
                    /* Partials are used to include external templates like header.html and footer.html to a template */
                    res.render('index', {
                        partials: {
                            header: 'elements/header',
                            footer: 'elements/footer'
                        },
                        list: docs
                    });
                    /* Partials can be set to "res.locals".
                     *  An middleware can be also written to set partials.
                     *
                     *  ####Example
                     *     res.locals.partials = {
                     *        header: 'elements/header',
                     *        footer: 'elements/footer'
                     *     }
                     *     res.render('index');
                     * */
                } else {
                    /* If no documents is available, push two sample documents to database */
                    pushDummyData(req, res);
                }
            });

        },
        register = function (req, res) {
            /* Partials are used to include external templates like header.html and footer.html to a template */
            res.render('register', {
                partials: {
                    header: 'elements/header',
                    footer: 'elements/footer'
                }
            });
        },
        login = function (req, res) {
            /* Partials are used to include external templates like header.html and footer.html to a template */
            res.render('login', {
                partials: {
                    header: 'elements/header',
                    footer: 'elements/footer'
                }
            });
        };

    return {
        index: index,
        renderRegisterPage: register,
        renderLoginPage: login
    };
}();

module.exports = home;
