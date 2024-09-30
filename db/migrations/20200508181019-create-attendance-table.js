exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating attendance table");

    // Defining whether the attendance table already exist or not.
    const attendanceTableExists = await queryInterface.tableExists("attendance");

    // Condition for creating the attendance table only if the table doesn't exist already.
    if (!attendanceTableExists) {
      await queryInterface.createTable("attendance", {
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
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        login: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        logout: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        worked_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        not_worked_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        productive_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        non_productive_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        late_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        additional_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        late_hours_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        ip_address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        is_leave: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        leave_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        productive_cost: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        non_productive_cost: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        activity_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        lop_hours: {
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
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        store_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        shift_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        tracker_attendance_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        check_in_media_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        check_out_media_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the attendance table already exist or not.
    const attendanceTableExists = await queryInterface.tableExists("attendance");

    // Condition for dropping the attendance table only if the table exist already.
    if (attendanceTableExists) {
      await queryInterface.dropTable("attendance");
    };
  } catch (err) {
    console.log(err);
  };
};
