exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating custom_form_field table");

    // Defining whether the custom_form_field table already exist or not.
    const trainingTableExists = await queryInterface.tableExists("custom_field");

    // Condition for creating the custom_form_field table only if the table doesn't exist already.
    if (!trainingTableExists) {
      await queryInterface.createTable("custom_field", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        type_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort_order: {
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the custom_form_field table already exist or not.
    const trainingTableExists = await queryInterface.tableExists("custom_field");

    // Condition for dropping the custom_form_field table only if the table exist already.
    if (trainingTableExists) {
      await queryInterface.dropTable("custom_field");
    };
  } catch (err) {
    console.log(err);
  };
};
