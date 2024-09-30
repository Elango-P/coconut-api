exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating timesheet_detail table");

    // Defining whether the custom_form_value table already exist or not.
    const customFormFieldDataTableExist = await queryInterface.tableExists("timesheet_detail");

    // Condition for creating the timesheet_detail table only if the table doesn't exist already.
    if (!customFormFieldDataTableExist) {
      await queryInterface.createTable("timesheet_detail", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        timesheet_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        task: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        start_time: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        end_time: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        duration: {
          allowNull: true,
          type: Sequelize.DECIMAL,
        },
        status: {
          type: Sequelize.INTEGER,
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
    // Defining whether the timesheet_detail table already exist or not.
    const customFormFieldDataTableExist = await queryInterface.tableExists("timesheet_detail");

    // Condition for dropping the timesheet_detail table only if the table exist already.
    if (customFormFieldDataTableExist) {
      await queryInterface.dropTable("timesheet_detail");
    };
  } catch (err) {
    console.log(err);
  };
};
