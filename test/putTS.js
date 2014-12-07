// Initial test to update a time series

var tsdb = require('../');

var ts = { 
  tid: 'AAf6f2c7805f1b831cfdac15efdae22515',
  timeseries: 
   { interval: 'minute',
     precision: 2,
     regular: 'false',
     start: '2014-01-06T00:00:00+00:00',
     token: 'AAeb60c291291e2223798af30b996d8d3b' },
  url: '/ts/tid/AAf6f2c7805f1b831cfdac15efdae22515' 
};

var data = {
  "data": [ { "t" : "2014-12-06T00:00:00+00:00", "v" : 13.3 }, { "t" : "2014-12-06T01:00:00+00:00", "v" : 14.4 } ]
};



tsdb.update(ts, data, function(err, data) {

        if(!err) {
	   console.log(data)
	} else {
	   console.log("Error: " + err);
	}
});
