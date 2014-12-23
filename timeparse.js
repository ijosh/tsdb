function Timeparse(timething) {

	// try and take the timething and turn it into a Date object
	// then return a Date object or an error
	console.log(timething);

		if(typeof timething == "string" || typeof timething == "object") {
			// try to parse the date like 2014-12-06T00:47:00+00:00
			var parts = timething.split("T");
			var dateparts = parts[0].split("-");
			var timeparts = parts[1].split(":");
			var seconds = timeparts[2].split("+");

			console.log(seconds);

			return new Date(dateparts[0], dateparts[1], dateparts[2], timeparts[0], timeparts[1], seconds[0]); 
			
		} else {
			// try to treat as an millisecond integer Epoch and divide by 1000
			return new Date(timething / 1000);
	}
}

exports.Timeparse = Timeparse;

exports.parse = function(timething) {
    return new Timeparse(timething);
}
