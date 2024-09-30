exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating location_user_allocation table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("location_user_allocation");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("location_user_allocation", {
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
       location_id : {
        type: Sequelize.INTEGER,
        allowNull: true,
       },
       shift_id : {
        type: Sequelize.INTEGER,
        allowNull: true,
       },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          allowNull: true,
          type: Sequelize.DATEONLY,
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
    const userDeviceTableExist = await queryInterface.tableExists("location_user_allocation");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("location_user_allocation");
    };
  } catch (err) {
    console.log(err);
  };
};
