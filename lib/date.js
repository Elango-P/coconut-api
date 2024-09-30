
const moment = require("moment");

class Date {

    static getTodayDate(date) {

        return moment(date).format("YYYY-MM-DD");
    }
}

module.exports = Date;