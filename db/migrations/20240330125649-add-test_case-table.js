exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating test_case table");

    // Defining whether the reason table already exist or not.
    const tableExist = await queryInterface.tableExists("test_case");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!tableExist) {
      await queryInterface.createTable("test_case", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        test_scenario: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        test_steps: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        prerequisites: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        test_data: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        expected_result: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deletedAt: {
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
    // Defining whether the reason table already exist or not.
    const testCasesTableExist = await queryInterface.tableExists("test_case");

    // Condition for dropping the reason table only if the table exist already.
    if (testCasesTableExist) {
      await queryInterface.dropTable("test_case");
    };
  } catch (err) {
    console.log(err);
  };
};
