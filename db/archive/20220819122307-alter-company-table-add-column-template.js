"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Company Table Add template Column");
      const tableDefinition = await queryInterface.describeTable("company");
      if (tableDefinition && !tableDefinition["template"]) {
        return queryInterface.addColumn("company", "template", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("company");

    if (tableDefinition && tableDefinition["template"]) {
      return queryInterface.removeColumn("company", "template");
    }
  },
};
