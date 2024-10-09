const Sequelize = require("sequelize");
const config = require("../lib/config").database;

const db = {};

db.connection = new Sequelize(`${config.databaseUrl}?sslmode=disable`, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
		  require: false, // Ensure SSL is not required
		  rejectUnauthorized: false // Bypass SSL validation
		}
	  }, 
	pool: {
		max: config.poolMax,
		min: config.poolMin,
		acquire: config.poolAcquire,
		idle: config.poolIdle
	},
});

db.models = require("./models")(db.connection, Sequelize);

db.sequelize = Sequelize;

db.service = require("../service");

db.connect = (callback) => {
	db.connection.authenticate()
.then(() => callback())
.catch((err) => callback(err));
};

module.exports = db;
