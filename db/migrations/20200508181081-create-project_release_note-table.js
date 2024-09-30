exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_release_note table");

    // Defining whether the project_release_note table already exist or not.
    const projectReleaseNoteTableExists = await queryInterface.tableExists("project_release_note");

    // Condition for creating the project_release_note table only if the table doesn't exist already.
    if (!projectReleaseNoteTableExists) {
      await queryInterface.createTable("project_release_note", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        release_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project_release_note table already exist or not.
    const projectReleaseNoteTableExists = await queryInterface.tableExists("project_release_note");

    // Condition for dropping the project_release_note table only if the table exist already.
    if (projectReleaseNoteTableExists) {
      await queryInterface.dropTable("project_release_note");
    };
  } catch (err) {
    console.log(err);
  };
};
