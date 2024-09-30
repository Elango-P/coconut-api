module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const WikiPage = sequelize.define("wiki_pages", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: true
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		updated_by: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "wiki_pages",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
	WikiPage.belongsTo(User, { as: "createdBy", foreignKey: "created_by" });
	WikiPage.belongsTo(User, { as: "updatedBy", foreignKey: "updated_by" });
	return WikiPage;
};
