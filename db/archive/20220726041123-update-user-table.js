'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && !tableDefinition["portal_id"]) {
        queryInterface.addColumn("user", "portal_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    }
  } catch (err) {
    console.log(err);
  }
  },

  down: async(queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["portal_id"]) {
      queryInterface.removeColumn("user", "portal_id");
  }
  }
};
