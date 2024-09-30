exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating test_suite table");

    // Defining whether the test_suite table already exist or not.
    const testSuiteTableExists = await queryInterface.tableExists("test_suite");

    // Condition for creating the test_suite table only if the table doesn't exist already.
    if (!testSuiteTableExists) {
      await queryInterface.createTable("test_suite", {
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
        modules: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        features: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        types: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        condition: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        updated_by: {
          type: Sequelize.STRING,
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the test_suite table already exist or not.
    const testSuiteTableExists = await queryInterface.tableExists("test_suite");

    // Condition for dropping the test_suite table only if the table exist already.
    if (testSuiteTableExists) {
      await queryInterface.dropTable("test_suite");
    };
  } catch (err) {
    console.log(err);
  };
};
