"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding description to account_entry table");

      const tableDefinition = await queryInterface.describeTable(
        "account_entry"
      );

      console.log("Alter Table: Adding description to account_entry table");

      if (tableDefinition && !tableDefinition["description"]) {
        await queryInterface.addColumn("account_entry", "description", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      console.log("Alter Table: Adding bank_description to account_entry table");

      if (tableDefinition && !tableDefinition["bank_description"]) {
        await queryInterface.addColumn("account_entry", "bank_description", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      console.log("Alter Table: Adding bank to account_entry table");

      if (tableDefinition && !tableDefinition["bank"]) {
        await queryInterface.addColumn("account_entry", "bank", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      console.log("Alter Table: Adding amount to account_entry table");

      if (tableDefinition && !tableDefinition["amount"]) {
        await queryInterface.addColumn("account_entry", "amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
        });
      }

      console.log("Alter Table: Adding status to account_entry table");

      if (tableDefinition && !tableDefinition["status"]) {
        await queryInterface.addColumn("account_entry", "status", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");

    if (tableDefinition && tableDefinition["description"]) {
      await queryInterface.removeColumn("account_entry", "description");
    }
    if (tableDefinition && tableDefinition["bank_description"]) {
      await queryInterface.removeColumn("account_entry", "bank_description");
    }
    if (tableDefinition && tableDefinition["bank"]) {
      await queryInterface.removeColumn("account_entry", "bank");
    }
    if (tableDefinition && tableDefinition["amount"]) {
      await queryInterface.removeColumn("account_entry", "amount");
    }
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("account_entry", "status");
    }
  },
};
