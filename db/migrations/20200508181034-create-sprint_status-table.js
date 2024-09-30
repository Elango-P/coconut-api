exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating sprint_status table");

    // Defining whether the sprint_status table already exist or not.
    const sprintStatusTableExists = await queryInterface.tableExists("sprint_status");

    // Condition for creating the sprint_status table only if the table doesn't exist already.
    if (!sprintStatusTableExists) {
      await queryInterface.createTable("sprint_status", {
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
        }
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the sprint_status table already exist or not.
    const sprintStatusTableExists = await queryInterface.tableExists("sprint_status");

    // Condition for dropping the sprint_status table only if the table exist already.
    if (sprintStatusTableExists) {
      await queryInterface.dropTable("sprint_status");
    };
  } catch (err) {
    console.log(err);
  };
};
