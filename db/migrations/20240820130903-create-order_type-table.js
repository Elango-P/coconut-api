"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating order_type table");

    // Defining whether the order_type table already exist or not.
    const OrderTypeExist = await queryInterface.tableExists("order_type");

    // Condition for creating the order_type table only if the table doesn't exist already.
    if (!OrderTypeExist) {
      await queryInterface.createTable("order_type", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        group: {
          type: Sequelize.INTEGER,
          allowNull: true
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
        company_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        show_customer_selection: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };

};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the order_type table already exist or not.
    const OrderTypeExist = await queryInterface.tableExists("order_type");

    // Condition for dropping the order_type table only if the table exist already.
    if (OrderTypeExist) {
      await queryInterface.dropTable("order_type");
    };
  } catch (err) {
    console.log(err);
  };
};
