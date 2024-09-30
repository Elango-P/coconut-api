exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating wiki_pages table");

    // Defining whether the wiki_pages table already exist or not.
    const wikiPagesTableExists = await queryInterface.tableExists("wiki_pages");

    // Condition for creating the wiki_pages table only if the table doesn't exist already.
    if (!wikiPagesTableExists) {
      await queryInterface.createTable("wiki_pages", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the wiki_pages table already exist or not.
    const wikiPagesTableExists = await queryInterface.tableExists("wiki_pages");

    // Condition for dropping the wiki_pages table only if the table exist already.
    if (wikiPagesTableExists) {
      await queryInterface.dropTable("wiki_pages");
    };
  } catch (err) {
    console.log(err);
  };
};
