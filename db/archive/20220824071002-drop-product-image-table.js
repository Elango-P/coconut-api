// Change week_days DataType
exports.up = function up(queryInterface, Sequelize) {
  console.log("Drop Table: product_image");
	return queryInterface.dropTable("product_image");
};

exports.down = function down(queryInterface) {
  try {
    console.log("Create Table: product_image");

	return queryInterface.createTable("product_image", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    portal_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
}catch (err) {
  console.log(err);
}
};
