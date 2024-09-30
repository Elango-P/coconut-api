exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating sprint table");

    // Defining whether the sprint table already exist or not.
    const sprintTableExists = await queryInterface.tableExists("sprint");

    // Condition for creating the sprint table only if the table doesn't exist already.
    if (!sprintTableExists) {
      await queryInterface.createTable("sprint", {
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
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the sprint table already exist or not.
    const sprintTableExists = await queryInterface.tableExists("sprint");

    // Condition for dropping the sprint table only if the table exist already.
    if (sprintTableExists) {
      await queryInterface.dropTable("sprint");
    };
  } catch (err) {
    console.log(err);
  };
};
