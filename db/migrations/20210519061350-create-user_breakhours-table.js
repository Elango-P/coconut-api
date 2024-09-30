exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating user_breakhours table");

		// Defining whether the user_breakhours table already exist or not.
		const userBreakhoursTableExists = await queryInterface.tableExists("user_breakhours");

		// Condition for creating the user_breakhours table only if the table doesn't exist already.
		if (!userBreakhoursTableExists) {
			await queryInterface.createTable("user_breakhours", {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				break_hour_start_time: {
					type: Sequelize.TIME,
					  allowNull: true,
				},
				break_hour_end_time: {
					type: Sequelize.TIME,
					  allowNull: true,
				},
				company_id : {
					type: Sequelize.INTEGER,
					allowNull: true
				},
			});
		};
	} catch (err) {
		console.log(err);
	};
};

exports.down = async function down(queryInterface) {
	try {
		// Defining whether the user_breakhours table already exist or not.
		const userBreakhoursTableExists = await queryInterface.tableExists("user_breakhours");
  
		// Condition for dropping the user_breakhours table only if the table exist already.
		if (userBreakhoursTableExists) {
		  await queryInterface.dropTable("user_breakhours");
		};
	} catch (err) {
		console.log(err);
	};
};