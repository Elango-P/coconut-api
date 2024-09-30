"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Company Table Add portal_url Column");
      const tableDefinition = await queryInterface.describeTable("company");
      if (tableDefinition && !tableDefinition["portal_url"]) {
        return queryInterface.addColumn("company", "portal_url", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("portal_url");

    if (tableDefinition && tableDefinition["portal_url"]) {
      return queryInterface.removeColumn("company", "portal_url");
    }
  },
};
