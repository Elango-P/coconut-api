exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_device_info table");

    // Defining whether the user_device_info table already exist or not.
    const userDeviceTableExist = await queryInterface.tableExists("user_device_info");

    // Condition for creating the user_device_info table only if the table doesn't exist already.
    if (!userDeviceTableExist) {
      await queryInterface.createTable("user_device_info", {
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
        ip_address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        device_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        brand_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        battery_percentage: {
          type: Sequelize.INTEGER, 
          allowNull: true
        },
        network_connection: {
          type: Sequelize.BOOLEAN,
          allowNull: true
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
        version_number: {
          allowNull:true,
          type: Sequelize.STRING
        },
        status: {
          allowNull:true,
          type: Sequelize.INTEGER
        },
        status: {
          allowNull:true,
          type: Sequelize.INTEGER
        },
        unique_id: {
          allowNull:true,
          type: Sequelize.STRING
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the user_device_info table already exist or not.
    const userDeviceTableExist = await queryInterface.tableExists("user_device_info");

    // Condition for dropping the user_device_info table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("user_device_info");
    };
  } catch (err) {
    console.log(err);
  };
};
