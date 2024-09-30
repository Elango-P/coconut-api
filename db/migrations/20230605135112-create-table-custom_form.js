exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating custom_form table");

    // Defining whether the custom_form table already exist or not.
    const customFormTableExists = await queryInterface.tableExists("custom_form");

    // Condition for creating the custom_form table only if the table doesn't exist already.
    if (!customFormTableExists) {
      await queryInterface.createTable("custom_form", {
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
        label: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the custom_form table already exist or not.
    const customFormTableExists = await queryInterface.tableExists("custom_form");

    // Condition for dropping the custom_form table only if the table exist already.
    if (customFormTableExists) {
      await queryInterface.dropTable("custom_form");
    };
  } catch (err) {
    console.log(err);
  };
};
