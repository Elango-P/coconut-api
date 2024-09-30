exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating lead table");

    // Defining whether the lead table already exist or not.
    const taxTableExists = await queryInterface.tableExists("lead");

    // Condition for creating the lead table only if the table doesn't exist already.
    if (!taxTableExists) {
      await queryInterface.createTable("lead", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
          mobile: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        notes: {
          type: Sequelize.STRING,
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
    // Defining whether the lead table already exist or not.
    const taxTableExists = await queryInterface.tableExists("lead");

    // Condition for dropping the lead table only if the table exist already.
    if (taxTableExists) {
      await queryInterface.dropTable("lead");
    };
  } catch (err) {
    console.log(err);
  };
};

