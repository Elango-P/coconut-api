exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_preference table");

    // Defining whether the user_preference table already exist or not.
    const userPreferenceTableExists = await queryInterface.tableExists("user_preference");

    // Condition for creating the user_preference table only if the table doesn't exist already.
    if (!userPreferenceTableExists) {
      await queryInterface.createTable("user_preference", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        key: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        value: {
          type: Sequelize.TEXT,
          allowNull: true,
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
    // Defining whether the user_preference table already exist or not.
    const userPreferenceTableExists = await queryInterface.tableExists("user_preference");

    // Condition for dropping the user_preference table only if the table exist already.
    if (userPreferenceTableExists) {
      await queryInterface.dropTable("user_preference");
    };
  } catch (err) {
    console.log(err);
  };
};
