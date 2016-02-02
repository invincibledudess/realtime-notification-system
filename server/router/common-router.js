/**
 * The file contains the generic API and not notification specific
 *
 * @param app
 */

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index.html', {'title': 'Notification System'});
	});
};
