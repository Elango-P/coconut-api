exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating product price table");

    // Defining whether the project table already exist or not.
    const projectTableExists = await queryInterface.tableExists("product_price");

    // Condition for creating the project table only if the table doesn't exist already.
    if (!projectTableExists) {
      await queryInterface.createTable("product_price", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        cost_price: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        sale_price: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        mrp: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        barcode: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        is_default: {
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
        date: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        discount_percentage:{
          type: Sequelize.DECIMAL,
          allowNull: true,
      },
      margin_percentage:{
        type: Sequelize.DECIMAL,
        allowNull: true,
    },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the project table already exist or not.
    const projectTableExists = await queryInterface.tableExists("product_price");

    // Condition for dropping the project table only if the table exist already.
    if (projectTableExists) {
      await queryInterface.dropTable("product_price");
    };
  } catch (err) {
    console.log(err);
  };
};
