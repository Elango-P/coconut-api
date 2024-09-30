const utils = require("../../lib/utils");

function processHolidays(result) {
	const holidays = result.get();

	const data = {
		id: holidays.id,
		name: holidays.name,
		date: utils.formatDate(holidays.date),
		formattedDate: utils.formatDate(holidays.date, "DD MMM, Y"),
		type: holidays.type,
		day: utils.getDay(holidays.date),
		createdAt: holidays.created_at
	};

	return data;
}

module.exports = processHolidays;
