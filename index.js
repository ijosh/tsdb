// Hildebrand Timeseries storage driver


var request = require('request'),
    util = require('util'),
	events = require('events'),
	//constants = require('./lib/constants'),
	host = 'tsdb.info',
	port = 80,
	version = 'v1',
	token = '',
	query = '';

exports.debug_mode = false;

// Constructor

function TSDBClient(data, options) {

	this.data = data;
	this.options = options = options || {};

	var self = this;

    events.EventEmitter.call(this);

};

util.inherits(TSDBClient, events.EventEmitter);
exports.TSDBClient = TSDBClient;


// Makes things easier to see in debug
function Query(method, path, params, callback) {
    this.method = method;
    this.params = params;
    this.callback = callback;
};

// Private method that will make the API requests and assemble parameters
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

        url = url + "/" + params.tid + "?token=" + params.timeseries.token;
        console.log(url);
        
        request(url, function(err, httpResponse, body) {
            if(err) {
                callback(err, url);
            }
            callback(null,body);
        });
    };

    if(method == "POST") {
        
        request.post({ url: url, body: params, json: true }, function(err, httpResponse, body) {
            if(err) {
                callback(err, "Failed to POST data");
            }
            callback(null,body);
        });

    };
    if(method == "PUT") { 

        url = url + "/" + params.tid + "?token=" + params.timeseries.token;
        console.log(url);
        console.log(params.data);
        
        request.put({ url: url, body: params.data, json: true }, function(err, httpResponse, body) {
            if(err) {
                callback(err, "Failed to PUT data");
            }
            callback(null,body);
        });
        
    };

};

// Create
exports.create = function (options, callback) {
    console.log(options);
    send_query("POST", "/ts", options, function(err, newts) {
    
        callback(err, newts);
        
    });
};

// Read
exports.read = function (options, callback) {
    console.log(options);
    send_query("GET", "/ts/tid", options, function(err, ts) {
    
        callback(err, ts);
        
    });
};

// Update
exports.update = function (options, data, callback) {
    options.data = data;
    console.log(JSON.stringify(options));
    send_query("PUT", "/ts/tid", options, function(err, newts) {
    
        callback(err, newts);
        
    });
};
