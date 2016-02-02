'use strict';

var mongoose = require('mongoose'),
	Notifications = mongoose.model('Notifications');

/* Queries the db to fetch the count of all unread notifications */
function getNotificationsCount() {
	return Notifications.count({'read': false}).exec();
}

/* Queries the db to fetch the unread notifications */
function getNotifications() {
	return Notifications.find({'read': false})
		.sort('createdTimestamp')
		.limit(10)
		.populate('user')
		.exec();
}

/* Queries the db to fetch the other 10 older notifications*/
function getOldNotifications(date) {
	return Notifications.find({'createdTimestamp': {'$lt': date}})
		.sort('-createdTimestamp')
		.limit(10)
		.populate('user')
		.exec();
}

module.exports = {
	'getNotificationsCount': getNotificationsCount,
	'getNotifications': getNotifications,
	'getOldNotifications': getOldNotifications
};
