// Initial test to get a time series

var tsdb = require('../');

var ts = { 
  tid: 'AAd12d22692068bb7307d687a6005cde27',
  to: '2014-12-06T00:47:00+00:00',
  from: '2014-12-06T00:00:00+00:00'
};

var ts1 = { 
  tid: 'AAd12d22692068bb7307d687a6005cde27'
};

var ts2 = { 
  tid: 'AAd12d22692068bb7307d687a6005cde27'
};

var tseh = {
  sid: '23432442',
  to: '2014-12-06T00:47:00+00:00',
  from: '2014-12-06T00:00:00+00:00'
}

//var myoptions = { token: 'AA70dae61912e87da546081178df67bb96' };
var ehtoken = { token: 'gzKFTJyNz0VodOCyET9xhHhbapfX7mmS' };
//var mytsdb = tsdb.connectTSDB(myoptions);
var myeh = tsdb.connectEH(ehtoken);

//console.log(mytsdb);


myeh.read(tseh, function(err, data) {

	if(!err) {
		console.log(data)
	} else {
		console.log("Error: " + err)
	}
});


/* mytsdb.read(ts1, function(err, data) {

  //this.data = data;
  if(!err) {
	   console.log(data)
	} else {
	   console.log("Error: " + err);
	}
});
*/
