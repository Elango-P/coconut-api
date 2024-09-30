exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating late_hours_status table");

    // Defining whether the late_hours_status table already exist or not.
    const lateHoursStatusTableExists = await queryInterface.tableExists("late_hours_status");

    // Condition for creating the late_hours_status table only if the table doesn't exist already.
    if (!lateHoursStatusTableExists) {
      await queryInterface.createTable("late_hours_status", {
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
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the late_hours_status table already exist or not.
    const lateHoursStatusTableExists = await queryInterface.tableExists("late_hours_status");

    // Condition for dropping the late_hours_status table only if the table exist already.
    if (lateHoursStatusTableExists) {
      await queryInterface.dropTable("late_hours_status");
    };
  } catch (err) {
    console.log(err);
  };
};
