/* eslint-disable new-cap */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable(
        "index_dashboard"
      );

      if (tableDefinition && tableDefinition["pending_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "pending_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["todays_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "todays_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["open_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "open_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["reopen_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "reopen_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["hold_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "hold_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["inprogress_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "inprogress_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["review_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "review_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }
      if (tableDefinition && tableDefinition["completed_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "completed_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["myreview_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "myreview_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["new_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "new_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["future_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "future_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }

      if (tableDefinition && tableDefinition["final_review_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "final_review_story_points",
          {
            type: Sequelize.DECIMAL(10, 2),
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable(
        "index_dashboard"
      );

      if (tableDefinition && tableDefinition["pending_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "pending_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["todays_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "todays_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["open_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "open_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["reopen_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "reopen_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["hold_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "hold_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["inprogress_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "inprogress_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["review_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "review_story_points",
          {
            type: Sequelize,
          }
        );
      }

      if (tableDefinition && tableDefinition["completed_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "completed_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["myreview_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "myreview_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["new_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "new_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["future_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "future_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }

      if (tableDefinition && tableDefinition["final_review_story_points"]) {
        await queryInterface.changeColumn(
          "index_dashboard",
          "final_review_story_points",
          {
            type: Sequelize.DECIMAL,
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
};
