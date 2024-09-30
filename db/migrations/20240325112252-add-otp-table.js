exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating otp table");

    // Defining whether the reason table already exist or not.
    const tableExist = await queryInterface.tableExists("otp");

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!tableExist) {
      await queryInterface.createTable("otp", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        type: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        code: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        used_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        expired_at: {
          type: Sequelize.DATE,
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
    const otpTableExist = await queryInterface.tableExists("otp");

    // Condition for dropping the reason table only if the table exist already.
    if (otpTableExist) {
      await queryInterface.dropTable("otp");
    };
  } catch (err) {
    console.log(err);
  };
};
