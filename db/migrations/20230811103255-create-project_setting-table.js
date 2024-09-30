exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating custom form data table");

    // Defining whether the custom_form_value table already exist or not.
    const projectSettingTableExist = await queryInterface.tableExists("project_setting");

    // Condition for creating the user_location table only if the table doesn"t exist already.
    if (!projectSettingTableExist) {
      await queryInterface.createTable("project_setting", {
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
        value: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: true,
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
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the custom_form_value table already exist or not.
    const projectSettingTableExist = await queryInterface.tableExists("project_setting");

    // Condition for dropping the user_location table only if the table exist already.
    if (projectSettingTableExist) {
      await queryInterface.dropTable("project_setting");
    }
  } catch (err) {
    console.log(err);
  }
};
