exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_config table");

    // Defining whether the project_config table already exist or not.
    const projectConfigTableExists = await queryInterface.tableExists("project_config");

    // Condition for creating the project_config table only if the table doesn't exist already.
    if (!projectConfigTableExists) {
      await queryInterface.createTable("project_config", {
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
        key: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        value: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project_config table already exist or not.
    const projectConfigTableExists = await queryInterface.tableExists("project_config");

    // Condition for dropping the project_config table only if the table exist already.
    if (projectConfigTableExists) {
      await queryInterface.dropTable("project_config");
    };
  } catch (err) {
    console.log(err);
  };
};
