exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating message_channel_user table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("message_channel_user");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("message_channel_user", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        channel_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
    const userDeviceTableExist = await queryInterface.tableExists("message_channel_user");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("message_channel_user");
    };
  } catch (err) {
    console.log(err);
  };
};
