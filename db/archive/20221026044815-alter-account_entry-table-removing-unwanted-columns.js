'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_entry table - Removing category_id column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_entry");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["category_id"]) {
        await queryInterface.removeColumn("account_entry", "category_id");
      }
      if (tableDefinition && tableDefinition["category_name"]) {
        await queryInterface.removeColumn("account_entry", "category_name");
      }
      if (tableDefinition && tableDefinition["payee_name"]) {
        await queryInterface.removeColumn("account_entry", "payee_name");
      }
      if (tableDefinition && tableDefinition["mode_of_payment"]) {
        await queryInterface.removeColumn("account_entry", "mode_of_payment");
      }
      if (tableDefinition && tableDefinition["payable_amount"]) {
        await queryInterface.removeColumn("account_entry", "payable_amount");
      }
      if (tableDefinition && tableDefinition["attachments"]) {
        await queryInterface.removeColumn("account_entry", "attachments");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_entry");
      
      // Condition for adding the category_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["category_id"]) {
        await queryInterface.addColumn("account_entry", "category_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition && !tableDefinition["category_name"]) {
        await queryInterface.addColumn("account_entry", "category_name", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition && !tableDefinition["payee_name"]) {
        await queryInterface.addColumn("account_entry", "payee_name", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition && !tableDefinition["mode_of_payment"]) {
        await queryInterface.addColumn("account_entry", "mode_of_payment", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition && !tableDefinition["payable_amount"]) {
        await queryInterface.addColumn("account_entry", "payable_amount", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition && !tableDefinition["attachments"]) {
        await queryInterface.addColumn("account_entry", "attachments", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};
