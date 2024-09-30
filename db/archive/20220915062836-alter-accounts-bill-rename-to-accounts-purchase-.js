'"use strict"';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename account bill table to account purchase");
        
          const tableDefinition = await queryInterface.describeTable("accounts_bill");
        if(tableDefinition ){
          await queryInterface.renameTable("accounts_bill", "purchase");
        }
    }
      catch(err){
        console.log(err);
      }
    },


  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("purchase", "accounts_bill");
  }
};