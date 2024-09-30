'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering reimbursement_status table - Removing portal_id column");
      return queryInterface.describeTable("reimbursement_status").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("reimbursement_status", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
