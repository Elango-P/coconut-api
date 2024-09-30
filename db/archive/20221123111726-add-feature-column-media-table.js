'use strict';

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");
    if (tableDefinition && !tableDefinition["feature"]) {
      await queryInterface.addColumn("media", "feature", {
        type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");
    if (tableDefinition && tableDefinition["feature"]) {
      await queryInterface.removeColumn("media", "feature");
    }
  },
};
