const debug = require("debug")("db");
const mysql = require("mysql");
const config = require("./config");
const db = require("./db");

module.exports = function initializeDatabase(callback) {
	debug("initializing connection pool");
	const db_connection_pool = mysql.createPool(config.database);

	db.tracker = db_connection_pool;
	db.escape = (the_string) => mysql.escape(the_string);

	callback(null);
};
