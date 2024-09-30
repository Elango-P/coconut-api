exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_salary table");

    // Defining whether the user_salary table already exist or not.
    const userSalaryTableExists = await queryInterface.tableExists("user_salary");

    // Condition for creating the user_salary table only if the table doesn't exist already.
    if (!userSalaryTableExists) {
      await queryInterface.createTable("user_salary", {
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
        ctc: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        house_rent_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        conveyance_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        medical_reimbursement: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        telephone_reimbursement: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        leave_travel_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        special_allowance: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        medical_insurance_premium: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        provident_fund_users: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        provident_fund_user: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        user_contribution: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        gratuity: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        annual_bonus: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
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
        deleted_at: {
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
    // Defining whether the user_salary table already exist or not.
    const userSalaryTableExists = await queryInterface.tableExists("user_salary");

    // Condition for dropping the user_salary table only if the table exist already.
    if (userSalaryTableExists) {
      await queryInterface.dropTable("user_salary");
    };
  } catch (err) {
    console.log(err);
  };
};
