exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating holiday table");

    // Defining whether the holiday table already exist or not.
    const holidayTableExists = await queryInterface.tableExists("holiday");

    // Condition for creating the holiday table only if the table doesn't exist already.
    if (!holidayTableExists) {
      await queryInterface.createTable("holiday", {
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
        date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    // Defining whether the holiday table already exist or not.
    const holidayTableExists = await queryInterface.tableExists("holiday");

    // Condition for dropping the holiday table only if the table exist already.
    if (holidayTableExists) {
      await queryInterface.dropTable("holiday");
    };
  } catch (err) {
    console.log(err);
  };
};
