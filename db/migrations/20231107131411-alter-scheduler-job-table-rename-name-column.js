"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering scheduler_job table - Renaming column name to job_name");
      return queryInterface.describeTable("scheduler_job").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["name"]) {
          return queryInterface.renameColumn("scheduler_job", "name", "job_name");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
