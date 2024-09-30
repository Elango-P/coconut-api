"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Changing allowNull in account_entry table");

      const tableDefinition = await queryInterface.describeTable("account_entry");

      if (tableDefinition && tableDefinition["payment_account"]) {
        await queryInterface.changeColumn("account_entry", "payment_account", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("account_entry", "date", {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["type"]) {
        await queryInterface.changeColumn("account_entry", "type", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["bank_description"]) {
        await queryInterface.changeColumn("account_entry", "bank_description", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["amount"]) {
        await queryInterface.changeColumn("account_entry", "amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["description"]) {
        await queryInterface.changeColumn("account_entry", "description", {
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

    if (tableDefinition && tableDefinition["payment_account"]) {
      await queryInterface.changeColumn("account_entry", "payment_account", {
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["date"]) {
      await queryInterface.changeColumn("account_entry", "date", {
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["type"]) {
      await queryInterface.changeColumn("account_entry", "type", {
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["bank_description"]) {
      await queryInterface.changeColumn("account_entry", "bank_description", {
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["amount"]) {
      await queryInterface.changeColumn("account_entry", "amount", {
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["description"]) {
      await queryInterface.changeColumn("account_entry", "description", {
        allowNull: true,
      });
    }
  },
};  
