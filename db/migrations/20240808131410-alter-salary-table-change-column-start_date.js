"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log(
        "Alter Table: Changing data type of start_date as start_date in salary table"
      );

      const tableDefinition = await queryInterface.describeTable("salary");

      if (tableDefinition && tableDefinition["start_date"]) {
        await queryInterface.changeColumn("salary", "start_date", {
          type: Sequelize.DATEONLY,
          allowNull: true,
        });
      }
      if (tableDefinition && tableDefinition["end_date"]) {
        await queryInterface.changeColumn("salary", "end_date", {
          type: Sequelize.DATEONLY,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && tableDefinition["start_date"]) {
      await queryInterface.changeColumn("salary", "start_date", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (tableDefinition && tableDefinition["end_date"]) {
      await queryInterface.changeColumn("salary", "end_date", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },
};
