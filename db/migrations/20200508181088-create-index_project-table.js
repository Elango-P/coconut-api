exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating index_project table");

    // Defining whether the index_project table already exist or not.
    const indexProjectTableExists = await queryInterface.tableExists("index_project");

    // Condition for creating the index_project table only if the table doesn't exist already.
    if (!indexProjectTableExists) {
      await queryInterface.createTable("index_project", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        user: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        last_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        trello_board_list_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: false,
          defaultValue: 0.0,
        },
        allow_manual_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
          defaultValue: 0,
        },
        status_text: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        users: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        releases: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        sprints: {
          type: Sequelize.JSON,
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
        jira_auths: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        jira_auth_type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        delivery_date: {
          type: Sequelize.DATE,
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
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the index_project table already exist or not.
    const indexProjectTableExists = await queryInterface.tableExists("index_project");

    // Condition for dropping the index_project table only if the table exist already.
    if (indexProjectTableExists) {
      await queryInterface.dropTable("index_project");
    };
  } catch (err) {
    console.log(err);
  };
};
