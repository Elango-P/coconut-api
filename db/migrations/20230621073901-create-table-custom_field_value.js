exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating custom form field data table");

    // Defining whether the custom_form_value table already exist or not.
    const customFormFieldDataTableExist = await queryInterface.tableExists("custom_field_value");

    // Condition for creating the custom_field_value table only if the table doesn't exist already.
    if (!customFormFieldDataTableExist) {
      await queryInterface.createTable("custom_field_value", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        custom_field_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      
        value: {
          type: Sequelize.STRING,
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
    // Defining whether the custom_field_value table already exist or not.
    const customFormFieldDataTableExist = await queryInterface.tableExists("custom_field_value");

    // Condition for dropping the custom_field_value table only if the table exist already.
    if (customFormFieldDataTableExist) {
      await queryInterface.dropTable("custom_field_value");
    };
  } catch (err) {
    console.log(err);
  };
};
