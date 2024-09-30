exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating role_permission table");

    // Defining whether the role_permission table already exist or not.
    const rolePermissionTableExists = await queryInterface.tableExists("role_permission");

    // Condition for creating the role_permission table only if the table doesn't exist already.
    if (!rolePermissionTableExists) {
      await queryInterface.createTable("role_permission", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        permission_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
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
    // Defining whether the role_permission table already exist or not.
    const rolePermissionTableExists = await queryInterface.tableExists("role_permission");

    // Condition for dropping the role_permission table only if the table exist already.
    if (rolePermissionTableExists) {
      await queryInterface.dropTable("role_permission");
    };
  } catch (err) {
    console.log(err);
  };
};
