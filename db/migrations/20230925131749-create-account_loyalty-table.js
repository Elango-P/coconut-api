exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating account_loyalty table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("account_loyalty");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("account_loyalty", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
       account_id : {
        type: Sequelize.INTEGER,
        allowNull: true,
       },
       points : {
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
    const userDeviceTableExist = await queryInterface.tableExists("account_loyalty");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("account_loyalty");
    };
  } catch (err) {
    console.log(err);
  };
};
