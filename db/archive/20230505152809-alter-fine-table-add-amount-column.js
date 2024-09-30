"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("fine");

        if (tableDefinition && !tableDefinition["amount"]) {
            await queryInterface.addColumn("fine", "amount", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

      

        
     
        
    
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("fine");

        if (tableDefinition && tableDefinition["fine"]) {
            await queryInterface.removeColumn("fine", "amount", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
        }

        
    },
};