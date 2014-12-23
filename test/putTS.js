// Initial test to update a time series

var tsdb = require('../');

var ts = { tid: 'AAd12d22692068bb7307d687a6005cde27' };

var myoptions = { token: 'AA70dae61912e87da546081178df67bb96' };
var mytsdb = tsdb.connectTSDB(myoptions);

var data = {
  "data": [ { "t" : "2014-12-06T00:00:00+00:00", "v" : 13.3 }, { "t" : "2014-12-06T01:00:00+00:00", "v" : 14.4 } ]
};


mytsdb.update(ts, data, function(err, data) {

        if(!err) {
	   console.log(data)
	} else {
	   console.log("Error: " + err);
	}
});
