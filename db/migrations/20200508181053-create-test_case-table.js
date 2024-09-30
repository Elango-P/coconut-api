exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating test_case table");

    // Defining whether the test_case table already exist or not.
    const testCaseTableExists = await queryInterface.tableExists("test_case");

    // Condition for creating the test_case table only if the table doesn't exist already.
    if (!testCaseTableExists) {
      await queryInterface.createTable("test_case", {
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
        summary: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        module: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        feature: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        priority: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        labels: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        automation_test_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        test_steps: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
    // Defining whether the test_case table already exist or not.
    const testCaseTableExists = await queryInterface.tableExists("test_case");

    // Condition for dropping the test_case table only if the table exist already.
    if (testCaseTableExists) {
      await queryInterface.dropTable("test_case");
    };
  } catch (err) {
    console.log(err);
  };
};
