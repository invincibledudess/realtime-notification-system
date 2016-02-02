(function() {
    var notification = {
        'unread': 0,

        /*
         * Called on initialization of the application.
         * Sets up socket.io connection to get the notification in real time
         * */
        'init': function() {
            var socket;

            /* get the unread notification count */
            notification.getCount();

            socket = io.connect();
            socket.on('notificationCount', function(res) {

                /*update the notification count*/
                notification.update(res.count);

                /* If the notification dropdown is open, update the unread count and render the notification in the list */
                if ($('.notif-container').hasClass('open')) {

                    notification.unread = parseInt(notification.unread) + parseInt(res.count);
                    $('.notif-container .main-count')[0].innerHTML = notification.unread;

                    /* get the notifications from db and render the notification list. */
                    notification.get();
                }
            });
        },

        /*
        * Fetches the count of unread notifications from the database
        * */
        'getCount': function() {
            $.ajax({
                'url': '/notifications/count',
                'success': function(res) {
                    notification.unread = res.count;

                    /* update the notification count */
                    notification.update(res.count);
                },
                'error': function(err) {
                    console.error('error : ', err);
                }
            });
        },

        /*
        * Updates the notification count on the UI.
        * If the notification count > 100, the UI shows it to be 99+
        * */
        'update': function(count) {

            /* show the unread notification count if there are any notifications */
            if (count > 0) {
                var node = $('.main-count');
                node.removeClass('hide-element');
                if (count < 100) {
                    for (var i = 0; i < node.length; i++) {
                        node[i].innerHTML = count;
                    }
                } else {
                    for (var j = 0; j < node.length; j++) {
                        node[j].innerHTML = '99+';
                        node[j].style.fontSize = '9px';
                        node[j].style.lineHeight = '23px';
                    }
                }
            }

            /* hide the unread notification count if there are no notifications */
            if (count <= 0) {
                $('.main-count').addClass('hide-element');
            }
        },

        /*
        * Fetches the unread notifications
        * */
        'get': function() {
            $('.loader-container').removeClass('hide');
            $.ajax({
                'url': '/notifications',
                'success': function(notifs) {

                    /* Mark the fetched notifications as read in the database */
                    notification.markAsRead();

                    /* update the notification count */
                    notification.renderList(notifs);
                },
                'error': function(err) {
                    console.error('error : ', err);
                },
                'complete': function() {
                    $('.loader-container').addClass('hide');
                }
            });
        },

        /*
        * Creates the notification divs for the notification dropdown and appends it to the dropdown.
        * If the notification count > 0, the notifications are appended to the dom.
        * */
        'renderList': function(notifs) {
            $('.notification .main-count').addClass('hide-element');
            var notifDOM = document.getElementsByClassName('list')[0];
            if (notifs.length) {
                $('.notif-container .main-count').removeClass('hide-element');

                notifs.forEach(function(notif) {
                    var listNode = notification.getNotifListNode(notif, 'new');
                    notifDOM.insertBefore(listNode, notifDOM.childNodes[1]);
                });
            } else {
                $('.list-item').addClass('read');
                $('.notif-container .main-count').addClass('hide-element');
            }
        },

        /*
        * Create Notification DOM element
        * */
        'getNotifListNode': function(notif, oldOrNew) {
            var notifTime = notification.formatDatetime(notif.createdTimestamp);

            /* Create List Node */
            var listNode = document.createElement('div');
            listNode.setAttribute('data-date', notif.createdTimestamp);
            listNode.className = oldOrNew === 'new' ? 'list-item pa-l': 'list-item pa-l read';

            /* Create user image node */
            var userImg = document.createElement('img');
            userImg.className = 'pull-left';
            userImg.src = 'static/img/' + notif.user.imgName;

            /* Create notification text node */
            var contentDiv = document.createElement('div');
            contentDiv.className = 'content';
            contentDiv.innerHTML = '<span>' + notif.user.firstName + ' </span>' + notif.desc;

            /* Create notification time node*/
            var timeDiv = document.createElement('div');
            timeDiv.className = 'notif-time';
            timeDiv.innerText = notifTime;

            /* Append the above created elements to List */
            listNode.appendChild(userImg);
            listNode.appendChild(contentDiv);
            listNode.appendChild(timeDiv);
            return listNode;
        },

        /*
        * Sends a PUT call to the server to update the fetched notifications as read.
        * */
        'markAsRead': function(notifs) {
            $.ajax({
                'url': '/notifications/mark/read',
                'type': 'PUT',
                'success': function(res) {

                    /* update the notification count */
                    notification.update(res.count);
                },
                'error': function(err) {
                    console.error('error : ', err);
                }
            });
        },

        /*
        * Toggle notification drop-down.
        * */
        'togglePanel': function() {
            var notifContainer = $('.notif-container');

            /* If notification dropdown already opened, update the notification list */
            if (!notifContainer.hasClass('open')) {
                notification.unread = parseInt($('.notification .main-count')[0].innerHTML);
                $('.list-item').addClass('read');
                notification.get();
            } else {
                /* Hide unread notification count */
                notification.update(0);
                notification.unread = 0;
            }
            notifContainer.toggleClass('open');
        },

        /*
        * Get the older notifications from db and append to the notification list.
        * */
        'renderOldNotifs': function(notifs) {
            var notifDOM = document.getElementsByClassName('list')[0];
            notifs.forEach(function(notif) {
                var listNode = notification.getNotifListNode(notif, 'old');
                notifDOM.appendChild(listNode);
            });
        },

        /*
        * Helper function to format Date and Time
        * */
        'formatDatetime': function(dateTime) {
            var date = new Date(dateTime);
            var year = date.getFullYear(),
                month = date.getMonth() + 1, // months are zero indexed
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
                minuteFormatted = minute < 10 ? '0' + minute : minute,
                morning = hour < 12 ? 'am' : 'pm';

            return month + '/' + day + '/' + year + ' ' + hourFormatted + ':' +
                minuteFormatted + morning;
        },

        /*
        * Fetches the last 10 older notifications from the database.
        * */
        'getOldNotifications': function(dateTimestamp) {
            $('.loader-container').removeClass('hide');
            $.ajax({
                'url': '/notifications/old',
                'data': {
                    'date': dateTimestamp
                },
                'success': function(notifs) {
                    notification.renderOldNotifs(notifs);
                },
                'error': function(err) {
                    console.error('error : ', err);
                },
                'complete': function() {
                    $('.loader-container').addClass('hide');
                }
            });
        }
    };

    $(document).ready(function() {
        notification.init();

        /* Close notification drop down on clicking anywhere outside the drop down */
        $(document).click(function() {
            notification.unread = 0;
            $('.notif-container').removeClass('open');
        });

        /* Prevent the closure of notification drop down on clicking any element in the notification list */
        $('.notification, .notif-container').click(function(e) {
            e.stopPropagation();
        });

        /* On notification list scroll, get older notifications from the database, when reached at the end */
        $('.list').scroll(function() {
            if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).innerHeight()) {
                notification.getOldNotifications($(this).find('.list-item').last().attr('data-date'));
            }
        });

        /* Register event handler for notification click */
        $('.notification').on('click', notification.togglePanel);
    });
})();
