var express = require('express');
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('/map endpoint requested.');

  next(); // make sure we go to the next routes and don't stop here
});

/* GET listing. */
router.get('/', function(req, res) {
  res.send('No user id supplied. Go to /map/:userid to use this endpoint.');
});

router.get('/:userid', function(req, res){
  res.render('map', { title: 'Connected Cat', userid: req.params.userid })
})

module.exports = router;
