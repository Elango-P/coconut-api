'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable(
          "recurring_activity"
      );

      if (tableDefinition && tableDefinition["summary"]) {
          await queryInterface.removeColumn("recurring_activity", "summary");
      }
  },
};


