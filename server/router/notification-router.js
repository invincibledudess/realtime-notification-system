/**
 * Notification specific API
 *
 */

'use strict';

var unreadNotifications = [];

var mongoose = require('mongoose'),
	Notifications = mongoose.model('Notifications');

var notificationController = require('./../controllers/notification-controllers');

module.exports = function(app) {

	/* The API gets the count of all the newly added / unread notification */
	app.get('/notifications/count', function(req, res) {
		notificationController.getNotificationsCount().then(function(count) {
			res.send({'count': count});
		});
	});

	/* The API gets the notification details for either next 10 notifications or all unread notifications*/
	app.get('/notifications', function(req, res) {
		notificationController.getNotifications().then(function(notifs) {
			unreadNotifications = notifs;
			res.send(notifs);
		});
	});

	app.get('/notifications/old', function(req, res) {
		var date = req.query.date;
		notificationController.getOldNotifications(date).then(function(notifs) {
			unreadNotifications = notifs;
			res.send(notifs);
		});
	});

	app.post('/adaptive/model', function(req, res) {
		console.info('req.body : ', req.body);
		console.info('req.params : ', req.params);
		console.info('req.query : ', req.query);
		console.info('req.data : ', req.data);
	});

	/* The API marks all the notifications as 'read' after the user views the notification drop down */
	app.put('/notifications/mark/read', function(req, res) {
		var notifIdList = unreadNotifications.map(function(notif) {
			return notif._id;
		});
		Notifications.update(
			{'_id': {'$in': notifIdList}},
			{'$set': {'read': true}},
			{'multi': true}
		).exec().then(function(result) {
			res.send(result);
		});
	});

};
