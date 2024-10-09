exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating salary table");

    // Defining whether the salary table already exist or not.
    const salaryTableExists = await queryInterface.tableExists("salary");

    // Condition for creating the salary table only if the table doesn't exist already.
    if (!salaryTableExists) {
      await queryInterface.createTable("salary", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        bank_account_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        average_story_points: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        basic: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        night_shift_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        lunch_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        house_rent_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        travel_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        login_time: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        bonus: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        salary_per_day: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        tds: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        provident_fund: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        other_deductions: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        lop: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        additional_day_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        salary_number: {
					type: Sequelize.INTEGER,
					allowNull: true
				}
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the salary table already exist or not.
    const salaryTableExists = await queryInterface.tableExists("salary");

    // Condition for dropping the salary table only if the table exist already.
    if (salaryTableExists) {
      await queryInterface.dropTable("salary");
    };
  } catch (err) {
    console.log(err);
  };
};
