exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating account_category table");

    // Defining whether the account_category table already exist or not.
    const accountCategoryTableExists = await queryInterface.tableExists("account_category");

    // Condition for creating the account_category table only if the table doesn't exist already.
    if (!accountCategoryTableExists) {
      await queryInterface.createTable("account_category", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    // Defining whether the account_category table already exist or not.
    const accountCategoryTableExists = await queryInterface.tableExists("account_category");

    // Condition for dropping the account_category table only if the table exist already.
    if (accountCategoryTableExists) {
      await queryInterface.dropTable("account_category");
    };
  } catch (err) {
    console.log(err);
  };
};
