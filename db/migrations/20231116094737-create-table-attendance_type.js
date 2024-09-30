exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating attendance_type table');

    // Defining whether the reason table already exist or not.
    const reasonIsExist = await queryInterface.tableExists('attendance_type');

    // Condition for creating the reason table only if the table doesn't exist already.
    if (!reasonIsExist) {
      await queryInterface.createTable('attendance_type', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        days_count: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
        cutoff_time: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        maximum_leave_allowed: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the reason table already exist or not.
    const userDeviceTableExist = await queryInterface.tableExists('attendance_type');

    // Condition for dropping the reason table only if the table exist already.
    if (userDeviceTableExist) {
      await queryInterface.dropTable('attendance_type');
    }
  } catch (err) {
    console.log(err);
  }
};
