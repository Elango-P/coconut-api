exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating location_sales_goal table");

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists("location_sales_goal");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable("location_sales_goal", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
      
        location_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        shift_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        amount :{
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
    const userDeviceTableExist = await queryInterface.tableExists("location_sales_goal");

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable("location_sales_goal");
    };
  } catch (err) {
    console.log(err);
  };
};
