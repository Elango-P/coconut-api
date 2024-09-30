
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating visitor table");

    // Defining whether the visitor table already exist or not.
    const activityTypeTableExists = await queryInterface.tableExists("visitor");

    // Condition for creating the visitor table only if the table doesn't exist already.
    if (!activityTypeTableExists) {
      await queryInterface.createTable("visitor", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull:false,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull:false,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        purpose: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        media_id: {
          type: Sequelize.INTEGER,
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
    // Defining whether the visitor table already exist or not.
    const activityTypeTableExists = await queryInterface.tableExists("visitor");

    // Condition for dropping the visitor table only if the table exist already.
    if (activityTypeTableExists) {
      await queryInterface.dropTable("visitor");
    };
  } catch (err) {
    console.log(err);
  };
};
