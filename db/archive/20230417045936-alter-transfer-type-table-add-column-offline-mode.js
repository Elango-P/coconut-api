"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log("add column in transfer type table");
      const tableDefinition = await queryInterface.describeTable("transfer_type");

      if (tableDefinition && !tableDefinition["offline_mode"]) {
        await queryInterface.addColumn("transfer_type", "offline_mode", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("transfer_type");

    if (tableDefinition && tableDefinition["offline_mode"]) {
      await queryInterface.removeColumn("transfer_type", "offline_mode")
    }

  },
};
