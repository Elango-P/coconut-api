exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_build table");

    // Defining whether the project_build table already exist or not.
    const projectBuildTableExists = await queryInterface.tableExists("project_build");

    // Condition for creating the project_build table only if the table doesn't exist already.
    if (!projectBuildTableExists) {
      await queryInterface.createTable("project_build", {
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
        environment_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
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
    // Defining whether the project_build table already exist or not.
    const projectBuildTableExists = await queryInterface.tableExists("project_build");

    // Condition for dropping the project_build table only if the table exist already.
    if (projectBuildTableExists) {
      await queryInterface.dropTable("project_build");
    };
  } catch (err) {
    console.log(err);
  };
};