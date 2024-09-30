module.exports = (sequelize, DataTypes) => {
	const tagType = require("./TagType")(sequelize, DataTypes);
	const Tag = sequelize.define("Tag", {

		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		default_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
	}, {
		tableName: "tag",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt",
		paranoid: true,
	});
	Tag.belongsTo(tagType, {
		as: "tagDetails",
		foreignKey:"type",
	});
	return Tag;
}