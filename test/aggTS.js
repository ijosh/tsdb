// tests of the aggregation functions in tsdb library

var tsdb = require('../');

var tseh = {
  sid: '23432442',
  from: '2014-12-06T00:00:00+00:00',
  to: '2014-12-06T12:00:00+00:00',
  period: 'minute',
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
		console.log("Geometric Mean: " + myeh.geometric_mean());
		console.log("Harmonic Mean: " + myeh.harmonic_mean());
		console.log("Interquartile Range: " + myeh.iqr());
		console.log("Median Absolute Deviation: " + myeh.median_absolute_deviation());
	} else {
		console.log("Error: " + err)
	}
});
