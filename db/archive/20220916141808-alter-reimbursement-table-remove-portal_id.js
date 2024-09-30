'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering reimbursement table - Removing portal_id column");
      return queryInterface.describeTable("reimbursement").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("reimbursement", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
