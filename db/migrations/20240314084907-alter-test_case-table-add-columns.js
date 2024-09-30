'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("test_case");

      // Condition for adding the module_tag_id and module_tag_id.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["module_tag_id"]) {
        await queryInterface.addColumn("test_case", "module_tag_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["name"]) {
        await queryInterface.addColumn("test_case", "name", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }


      if (tableDefinition && !tableDefinition["description"]) {
        await queryInterface.addColumn("test_case", "description", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["prerequisite"]) {
        await queryInterface.addColumn("test_case", "prerequisite", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["test_data"]) {
        await queryInterface.addColumn("test_case", "test_data", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["expected_result"]) {
        await queryInterface.addColumn("test_case", "expected_result", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["comments"]) {
        await queryInterface.addColumn("test_case", "comments", {
          type: Sequelize.TEXT,
          allowNull: true,
        });
      }

    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("test_case");

      // Condition for removing the module_tag_id and module_tag_id column if it's exist in the table
      if (tableDefinition && tableDefinition["module_tag_id"]) {
        await queryInterface.removeColumn("test_case", "module_tag_id");
      }

      if (tableDefinition && tableDefinition["name"]) {
        await queryInterface.removeColumn("test_case", "name");
      }

      if (tableDefinition && tableDefinition["description"]) {
        await queryInterface.removeColumn("test_case", "description");
      }
    
      if (tableDefinition && tableDefinition["prerequisite"]) {
        await queryInterface.removeColumn("test_case", "prerequisite");
      }
      if (tableDefinition && tableDefinition["test_data"]) {
        await queryInterface.removeColumn("test_case", "test_data");
      }
      if (tableDefinition && tableDefinition["expected_result"]) {
        await queryInterface.removeColumn("test_case", "expected_result");
      }
      if (tableDefinition && tableDefinition["comments"]) {
        await queryInterface.removeColumn("test_case", "comments");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

