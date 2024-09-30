'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering payment table - Removing purchase_id column");
      return queryInterface.describeTable("payment").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["purchase_id"]) {
          return queryInterface.removeColumn("payment", "purchase_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
