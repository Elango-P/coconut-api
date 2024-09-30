exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating drive_file_category table");

    // Defining whether the drive_file_category table already exist or not.
    const driveFileCategoryTableExists = await queryInterface.tableExists("drive_file_category");

    // Condition for creating the drive_file_category table only if the table doesn't exist already.
    if (!driveFileCategoryTableExists) {
      await queryInterface.createTable("drive_file_category", {
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
    // Defining whether the drive_file_category table already exist or not.
    const driveFileCategoryTableExists = await queryInterface.tableExists("drive_file_category");

    // Condition for dropping the drive_file_category table only if the table exist already.
    if (driveFileCategoryTableExists) {
      await queryInterface.dropTable("drive_file_category");
    };
  } catch (err) {
    console.log(err);
  };
};
