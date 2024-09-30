"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating purchase_order_product table");

    // Defining whether the purchase_order_product table already exist or not.
    const purchaseOrderProductTableExists = await queryInterface.tableExists("purchase_order_product");

    // Condition for creating the purchase_order_product table only if the table doesn't exist already.
    if (!purchaseOrderProductTableExists) {
      await queryInterface.createTable("purchase_order_product", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        purchase_order_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        unit_price: {
          type: Sequelize.DECIMAL,
          allowNull: true
        },
        amount: {
          type: Sequelize.DECIMAL,
          allowNull: true
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false
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
    // Defining whether the purchase_order_product table already exist or not.
    const purchaseOrderProductTableExists = await queryInterface.tableExists("purchase_order_product");

    // Condition for dropping the purchase_order_product table only if the table exist already.
    if (purchaseOrderProductTableExists) {
      await queryInterface.dropTable("purchase_order_product");
    };
  } catch (err) {
    console.log(err);
  };
};
