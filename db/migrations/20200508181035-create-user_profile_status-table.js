exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_profile_status table");

    // Defining whether the user_profile_status table already exist or not.
    const userProfileStatusTableExists = await queryInterface.tableExists("user_profile_status");

    // Condition for creating the user_profile_status table only if the table doesn't exist already.
    if (!userProfileStatusTableExists) {
      await queryInterface.createTable("user_profile_status", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        status_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        profile_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the user_profile_status table already exist or not.
    const userProfileStatusTableExists = await queryInterface.tableExists("user_profile_status");

    // Condition for dropping the user_profile_status table only if the table exist already.
    if (userProfileStatusTableExists) {
      await queryInterface.dropTable("user_profile_status");
    };
  } catch (err) {
    console.log(err);
  };
};
