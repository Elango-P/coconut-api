"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename bill media table to purchase media");
        
          const tableDefinition = await queryInterface.describeTable("bill_media");
        if(tableDefinition ){
          await queryInterface.renameTable("bill_media", "purchase_media");
        }
    }
      catch(err){
        console.log(err);
      }
    },
  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("purchase_media", "bill_media");
  }
};