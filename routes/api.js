var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = "postgres://shxubekmjnxrcc:2GqaZBl4opvvkqBPhdrvjddyWJ@ec2-54-243-51-102.compute-1.amazonaws.com:5432/d8ks1be0unkr2b?ssl=true";

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('/api endpoint requested.');

	next(); // make sure we go to the next routes and don't stop here
});

/* GET listing. */
router.get('/', function(req, res) {
  res.send('Nothing to see here...');
});

router.route('/trackerlog/:trackerid')

  .post(function(req, res) {
		// Do some validation before even thinking about connecting to the database.
		if(typeof(req.body.lat) === 'undefined' || typeof(req.body.lng) === 'undefined'){
			res.json({ error: 'lat and/or lng parameters missing in post body'});
			return;
		}

		pg.connect(conString, function(err, client, done) {
			if(err) {
				res.json({ message: 'error fetching client from pool' + err});
				return console.error('error fetching client from pool', err);
			}

			var queryString = 'INSERT INTO trackerlog VALUES(NOW(), ' + req.body.lng + ', ' + req.body.lat + ',' + req.params.trackerid + ')';
			client.query(queryString, function(err, result) {
				//call `done()` to release the client back to the pool
				done();

				if(err) {
					res.json({ message: 'error running query' + err});
					return console.error('error running query', err);
				}

				res.json({ message: 'GPS datapoint lng: ' + req.body.lng +
				' lat: ' + req.body.lat +
				' saved for tracker: ' + req.params.trackerid});
			});
		});
	})

  .get(function(req, res) {
		pg.connect(conString, function(err, client, done) {
			if(err) {
				return console.error('error fetching client from pool', err);
			}
			client.query('SELECT * FROM trackerlog WHERE trackerid = ' + req.params.trackerid, function(err, result) {

				//call `done()` to release the client back to the pool
				done();

				if(err) {
					return console.error('error running query', err);
				}

				res.json(result.rows)
			});
		});
  })

module.exports = router;
