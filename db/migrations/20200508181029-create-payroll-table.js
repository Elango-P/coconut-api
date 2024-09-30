exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating payroll table");

    // Defining whether the payroll table already exist or not.
    const payrollTableExists = await queryInterface.tableExists("payroll");

    // Condition for creating the payroll table only if the table doesn't exist already.
    if (!payrollTableExists) {
      await queryInterface.createTable("payroll", {
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
        working_days: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        worked_days: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        additional_days: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        story_points: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        basic_salary: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        additional_days_bonus: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        loss_of_pay_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        loan_deduction: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        net_salary: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        gross_salary: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        pan_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        snacks: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        professional_tax: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        medical_allowance: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        performance_bonus: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        gratuity: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        hra: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tds: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        paid_leaves: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        unpaid_leaves: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        current_month_salary: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        conveyance_allowance: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        special_allowance: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        bank_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        bank_account_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        late_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        total_earning: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        total_deductions: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
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
    // Defining whether the payroll table already exist or not.
    const payrollTableExists = await queryInterface.tableExists("payroll");

    // Condition for dropping the payroll table only if the table exist already.
    if (payrollTableExists) {
      await queryInterface.dropTable("payroll");
    };
  } catch (err) {
    console.log(err);
  };
};
