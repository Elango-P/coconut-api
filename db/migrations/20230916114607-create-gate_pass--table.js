exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating gate_pass table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("gate_pass");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("gate_pass", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        notes: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        owner_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        media_id: {
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
    const userDeviceTableExist = await queryInterface.tableExists("gate_pass");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("gate_pass");
    };
  } catch (err) {
    console.log(err);
  };
};
