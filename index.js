// Hildebrand Timeseries data access driver


var request = require('request'),
    util = require('util'),
	events = require('events'),
    ss = require('simple-statistics'),
    timeparse = require('./timeparse'),
	//constants = require('./lib/constants'),
	host = 'tsdb.info',
	port = 80,
	version = 'v1',
	token = null,
    values = new Array(),           // values from the return data
    kv,                             // keys and values from the return data
    default_period = 'hour',
    default_func = 'avg',
    default_time_offset,
	query = '';

exports.debug_mode = false;

// Constructors

// TSDB client that will get timeseries data
function TSDBClient(options) {

    console.log(options);

    if ( options.token.toString().length !== 34 ) {
        throw new Error("A valid 34-byte token must be supplied");
    }

    token = options.token;

    if ( options.host ) {
        host = options.host;
    }

    if ( options.port ) {
        port = options.port;
    }

    if ( parseInt(options.to,10) == false) {
        options.to = new Date(options.to);
    }

    if ( parseInt(options.from,10) == false) {
        options.from = new Date(options.from);
    }

    this.version = version;
	this.options = options = options || {};

	var self = this;

    events.EventEmitter.call(this);

};

util.inherits(TSDBClient, events.EventEmitter);
exports.TSDBClient = TSDBClient;


// Energyhive client inherits parent TSDBClient
function EHClient(options) {
    //TSDBClient.apply(this, Array.prototype.slice.call(options));

    if ( options.token.toString().length !== 32 ) {
        throw new Error("A valid 32-byte token must be supplied");
    }

    var d = new Date()
    default_time_offset = d.getTimezoneOffset();

    token = options.token;
    host = 'www.energyhive.com';
    port = '80';

    if ( options.host ) {
        host = options.host;
    }

    if ( options.port ) {
        port = options.port;
    }

    this.version = version;
    this.options = options = options || {};

    var self = this;

    events.EventEmitter.call(this);    
}

util.inherits(EHClient, TSDBClient);

// Makes things easier to see in debug
function Query(method, path, params, callback) {
    this.method = method;
    this.params = params;
    this.callback = callback;
};

// Private method that will make the API requests to TSDB and assemble parameters
var send_query = function (method, path, params, callback) {

    if ( method.toString() !== "GET" && method.toString() !== "POST" && method.toString() !== "PUT" ) {
        throw new Error("First argument to send_query must be the request type GET, POST or PUT, not " + method);
    }

    if (typeof path !== "string") {
        throw new Error("Second argument to send_query must be the command object, not " + typeof path);
    }

    if (typeof params !== "object") {
        throw new Error("Third argument to send_query must be the command object, not " + typeof params);
    }

    query_obj = new Query(method, path, params, callback);

    var url = "http://" + host + ":" + port;

    if(version) {
        url = url + "/" + version;
    }

    if(path) {
        url = url + path;
    }

    if(method == "GET") {

        if(params.tid) {
            url = url + "/" + params.tid;
        } 

        url = url + "?token=" + token;

    	if(params.queryparams) {
    		url = url + "&" + params.queryparams;
    	}

        if(params.to && params.from && (params.tid)) {
		    url = url + "&toDate=" + params.to + "&fromDate=" + params.from;
	    }

        if(params.to && params.from && (params.sid)) {
            url = url + "&toTime=" + params.to + "&fromTime=" + params.from;
        }

        if(params.period) {
            url = url + "&aggPeriod=" + params.period;
        } else {
            url = url + "&aggPeriod=" + default_period;
        }

        if(params.func) {
            url = url + "&aggFunc=" + params.func;
        } else {
            url = url + "&aggFunc=" + default_func;
        }

        url = url + "&offset=" + default_time_offset;

        console.log(params);
        console.log(url);
        
        request(url, function(err, httpResponse, body) {
            if(err) {
                callback(err, null);
            }
            callback(null,body);
        });
    };

    if(method == "POST") {

        if(params.token) {
            url = url + "?token=" + token + "&" + params.queryparams;
        }
        
        request.post({ url: url, body: params, json: true }, function(err, httpResponse, body) {
            if(err) {
                callback(err, "Failed to POST data");
            }
            callback(null,body);
        });

    };
    if(method == "PUT") { 

        url = url + "/" + params.tid + "?token=" + token + "&" + params.queryparams;
        //console.log(url);
        //console.log(params.data);
        
        request.put({ url: url, body: params.data, json: true }, function(err, httpResponse, body) {
            if(err) {
                callback(err, "Failed to PUT data");
            }
            callback(null,body);
        });
        
    };

};


