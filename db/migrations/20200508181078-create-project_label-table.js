exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_label table");

    // Defining whether the project_label table already exist or not.
    const projectLabelTableExists = await queryInterface.tableExists("project_label");

    // Condition for creating the project_label table only if the table doesn't exist already.
    if (!projectLabelTableExists) {
      await queryInterface.createTable("project_label", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project_label table already exist or not.
    const projectLabelTableExists = await queryInterface.tableExists("project_label");

    // Condition for dropping the project_label table only if the table exist already.
    if (projectLabelTableExists) {
      await queryInterface.dropTable("project_label");
    };
  } catch (err) {
    console.log(err);
  };
};
