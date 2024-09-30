exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating reimbursement table");

    // Defining whether the reimbursement table already exist or not.
    const reimbursementTableExists = await queryInterface.tableExists("reimbursement");

    // Condition for creating the reimbursement table only if the table doesn't exist already.
    if (!reimbursementTableExists) {
      await queryInterface.createTable("reimbursement", {
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
        amount: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        notes: {
          type: Sequelize.TEXT,
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
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the reimbursement table already exist or not.
    const reimbursementTableExists = await queryInterface.tableExists("reimbursement");

    // Condition for dropping the reimbursement table only if the table exist already.
    if (reimbursementTableExists) {
      await queryInterface.dropTable("reimbursement");
    };
  } catch (err) {
    console.log(err);
  };
};
