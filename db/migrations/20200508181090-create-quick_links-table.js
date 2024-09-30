exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating quick_links table");

    // Defining whether the quick_links table already exist or not.
    const quickLinksTableExists = await queryInterface.tableExists("quick_links");

    // Condition for creating the quick_links table only if the table doesn't exist already.
    if (!quickLinksTableExists) {
      await queryInterface.createTable("quick_links", {
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
        role: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        is_main_url: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        show_current_user: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        status_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        group_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ticket_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        excluded_user: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        release_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: false,
          defaultValue: 0.0,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: true,
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
    // Defining whether the quick_links table already exist or not.
    const quickLinksTableExists = await queryInterface.tableExists("quick_links");

    // Condition for dropping the quick_links table only if the table exist already.
    if (quickLinksTableExists) {
      await queryInterface.dropTable("quick_links");
    };
  } catch (err) {
    console.log(err);
  };
};
