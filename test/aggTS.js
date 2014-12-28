// tests of the aggregation functions in tsdb library

var tsdb = require('../');

var tseh = {
  sid: '23432442',
  from: '2014-06-06T00:47:00+00:00',
  to: '2014-12-06T00:00:00+00:00',
  period: 'day',
  func: 'avg'
}

var ehtoken = { token: 'gzKFTJyNz0VodOCyET9xhHhbapfX7mmS' };
var myeh = tsdb.connectEH(ehtoken);

myeh.read(tseh, function(err, data) {

	if(!err) {
		//console.log(myeh._kv());
		console.log("Min: " + myeh.min());
		console.log("Max: " + myeh.max());
		console.log("Sum: " + myeh.sum());
		console.log("Mean: " + myeh.mean());
		console.log("Median: " + myeh.median());
		console.log("Mode: " + myeh.mode());
		console.log("Variance: " + myeh.variance());
		console.log("Standard Deviation: " + myeh.standard_deviation());
		console.log("Harmonic Mean: " + myeh.harmonic_mean());
	} else {
		console.log("Error: " + err)
	}
});
