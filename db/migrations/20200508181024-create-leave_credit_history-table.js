exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating leave_credit_history table");

    // Defining whether the leave_credit_history table already exist or not.
    const leaveCreditHistoryTableExists = await queryInterface.tableExists("leave_credit_history");

    // Condition for creating the leave_credit_history table only if the table doesn't exist already.
    if (!leaveCreditHistoryTableExists) {
      await queryInterface.createTable("leave_credit_history", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        month: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        number_of_days: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull:false,
        },
        created_at: {
          allowNull: false,
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
    // Defining whether the leave_credit_history table already exist or not.
    const leaveCreditHistoryTableExists = await queryInterface.tableExists("leave_credit_history");

    // Condition for dropping the leave_credit_history table only if the table exist already.
    if (leaveCreditHistoryTableExists) {
      await queryInterface.dropTable("leave_credit_history");
    };
  } catch (err) {
    console.log(err);
  };
};
