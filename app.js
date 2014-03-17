// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb

var port = process.env.PORT || 8080;

// configuration ===============================================================

mongoose.connect('mongodb://localhost/routes_data1'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// define model ================================================================

var Schema = mongoose.Schema;
var RouteSchema = new Schema(
	{
		lat: String
	,
		lng: String
	}
)
var Route = mongoose.model('Route', RouteSchema);

// routes ======================================================================

	// api ---------------------------------------------------------------------
	// get all routes
	app.get('/api/routes', function(req, res) {

		// use mongoose to get all routes in the database
		Route.find(function(err, routes) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}

			res.json(routes); // return all routes in JSON format
		});
	});

	// create todo and send back all routes after creation
	app.post('/api/routes', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Route.create({
			lat : req.body.lat,
			lng: req.body.lng
		}, function(err, coords) {
			if (err)
				res.send(err);

			// get and return all the routes after you create another
			Route.find(function(err, routes) {
				if (err)
					res.send(err)
				res.json(routes);
			});
		});

	});

	// delete a todo
	app.delete('/api/routes/:todo_id', function(req, res) {
		Route.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the routes after you create another
			Route.find(function(err, routes) {
				if (err)
					res.send(err)
				res.json(routes);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
