exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating app_version table");

    const taxTableExists = await queryInterface.tableExists("app_version");

    if (!taxTableExists) {
      await queryInterface.createTable("app_version", {
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
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        app_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
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
    const taxTableExists = await queryInterface.tableExists("app_version");

    if (taxTableExists) {
      await queryInterface.dropTable("app_version");
    };
  } catch (err) {
    console.log(err);
  };
};

