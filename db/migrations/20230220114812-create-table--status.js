"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating status table");

    // Defining whether the status table already exist or not.
    const purchaseOrderProductTableExists = await queryInterface.tableExists("status");

    // Condition for creating the status table only if the table doesn't exist already.
    if (!purchaseOrderProductTableExists) {
      await queryInterface.createTable("status", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        object_name:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        color_code:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        next_status_id:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort_order:{
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        allowed_role_id:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        createdAt: {
          allowNull: true,
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
        update_quantity: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        allow_edit: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        group: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        notify_to_owner: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        location_product_last_stock_entry_date_update: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
          update_product_price: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        default_reviewer: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        validate_amount: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        allow_to_view: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        update_account_product: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        update_quantity_in_location_product: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
        allow_refund: {
          type: Sequelize.INTEGER,
          allowNull: true 
        },
      });
    };
  } catch (err) {
    console.log(err);
  };

};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the status table already exist or not.
    const purchaseOrderProductTableExists = await queryInterface.tableExists("status");

    // Condition for dropping the status table only if the table exist already.
    if (purchaseOrderProductTableExists) {
      await queryInterface.dropTable("status");
    };
  } catch (err) {
    console.log(err);
  };
};
