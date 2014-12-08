// Initial test to get a time series

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



tsdb.min(ts, function(err, data) {
console.log("Calling min");
        if(!err) {
	   console.log(data)
	} else {
	   console.log("Error: " + err);
	}
});

tsdb.max(ts, function(err, data) {
console.log("Calling max");

        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});

tsdb.median(ts, function(err, data) {

console.log("Calling median");
        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});

tsdb.sum(ts, function(err, data) {
console.log("Calling sum");

        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});

tsdb.avg(ts, function(err, data) {
console.log("Calling avg");

        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});

tsdb.first(ts, function(err, data) {
console.log("Calling first");

        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});

tsdb.last(ts, function(err, data) {
console.log("Calling last");

        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});

tsdb.variance(ts, function(err, data) {
console.log("Calling variance");

        if(!err) {
           console.log(data)
        } else {
           console.log("Error: " + err);
        }
});
