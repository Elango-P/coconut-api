exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating reimbursement_type table");

    // Defining whether the reimbursement_type table already exist or not.
    const reimbursementTypeTableExists = await queryInterface.tableExists("reimbursement_type");

    // Condition for creating the reimbursement_type table only if the table doesn't exist already.
    if (!reimbursementTypeTableExists) {
      await queryInterface.createTable("reimbursement_type", {
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
        amount: {
          type: Sequelize.TEXT,
          allowNull: true,
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
    // Defining whether the reimbursement_type table already exist or not.
    const reimbursementTypeTableExists = await queryInterface.tableExists("reimbursement_type");

    // Condition for dropping the reimbursement_type table only if the table exist already.
    if (reimbursementTypeTableExists) {
      await queryInterface.dropTable("reimbursement_type");
    };
  } catch (err) {
    console.log(err);
  };
};
