exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating test_platforms table");

    // Defining whether the test_platforms table already exist or not.
    const testPlatformsTableExists = await queryInterface.tableExists("test_platforms");

    // Condition for creating the test_platforms table only if the table doesn't exist already.
    if (!testPlatformsTableExists) {
      await queryInterface.createTable("test_platforms", {
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
        sort: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: "timestamp",
        },
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the test_platforms table already exist or not.
    const testPlatformsTableExists = await queryInterface.tableExists("test_platforms");

    // Condition for dropping the test_platforms table only if the table exist already.
    if (testPlatformsTableExists) {
      await queryInterface.dropTable("test_platforms");
    };
  } catch (err) {
    console.log(err);
  };
};
