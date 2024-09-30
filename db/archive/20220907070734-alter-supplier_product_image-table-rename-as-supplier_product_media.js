"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename vendor_product_image table to supplier_product_image");
        
          const tableDefinition = await queryInterface.describeTable("supplier_product_image");
        if(tableDefinition ){
          await queryInterface.renameTable("supplier_product_image", "supplier_product_media");
        }
    }
      catch(err){
        console.log(err);
      }
    },


  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("supplier_product_media", "supplier_product_image");
  }
};