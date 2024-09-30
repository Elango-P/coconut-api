"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove primary_location_id
    await queryInterface.describeTable("user_employment").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["primary_location_id"]) {
        return queryInterface.removeColumn("user_employment", "primary_location_id");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove primary_shift_id
    await queryInterface.describeTable("user_employment").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["primary_shift_id"]) {
        return queryInterface.removeColumn("user_employment", "primary_shift_id");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_employment").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["secondary_location_id"]) {
        return queryInterface.removeColumn("user_employment", "secondary_location_id");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_employment").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["secondary_shift_id"]) {
        return queryInterface.removeColumn("user_employment", "secondary_shift_id");
      } else {
        return Promise.resolve(true);
      }
    });

  },
};
