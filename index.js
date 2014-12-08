// Hildebrand Timeseries data access driver


var request = require('request'),
    util = require('util'),
	events = require('events'),
	//constants = require('./lib/constants'),
	host = 'tsdb.info',
	port = 80,
	version = 'v1',
	token = '',
    default_period = 'hour',
	query = '';

exports.debug_mode = false;

// Constructors

// TSDB client that will get timeseries data
function TSDBClient(data, options) {

	this.data = data;
	this.options = options = options || {};

	var self = this;

    events.EventEmitter.call(this);

};

util.inherits(TSDBClient, events.EventEmitter);
exports.TSDBClient = TSDBClient;

// Energyhive client that will get timeseries data
function EHClient(data, options) {

    this.data = data;
    this.options = options = options || {};

    var self = this;

    events.EventEmitter.call(this);

};

util.inherits(EHClient, events.EventEmitter);
exports.EHClient = EHClient;

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

    var url = "http://" + host + ":" + port + "/" + version + path;

    if(method == "GET") { 

        url = url + "/" + params.tid + "?token=" + params.timeseries.token + "&" + params.queryparams;
        //console.log(url);
        
        request(url, function(err, httpResponse, body) {
            if(err) {
                callback(err, url);
            }
            callback(null,body);
        });
    };

    if(method == "POST") {

        if(params.token) {
            url = url + "?token=" + params.token + "&" + params.queryparams;
        }
        
        request.post({ url: url, body: params, json: true }, function(err, httpResponse, body) {
            if(err) {
                callback(err, "Failed to POST data");
            }
            callback(null,body);
        });

    };
    if(method == "PUT") { 

        url = url + "/" + params.tid + "?token=" + params.timeseries.token + "&" + params.queryparams;
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


exports.connectEH = function(options, callback) {
    return new EHClient(options, callback);
}

exports.connectTSDB = function(options, callback) {
    return new TSDBClient(options, callback);
}

// Create ONLY valid for TSDB service, not energyhive
TSDBClient.prototype.create = function (options, callback) {
    console.log(options);
    send_query("POST", "/ts", options, function(err, newts) {
    
        callback(err, newts);
        
    });
};


// Read
TSDBClient.prototype.read = function (options, callback) {
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};


// Update
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



// Aggregates
TSDBClient.prototype.min = function (options, callback) {

    options.queryparams = "aggregate=min&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

TSDBClient.prototype.max = function (options, callback) {

    options.queryparams = "aggregate=max&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

TSDBClient.prototype.sum = function (options, callback) {

    options.queryparams = "aggregate=sum&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

TSDBClient.prototype.avg = function (options, callback) {

    options.queryparams = "aggregate=avg&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
};

TSDBClient.prototype.median = function (options, callback) {

    options.queryparams = "aggregate=median&cal=" + default_period;
    //console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        this.data = JSON.parse(ts).data;
        callback(err, this.data);
        
    });
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




