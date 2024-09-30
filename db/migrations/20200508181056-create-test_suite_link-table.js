exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating test_suite_link table");

    // Defining whether the test_suite_link table already exist or not.
    const testSuiteLinkTableExists = await queryInterface.tableExists("test_suite_link");

    // Condition for creating the test_suite_link table only if the table doesn't exist already.
    if (!testSuiteLinkTableExists) {
      await queryInterface.createTable("test_suite_link", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        test_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        suite_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the test_suite_link table already exist or not.
    const testSuiteLinkTableExists = await queryInterface.tableExists("test_suite_link");

    // Condition for dropping the test_suite_link table only if the table exist already.
    if (testSuiteLinkTableExists) {
      await queryInterface.dropTable("test_suite_link");
    };
  } catch (err) {
    console.log(err);
  };
};
