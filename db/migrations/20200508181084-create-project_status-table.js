exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_status table");

    // Defining whether the project_status table already exist or not.
    const projectStatusTableExists = await queryInterface.tableExists("project_status");

    // Condition for creating the project_status table only if the table doesn't exist already.
    if (!projectStatusTableExists) {
      await queryInterface.createTable("project_status", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_status_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        primary_assignee: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
    // Defining whether the project_status table already exist or not.
    const projectStatusTableExists = await queryInterface.tableExists("project_status");

    // Condition for dropping the project_status table only if the table exist already.
    if (projectStatusTableExists) {
      await queryInterface.dropTable("project_status");
    };
  } catch (err) {
    console.log(err);
  };
};
