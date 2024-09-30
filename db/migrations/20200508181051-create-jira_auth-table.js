exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating jira_auth table");

    // Defining whether the jira_auth table already exist or not.
    const jiraAuthTableExists = await queryInterface.tableExists("jira_auth");

    // Condition for creating the jira_auth table only if the table doesn't exist already.
    if (!jiraAuthTableExists) {
      await queryInterface.createTable("jira_auth", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        jira_account_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_user_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        jira_display_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        api_token: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the jira_auth table already exist or not.
    const jiraAuthTableExists = await queryInterface.tableExists("jira_auth");

    // Condition for dropping the jira_auth table only if the table exist already.
    if (jiraAuthTableExists) {
      await queryInterface.dropTable("jira_auth");
    };
  } catch (err) {
    console.log(err);
  };
};
