
const Sequelize = require("sequelize");

const config = require("../lib/config");

class MySqlDB {
    static Connect() {
        const db = new Object();
        db.connection = new Sequelize(config.tracker_db_database, config.tracker_db_user, config.tracker_db_password, {
            host: config.tracker_db_host,
            port: 5432,
            dialect: "postgres",
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            dialectOptions: {
                require:false,
                ssl: false,  // Disable SSL
            },
        });

        db.connect = (callback) => {
            db.connection.authenticate()
                .then(() => callback())
                .catch((err) => callback(err));
        };

        return db;
    }
}

module.exports = MySqlDB;