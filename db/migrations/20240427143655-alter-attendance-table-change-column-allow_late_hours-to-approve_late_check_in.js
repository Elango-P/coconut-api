"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering attendance table - Renaming column allow_late_hours to approve_late_check_in");
      return queryInterface.describeTable("attendance").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["allow_late_hours"]) {
          return queryInterface.renameColumn("attendance", "allow_late_hours", "approve_late_check_in");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
