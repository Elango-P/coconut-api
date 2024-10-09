'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");
    if (tableDefinition && !tableDefinition["salary_attendance"]) {
      await queryInterface.addColumn("salary", "salary_attendance", {
          type: Sequelize.TEXT,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");
    if (tableDefinition && tableDefinition["salary_attendance"]) {
      await queryInterface.removeColumn("salary", "salary_attendance");
    }
  },
};
