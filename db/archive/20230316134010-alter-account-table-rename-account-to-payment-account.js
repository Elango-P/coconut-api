'"use strict"';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename account table to payment_account");
        
          const tableDefinition = await queryInterface.describeTable("account");
        if(tableDefinition ){
          await queryInterface.renameTable("account", "payment_account");
        }
    }
      catch(err){
        console.log(err);
      }
    },


  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("payment_account", "account");
  }
};;
