'"use strict"';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename supplier_product table to vendor_product");
        
          const tableDefinition = await queryInterface.describeTable("supplier_product");
        if(tableDefinition ){
          await queryInterface.renameTable("supplier_product", "vendor_product");
        }
    }
      catch(err){
        console.log(err);
      }
    },


  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("vendor_product", "supplier_product");
  }
};

