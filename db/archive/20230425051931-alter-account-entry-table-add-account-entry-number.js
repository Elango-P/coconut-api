"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log("add column in account entry table");
      const tableDefinition = await queryInterface.describeTable("account_entry");

      if (tableDefinition && !tableDefinition["account_entry_number"]) {
        await queryInterface.addColumn("account_entry", "account_entry_number", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

      
    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("account_entry");

    if (tableDefinition && tableDefinition["account_entry_number"]) {
      await queryInterface.removeColumn("account_entry", "account_entry_number")
    }

  },
};
