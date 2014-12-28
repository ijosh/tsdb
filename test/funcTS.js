// tests of the aggregation functions in tsdb library

var tsdb = require('../');
var timeparse = require('../timeparse');

var tseh = {
  sid: '23432442',
  from: '2014-12-06T00:00:00+00:00',
  to: '2014-12-06T10:00:00+00:00',
  period: 'minute',
  func: 'avg'
}

var ehtoken = { token: 'gzKFTJyNz0VodOCyET9xhHhbapfX7mmS' };
var myeh = tsdb.connectEH(ehtoken);

var now = new Date();

myeh.read(tseh, function(err, data) {

	if(!err) {
		console.log(myeh._kv());
		console.log("Linear estimate of now: " + myeh.line(now.getTime()/1000));
		console.log("Linear estimate of 2014-12-06T01:47:00+00:00 (" + timeparse.parse('2014-12-06T00:47:00+00:00').getTime()/1000 + ") : " + myeh.line(timeparse.parse('2014-12-06T00:47:00+00:00').getTime()/1000));
		console.log("Slope: " + myeh.slope());
		console.log("Intercept: " + myeh.intercept());
	} else {
		console.log("Error: " + err)
	}
});
