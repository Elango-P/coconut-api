exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating drive table");

    // Defining whether the drive table already exist or not.
    const driveTableExists = await queryInterface.tableExists("drive");

    // Condition for creating the drive table only if the table doesn't exist already.
    if (!driveTableExists) {
      await queryInterface.createTable("drive", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        owner_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        title: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        media_name: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        updated_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    // Defining whether the drive table already exist or not.
    const driveTableExists = await queryInterface.tableExists("drive");

    // Condition for dropping the drive table only if the table exist already.
    if (driveTableExists) {
      await queryInterface.dropTable("drive");
    };
  } catch (err) {
    console.log(err);
  };
};
