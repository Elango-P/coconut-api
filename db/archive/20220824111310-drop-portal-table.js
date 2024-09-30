// Change week_days DataType
exports.up = function up(queryInterface, Sequelize) {
  console.log("Drop Table: portal");
	return queryInterface.dropTable("portal");
};

exports.down = function down(queryInterface) {
  try {
    console.log("Create Table: portal");

	return queryInterface.createTable("portal", {
    portal_name: {
      type: DataTypes.STRING,
  },
  company_id: {
      type: DataTypes.INTEGER,
  },
  portal_url: {
      type: DataTypes.STRING,
  },
  template: {
      type: DataTypes.STRING,
  },
  });
}catch (err) {
  console.log(err);
}
};
