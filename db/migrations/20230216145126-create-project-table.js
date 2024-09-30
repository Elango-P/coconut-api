exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project table");

    // Defining whether the project table already exist or not.
    const projectTableExists = await queryInterface.tableExists("project");

    // Condition for creating the project table only if the table doesn't exist already.
    if (!projectTableExists) {
      await queryInterface.createTable("project", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        last_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        allow_manual_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        component: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        repository: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_host: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_project_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_board_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        update_jira: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status_text: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        trello_board_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        slack_webhook_key: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        trello_board_list_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_auth_type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
        last_ticket_number: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project table already exist or not.
    const projectTableExists = await queryInterface.tableExists("project");

    // Condition for dropping the project table only if the table exist already.
    if (projectTableExists) {
      await queryInterface.dropTable("project");
    };
  } catch (err) {
    console.log(err);
  };
};
