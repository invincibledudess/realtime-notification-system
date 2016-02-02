/**
 * Created by Neha on 1/15/2016.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	'username': String,
	'firstName': String,
	'lastName': String,
	'imgName': String
});

mongoose.model('Users', userSchema, 'Users');
