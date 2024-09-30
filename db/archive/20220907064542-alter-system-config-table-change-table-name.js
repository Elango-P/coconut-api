"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
      const tableDefinition = await queryInterface.describeTable("system_config");

          if(tableDefinition){
            await queryInterface.renameTable(
                "system_config",
                "system_setting"
            );
          }

        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
      try {
        const tableDefinition = await queryInterface.describeTable("system_setting");
  
            if(tableDefinition){
              await queryInterface.renameTable(
                  "system_setting",
                  "system_config"
              );
            }
  
          } catch (err) {
              console.log(err);
          }
    },
};
