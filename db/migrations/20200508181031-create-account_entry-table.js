exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating account_entry table");

    // Defining whether the account_entry table already exist or not.
    const accountEntryTableExists = await queryInterface.tableExists("account_entry");

    // Condition for creating the account_entry table only if the table doesn't exist already.
    if (!accountEntryTableExists) {
      await queryInterface.createTable("account_entry", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
       
        bank_description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        amount: {
          type: Sequelize.NUMERIC,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        payment_account: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        bank_reference_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        category_tag_id: {
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
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        account_entry_number: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        bill_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        account: {
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
    // Defining whether the account_entry table already exist or not.
    const accountEntryTableExists = await queryInterface.tableExists("account_entry");

    // Condition for dropping the account_entry table only if the table exist already.
    if (accountEntryTableExists) {
      await queryInterface.dropTable("account_entry");
    };
  } catch (err) {
    console.log(err);
  };
};
