exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating loyalty_category table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("loyalty_category");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("loyalty_category", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
       status : {
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
    const userDeviceTableExist = await queryInterface.tableExists("loyalty_category");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("loyalty_category");
    };
  } catch (err) {
    console.log(err);
  };
};
