exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating timesheet table");

    // Defining whether the custom_form_value table already exist or not.
    const customFormFieldDataTableExist = await queryInterface.tableExists("timesheet");

    // Condition for creating the timesheet table only if the table doesn't exist already.
    if (!customFormFieldDataTableExist) {
      await queryInterface.createTable("timesheet", {
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
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        date: {
          allowNull: true,
          type: Sequelize.DATEONLY,
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
        timesheet_number: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        total_hours: {
          type: Sequelize.DECIMAL,
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
    // Defining whether the timesheet table already exist or not.
    const customFormFieldDataTableExist = await queryInterface.tableExists("timesheet");

    // Condition for dropping the timesheet table only if the table exist already.
    if (customFormFieldDataTableExist) {
      await queryInterface.dropTable("timesheet");
    };
  } catch (err) {
    console.log(err);
  };
};
