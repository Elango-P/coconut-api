exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating custom form data table");

    // Defining whether the custom_form_value table already exist or not.
    const customFormDataTableExist = await queryInterface.tableExists("inspection");

    // Condition for creating the user_location table only if the table doesn't exist already.
    if (!customFormDataTableExist) {
      await queryInterface.createTable("inspection", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        
        store_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        owner_id: {
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
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the custom_form_value table already exist or not.
    const customFormDataTableExist = await queryInterface.tableExists("inspection");

    // Condition for dropping the user_location table only if the table exist already.
    if (customFormDataTableExist) {
      await queryInterface.dropTable("inspection");
    };
  } catch (err) {
    console.log(err);
  };
};
