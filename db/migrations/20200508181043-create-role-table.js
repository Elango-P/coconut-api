exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating role table");

		// Defining whether the role table already exist or not.
		const roleTableExists = await queryInterface.tableExists("role");

		// Condition for creating the role table only if the table doesn't exist already.
		if (!roleTableExists) {
			await queryInterface.createTable("role", {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				name: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				company_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
			});
		};
	} catch(err) {
		console.log(err);
	};
};

exports.down = async function down(queryInterface) {
	try {
		// Defining whether the role table already exist or not.
		const roleTableExists = await queryInterface.tableExists("role");
	
		// Condition for dropping the role table only if the table exist already.
		if (roleTableExists) {
		  await queryInterface.dropTable("role");
		};
	} catch (err) {
		console.log(err);
	};
};
