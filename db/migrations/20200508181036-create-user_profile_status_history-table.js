exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_profile_status_history table");

    // Defining whether the user_profile_status_history table already exist or not.
    const userProfileStatusHistoryTableExists = await queryInterface.tableExists("user_profile_status_history");

    // Condition for creating the user_profile_status_history table only if the table doesn't exist already.
    if (!userProfileStatusHistoryTableExists) {
      await queryInterface.createTable("user_profile_status_history", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user_profile_status_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
    // Defining whether the user_profile_status_history table already exist or not.
    const userProfileStatusHistoryTableExists = await queryInterface.tableExists("user_profile_status_history");

    // Condition for dropping the user_profile_status_history table only if the table exist already.
    if (userProfileStatusHistoryTableExists) {
      await queryInterface.dropTable("user_profile_status_history");
    };
  } catch (err) {
    console.log(err);
  };
};
