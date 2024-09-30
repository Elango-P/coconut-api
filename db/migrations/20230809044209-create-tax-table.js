exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating Tax table");

    // Defining whether the tax table already exist or not.
    const taxTableExists = await queryInterface.tableExists("tax");

    // Condition for creating the tax table only if the table doesn't exist already.
    if (!taxTableExists) {
      await queryInterface.createTable("tax", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        tax_type_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        amount: {
          type: Sequelize.NUMERIC,
          allowNull: true,
        },
        tax_percentage: {
          type: Sequelize.NUMERIC,
          allowNull: true,  
        },
        tax_amount: {
          type: Sequelize.NUMERIC,
          allowNull: true,
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
    // Defining whether the tax table already exist or not.
    const taxTableExists = await queryInterface.tableExists("tax");

    // Condition for dropping the tax table only if the table exist already.
    if (taxTableExists) {
      await queryInterface.dropTable("tax");
    };
  } catch (err) {
    console.log(err);
  };
};

