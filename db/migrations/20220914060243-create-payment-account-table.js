exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating payment_account table");

    // Defining whether the account table already exist or not.
    const accountTableExists = await queryInterface.tableExists("payment_account");

    // Condition for creating the account table only if the table doesn't exist already.
    if (!accountTableExists) {
      await queryInterface.createTable("payment_account", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        payment_account_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        payment_account_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        payment_account_number: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ifsc: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        primary: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.INTEGER,
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
    // Defining whether the account table already exist or not.
    const accountTableExists = await queryInterface.tableExists("payment_account");

    // Condition for dropping the account table only if the table exist already.
    if (accountTableExists) {
      await queryInterface.dropTable("payment_account");
    };
  } catch (err) {
    console.log(err);
  };
};
