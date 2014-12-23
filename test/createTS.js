// Initial test to create a time series

var tsdb = require('../');

var options = { "regular": true, "interval": "minute", "precision": 2, "start": "2014-01-06T00:00:00+00:00" };

tsdb.createTSDB(options, function(err, ts) {

    if(!err) {
	   console.log(ts)
	} else {
	   console.log("Error: " + err);
	}
	
});
