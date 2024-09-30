'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding object_name and objec_id");
      
      const tableDefinition = await queryInterface.describeTable("setting");

      if (tableDefinition && !tableDefinition["object_id"]) {
          await queryInterface.addColumn("setting", "object_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }

      if (tableDefinition && !tableDefinition["object_name"]) {
        await queryInterface.addColumn("setting", "object_name", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("setting");

      if (tableDefinition && tableDefinition["object_id"]) {
          await queryInterface.removeColumn("setting", "object_id");
      }

      if (tableDefinition && tableDefinition["object_name"]) {
        await queryInterface.removeColumn("setting", "object_name");
    }
  },
};
