exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_release table");

    // Defining whether the project_release table already exist or not.
    const projectReleaseTableExists = await queryInterface.tableExists("project_release");

    // Condition for creating the project_release table only if the table doesn't exist already.
    if (!projectReleaseTableExists) {
      await queryInterface.createTable("project_release", {
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
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        jira_sprint_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_version_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project_release table already exist or not.
    const projectReleaseTableExists = await queryInterface.tableExists("project_release");

    // Condition for dropping the project_release table only if the table exist already.
    if (projectReleaseTableExists) {
      await queryInterface.dropTable("project_release");
    };
  } catch (err) {
    console.log(err);
  };
};
