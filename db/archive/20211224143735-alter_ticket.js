/* eslint-disable new-cap */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const ticketTableDefinition = await queryInterface.describeTable(
        "ticket"
      );
      const ticketIndexTableDefinition = await queryInterface.describeTable(
        "index_ticket"
      );

      if (ticketTableDefinition && ticketTableDefinition["story_points"]) {
        await queryInterface.changeColumn("ticket", "story_points", {
          type: Sequelize.DECIMAL(10, 2),
        });
      }

      if (
        ticketIndexTableDefinition &&
        ticketIndexTableDefinition["story_points"]
      ) {
        await queryInterface.changeColumn("index_ticket", "story_points", {
          type: Sequelize.DECIMAL(10, 2),
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const ticketTableDefinition = await queryInterface.describeTable(
        "ticket"
      );
      const ticketIndexTableDefinition = await queryInterface.describeTable(
        "index_ticket"
      );

      if (ticketTableDefinition && ticketTableDefinition["story_points"]) {
        await queryInterface.changeColumn("ticket", "story_points"),
          {
            type: Sequelize.DECIMAL,
          };
      }
      if (
        ticketIndexTableDefinition &&
        ticketIndexTableDefinition["story_points"]
      ) {
        await queryInterface.changeColumn("index_ticket", "story_points", {
          type: Sequelize.DECIMAL,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
