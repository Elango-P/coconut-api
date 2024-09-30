exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_priority table");

    // Defining whether the project_priority table already exist or not.
    const projectPriorityTableExists = await queryInterface.tableExists("project_priority");

    // Condition for creating the project_priority table only if the table doesn't exist already.
    if (!projectPriorityTableExists) {
      await queryInterface.createTable("project_priority", {
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
        jira_priority_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_priority_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
    // Defining whether the project_priority table already exist or not.
    const projectPriorityTableExists = await queryInterface.tableExists("project_priority");

    // Condition for dropping the project_priority table only if the table exist already.
    if (projectPriorityTableExists) {
      await queryInterface.dropTable("project_priority");
    };
  } catch (err) {
    console.log(err);
  };
};
