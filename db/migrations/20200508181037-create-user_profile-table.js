exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_profile table");

    // Defining whether the user_profile table already exist or not.
    const userProfileTableExists = await queryInterface.tableExists("user_profile");

    // Condition for creating the user_profile table only if the table doesn't exist already.
    if (!userProfileTableExists) {
      await queryInterface.createTable("user_profile", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        account_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        account_number: {
          type: Sequelize.STRING,
          allowNull: false,
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
    // Defining whether the user_profile table already exist or not.
    const userProfileTableExists = await queryInterface.tableExists("user_profile");

    // Condition for dropping the user_profile table only if the table exist already.
    if (userProfileTableExists) {
      await queryInterface.dropTable("user_profile");
    };
  } catch (err) {
    console.log(err);
  };
};
