module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("contact", {
      type: "foreign key",
      name: "account_contact",
      fields: ["object_id"],
      references: {
        table: "account",
        fields: ["id"],
      },
      onDelete: 'RESTRICT', 
    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("contact", "object_id");
  },
};