exports.connectEH = function(options) {
    return new EHClient(options);
}

exports.connectTSDB = function(options) {
    return new TSDBClient(options);
}

// Create ONLY valid for TSDB service, not energyhive
exports.createTSDB = function (options, callback) {
    console.log(options);
    send_query("POST", "/ts", options, function(err, newts) {
    
        callback(err, newts);
        
    });
};


// Read TSDB
TSDBClient.prototype.read = function (options, callback) {

    send_query("GET", "/ts/tid", options, function(err, ts) {

        this.data = {};

        if(ts) {
            this.data = JSON.parse(ts).data;
        }

        callback(err, this.data);
        
    });
};

// Read energyhive
EHClient.prototype.read = function (options, callback) {
    //console.log(options);

    options.to = timeparse.parse(options.to).getTime()/1000;
    options.from = timeparse.parse(options.from).getTime()/1000;

    //options.period = "hour";
    //options.func = "avg";

    version = null;
    send_query("GET", "/mobile_proxy/getTimeSeries", options, function(err, ts) {

        //this.data = new Array();
        //console.log(ts);

        if(ts) {
            var returned_data = JSON.parse(ts).data;
            for (ld in returned_data) {
                if(returned_data[ld] != 'undef') {
                   values.push(returned_data[ld][0]); 
                }  
            }
        }

        callback(err, values);
        
    });
};


// Update TSDB ONLY
TSDBClient.prototype.update = function (options, data, callback) {
    // Hope they don't mix epoch and human readable timestamps
    if(parseInt(data[0].t)) {
        options.queryparams = "format=epoch";
    }

    options.data = data;
    //console.log(JSON.stringify(options));
    send_query("PUT", "/ts/tid", options, function(err, newts) {
    
        callback(err, newts);
        
    });
};


// Aggregates - polymorphic (not exactly yet)
TSDBClient.prototype.min = function (options, callback) {

    options.queryparams = "aggregate=min&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

EHClient.prototype.min = function () {
    return ss.min(values);
};

TSDBClient.prototype.max = function (options, callback) {

    options.queryparams = "aggregate=max&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

EHClient.prototype.max = function () {
    return ss.max(values);
};

TSDBClient.prototype.sum = function (options, callback) {

    options.queryparams = "aggregate=sum&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

EHClient.prototype.sum = function () {
    return ss.sum(values);
};

TSDBClient.prototype.mean = function (options, callback) {

    options.queryparams = "aggregate=avg&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

EHClient.prototype.mean = function () {
    return ss.mean(values);
};

TSDBClient.prototype.median = function (options, callback) {

    options.queryparams = "aggregate=median&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

EHClient.prototype.median = function () {
    return ss.median(values);
};

TSDBClient.prototype.first = function (options, callback) {

    options.queryparams = "aggregate=first&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

TSDBClient.prototype.last = function (options, callback) {

    options.queryparams = "aggregate=last&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

EHClient.prototype.mode = function () {
    return ss.mode(values);
};

EHClient.prototype.variance = function () {
    return ss.variance(values);
};

EHClient.prototype.standard_deviation = function () {
    return ss.standard_deviation(values);
};

EHClient.prototype.median_absolute_deviation = function () {
    return ss.median_absolute_deviation(values);
};

EHClient.prototype.harmonic_mean = function () {
    return ss.harmonic_mean(values);
};

EHClient.prototype.root_mean_square = function () {
    return ss.root_mean_square(values);
};

EHClient.prototype.sample_variance = function () {
    return ss.sample_variance(values);
};

EHClient.prototype.sample_skewness = function () {
    return ss.sample_skewness(values);
};









