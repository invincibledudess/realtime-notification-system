var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    io = require('socket.io'),
    mongoose = require('mongoose');

require('./server/models/notification.server.model');
require('./server/models/user.server.model');

var Notifications = mongoose.model('Notifications'),
    notificationCollection = require('./server/data/notifications.json');

var notificationController = require('./server/controllers/notification-controllers');

var DB_HOST = process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost',
    dbConfig = {
        'uri': 'mongodb://' + DB_HOST + '/fullstack-notification'
    };

app.set('views', './client');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/client'));

io = io.listen(app.listen(4000, function() {
    console.info('Application started on port : 4000');
}));

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
    function getUnreadNotification() {
        notificationController.getNotificationsCount().then(function(count) {
            io.emit('notificationCount', {'count': count});
        });
    }

    function insertNotifications() {
        var i = parseInt((Math.random() * notificationCollection.length), 10);
        Notifications.create(notificationCollection[i], function(err, docs) {
            if (err) {
                console.error('Unable to save data : ', err);
            } else {
                getUnreadNotification();
            }
        });
        setTimeout(insertNotifications, 10000);
    }

    insertNotifications();

    io.sockets.on('connection', function() {
        console.log('A user is connected');
    });
});

require('./server/router/common-router')(app);

require('./server/router/notification-router')(app);
