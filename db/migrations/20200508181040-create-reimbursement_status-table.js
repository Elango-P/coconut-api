exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating reimbursement_status table");

    // Defining whether the reimbursement_status table already exist or not.
    const reimbursementStatusTableExists = await queryInterface.tableExists("reimbursement_status");

    // Condition for creating the reimbursement_status table only if the table doesn't exist already.
    if (!reimbursementStatusTableExists) {
      await queryInterface.createTable("reimbursement_status", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.TEXT,
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the reimbursement_status table already exist or not.
    const reimbursementStatusTableExists = await queryInterface.tableExists("reimbursement_status");

    // Condition for dropping the reimbursement_status table only if the table exist already.
    if (reimbursementStatusTableExists) {
      await queryInterface.dropTable("reimbursement_status");
    };
  } catch (err) {
    console.log(err);
  };
};
