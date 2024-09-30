module.exports = (sequelize, DataTypes) => {

	const InventorySpecification = sequelize.define("InventorySpecification", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		inventory_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		specification_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "inventory_specification",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	return InventorySpecification;
};
