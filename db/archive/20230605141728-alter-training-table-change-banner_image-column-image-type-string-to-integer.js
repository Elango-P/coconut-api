"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("training");
    if (tableDefinition && tableDefinition["banner_image"]) {
      await queryInterface.changeColumn("training", "banner_image", {
        type:  'INTEGER USING CAST("banner_image" as INTEGER)',
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["course_file"]) {
      await queryInterface.changeColumn("training", "course_file", {
        type:  'INTEGER USING CAST("course_file" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("training");
    if (tableDefinition && tableDefinition["banner_image"]) {
      await queryInterface.changeColumn("training", "banner_image", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && tableDefinition["course_file"]) {
      await queryInterface.changeColumn("training", "course_file", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
