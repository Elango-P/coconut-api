exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating bank_settlement table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("bank_settlement");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("bank_settlement", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
      
        date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        amount: {
          type: Sequelize.DECIMAL,
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
    const userDeviceTableExist = await queryInterface.tableExists("bank_settlement");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("bank_settlement");
    };
  } catch (err) {
    console.log(err);
  };
};
