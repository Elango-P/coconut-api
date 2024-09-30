exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating state table");

    // Defining whether the state table already exist or not.
    const stateTableExists = await queryInterface.tableExists("state");

    // Condition for creating the state table only if the table doesn't exist already.
    if (!stateTableExists) {
      await queryInterface.createTable("state", {
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
        country_id: {
          type: Sequelize.INTEGER,
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
    // Defining whether the state table already exist or not.
    const stateTableExists = await queryInterface.tableExists("state");

    // Condition for dropping the state table only if the table exist already.
    if (stateTableExists) {
      await queryInterface.dropTable("state");
    };
  } catch (err) {
    console.log(err);
  };
};
