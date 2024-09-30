exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_sprint table");

    // Defining whether the project_sprint table already exist or not.
    const projectSprintTableExists = await queryInterface.tableExists("project_sprint");

    // Condition for creating the project_sprint table only if the table doesn't exist already.
    if (!projectSprintTableExists) {
      await queryInterface.createTable("project_sprint", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        jira_sprint_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_version_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
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
    // Defining whether the project_sprint table already exist or not.
    const projectSprintTableExists = await queryInterface.tableExists("project_sprint");

    // Condition for dropping the project_sprint table only if the table exist already.
    if (projectSprintTableExists) {
      await queryInterface.dropTable("project_sprint");
    };
  } catch (err) {
    console.log(err);
  };
};
