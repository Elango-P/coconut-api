exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating system_setting table");

    // Defining whether the system_setting table already exist or not.
    const systemSettingTableExists = await queryInterface.tableExists("system_setting");

    // Condition for creating the system_setting table only if the table doesn't exist already.
    if (!systemSettingTableExists) {
      await queryInterface.createTable("system_setting", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        value: {
          type: Sequelize.STRING,
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
    // Defining whether the system_setting table already exist or not.
    const systemSettingTableExists = await queryInterface.tableExists("system_setting");

    // Condition for dropping the system_setting table only if the table exist already.
    if (systemSettingTableExists) {
      await queryInterface.dropTable("system_setting");
    };
  } catch (err) {
    console.log(err);
  };
};
