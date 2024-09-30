exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_severity table");

    // Defining whether the project_severity table already exist or not.
    const projectSeverityTableExists = await queryInterface.tableExists("project_severity");

    // Condition for creating the project_severity table only if the table doesn't exist already.
    if (!projectSeverityTableExists) {
      await queryInterface.createTable("project_severity", {
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
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        severity: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_severity_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_severity_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_severity_field: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
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
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project_severity table already exist or not.
    const projectSeverityTableExists = await queryInterface.tableExists("project_severity");

    // Condition for dropping the project_severity table only if the table exist already.
    if (projectSeverityTableExists) {
      await queryInterface.dropTable("project_severity");
    };
  } catch (err) {
    console.log(err);
  };
};
