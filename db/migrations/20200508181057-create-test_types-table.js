exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating test_types table");

    // Defining whether the test_types table already exist or not.
    const testTypesTableExists = await queryInterface.tableExists("test_types");

    // Condition for creating the test_types table only if the table doesn't exist already.
    if (!testTypesTableExists) {
      await queryInterface.createTable("test_types", {
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the test_types table already exist or not.
    const testTypesTableExists = await queryInterface.tableExists("test_types");

    // Condition for dropping the test_types table only if the table exist already.
    if (testTypesTableExists) {
      await queryInterface.dropTable("test_types");
    };
  } catch (err) {
    console.log(err);
  };
};
