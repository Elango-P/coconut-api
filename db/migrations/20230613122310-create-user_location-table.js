exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_location table");

    // Defining whether the user_location table already exist or not.
    const userLocationTableExist = await queryInterface.tableExists("user_location");

    // Condition for creating the user_location table only if the table doesn't exist already.
    if (!userLocationTableExist) {
      await queryInterface.createTable("user_location", {
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
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        latitude: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        longitude: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        created_at: {
          allowNull: true,
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the user_location table already exist or not.
    const userLocationTableExist = await queryInterface.tableExists("user_location");

    // Condition for dropping the user_location table only if the table exist already.
    if (userLocationTableExist) {
      await queryInterface.dropTable("user_location");
    };
  } catch (err) {
    console.log(err);
  };
};
