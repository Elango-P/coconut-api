'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    const columnNamesToCheck = ["gst_amount", "cash_discount_amount", "other_deduction_amount"];

    for (const columnName of columnNamesToCheck) {
      if (tableDefinition && !tableDefinition[columnName]) {
        await queryInterface.addColumn("bill", columnName, {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    const columnNamesToRemove = ["gst_amount", "cash_discount_amount", "other_deduction_amount"];

    for (const columnName of columnNamesToRemove) {
      if (tableDefinition && tableDefinition[columnName]) {
        await queryInterface.removeColumn("bill", columnName);
      }
    }
  },
};
