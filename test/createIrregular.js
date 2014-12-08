// Initial test to create a time series

var tsdb = require('../');

var options = { "regular": false, "interval": "minute", "precision": 0, "start": "2014-01-12T00:00:00+00:00" };

var sample_return = { tid: 'AAe5ebbd9d942a97b8ff8ac20d71facda5',
  timeseries: 
   { interval: 'minute',
     precision: 0,
     regular: 'false',
     start: '2014-01-12T00:00:00+00:00',
     token: 'AA7344e07cad5ae5f341380690b967c198' },
  url: '/ts/tid/AAe5ebbd9d942a97b8ff8ac20d71facda5' };

options.token = sample_return.timeseries.token;

tsdb.create(options, function(err, ts) {

        if(!err) {
	   console.log(ts)
	} else {
	   console.log("Error: " + err);
	}
});
