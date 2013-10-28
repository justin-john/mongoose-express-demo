/*
 * User Model
 * @Author Justin John Mathews
 *
 */

var Users = function () {
    "use strict";
    var mongoose = require('mongoose'),
        /* Validation Functions on mongoose schema */
        /* Validate email for mongoose schema validate */
        validateEmail = function (email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        /* Validate minimum length for mongoose schema validate */
        getMinValidator = function (val) {
            return function  (v) {
                if (v && v.length) {
                    return v.length >= val;
                }
            }
        },
        /* Validate maximum length for mongoose schema validate */
        getMaxValidator = function (val) {
            return function  (v) {
                if (v && v.length) {
                    return v.length <= val;
                }
            }
        },
        Schema = mongoose.Schema,
        userSchema = new Schema({
            email: {
                type: String,
                required: true,
                index: { unique: true },
                validate : [
                    { validator: validateEmail, msg: 'Email should be valid!' },
                    { validator: getMinValidator(6), msg: 'Email should have minimum length of 6 chars' },
                    { validator: getMaxValidator(16), msg: 'Email exceeds the maximum length of 16 chars' }
                ]
            },
            username: {
                type: String,
                required: true,
                index: { unique: true },
                validate : [
                    { validator: getMinValidator(6), msg: 'Username should have minimum length of 6 chars' },
                    { validator: getMaxValidator(16), msg: 'Username exceeds the maximum length of 16 chars' }
                ]
            },
            password: {
                type: String,
                required: true,
                validate : [
                    { validator: getMinValidator(6), msg: 'Password should have minimum length of 6 chars' },
                    { validator: getMaxValidator(16), msg: 'Password exceeds the maximum length of 16 chars' }
                ]                
            },
            created: { type: Date, 'default': Date.now }
        });
        /* Custom Function added to create documents.
        *  Add new custom functions according to your requirement.
        *
        *  In controller pages
        *  ####Example
        *  modal.saveUser(schema, callback)
        *  
        * */
        userSchema.statics.saveUser = function (schema, cb) {
          this.create(schema, cb);
        };
    /*
    * All Mongoose inbuilt functions like "find", "findOne", "create", "save", "update" etc
    * and custom functions like "saveUser" etc are accessed in controller page
    * by returning the model.
    *
    *  In controller pages we can access these model methods as following
    *  ####Example
    *  modal.find(condition, callback);  //  inbuilt function in Mongoose Library
    *  modal.saveUser(schema, callback); //  custom function extended to Mongoose Library
    * */
    return mongoose.model('User', userSchema);
}();

module.exports = Users;
