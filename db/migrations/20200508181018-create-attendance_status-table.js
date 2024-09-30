exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating attendance_status table");

    // Defining whether the attendance_status table already exist or not.
    const attendanceStatusTableExists = await queryInterface.tableExists("attendance_status");

    // Condition for creating the attendance_status table only if the table doesn't exist already.
    if (!attendanceStatusTableExists) {
      await queryInterface.createTable("attendance_status", {
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
    // Defining whether the attendance_status table already exist or not.
    const attendanceStatusTableExists = await queryInterface.tableExists("attendance_status");

    // Condition for dropping the attendance_status table only if the table exist already.
    if (attendanceStatusTableExists) {
      await queryInterface.dropTable("attendance_status");
    };
  } catch (err) {
    console.log(err);
  };
};
