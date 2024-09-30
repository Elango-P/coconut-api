"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable(
        "tag"
      );
      if (tableDefinition && tableDefinition["status"]) {
        return queryInterface.changeColumn(
          "tag",
          "status",
          {
            type: 'INTEGER USING CAST("status" as INTEGER)',
            allowNull: true,
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      "tag",
      "status",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  },
};