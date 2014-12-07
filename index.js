// Hildebrand Timeseries storage driver


var request = require('request'),
	//events = require('events'),
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

    this.data.on("connect", function () {
        self.on_connect();
    });

    this.data.on("data", function (buffer_from_socket) {
        self.on_data(buffer_from_socket);
    });

    this.data.on("error", function (msg) {
        self.on_error(msg.message);
    });

    this.data.on("close", function () {
        self.connection_gone("close");
    });

    events.EventEmitter.call(this);

}

TSDBClient.prototype.on_error = function (msg) {
    var message = "TSDB connection to " + this.host + ":" + this.port + " failed - " + msg;

    if (this.closing) {
        return;
    }

    if (exports.debug_mode) {
        console.warn(message);
    }

    this.emit("error", new Error(message));
    // "error" events get turned into exceptions if they aren't listened for.  If the user handled this error
    // then we should try to reconnect.
};

TSDBClient.prototype.on_connect = function () {
    if (exports.debug_mode) {
        console.log("Query = http://" + this.host + ":" + this.port + "/" + this.version + "/" + this.query);
    }
    this.emit("query");
 };

// Makes things easier to see in debug
function Query(query, params, callback) {
    this.query = query;
    this.params = params;
    this.callback = callback;
};

/* Maybe private 
TSDBClient.prototype.send_query = function (query, params, callback) {

    var params, query_obj, i, stream = this.stream, query_str = "", lcaseCommand;

    if (typeof query !== "string") {
        throw new Error("First argument to send_query must be the command name string, not " + typeof query);
    }

    query_obj = new Query(query, params, callback);

    if(query == "GET") {};
    if(query == "POST") {};
    if(query == "PUT") {};

};
*/

exports.create = function (options, callback) {
    console.log(options);
    callback(null,"Hello");
};


exports.TSDBClient = TSDBClient;

// Read

// Write

