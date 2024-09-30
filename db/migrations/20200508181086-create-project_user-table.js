exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating project_user table");

		// Defining whether the project_user table already exist or not.
		const projectUserTableExists = await queryInterface.tableExists("project_user");

		// Condition for creating the project_user table only if the table doesn't exist already.
		if (!projectUserTableExists) {
			await queryInterface.createTable("project_user", {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				project_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				jira_user: {
					type: Sequelize.STRING,
					allowNull: true
				},
				role: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				jira_auth: {
					type: Sequelize.STRING,
					allowNull: true
				},
				trello_auth: {
					type: Sequelize.STRING,
					allowNull: true
				},
				trello_user: {
					type: Sequelize.STRING,
					allowNull: true
				},
				primary_user: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				jira_auth_id: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				create_jira: {
					type: Sequelize.INTEGER,
					allowNull: true,
					defaultValue: 0
				},
				update_jira: {
					type: Sequelize.INTEGER,
					allowNull: true,
					defaultValue: 0
				},
				allow_to_view_others_tickets: {
					type: Sequelize.INTEGER,
					allowNull: true,
					defaultValue: 1
				},
				status: {
					type: Sequelize.BOOLEAN,
					allowNull: true,
					defaultValue: false
				},
				company_id : {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updated_at: {
					allowNull: true,
					type: Sequelize.DATE,
				},
				deleted_at: {
					allowNull: true,
					type: Sequelize.DATE,
				},
			});
		};
	} catch (err) {
		console.log(err);
	};
};

exports.down = async function down(queryInterface) {
	try {
		// Defining whether the project_user table already exist or not.
		const projectUserTableExists = await queryInterface.tableExists("project_user");
	
		// Condition for dropping the project_user table only if the table exist already.
		if (projectUserTableExists) {
		  await queryInterface.dropTable("project_user");
		};
	} catch (err) {
		console.log(err);
	};
};

