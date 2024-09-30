module.exports = (sequelize, DataTypes) => {

	const Status = require("./status")(sequelize, DataTypes);
    const product_index = require("./productIndex")(sequelize, DataTypes);

	const ProductPrice = sequelize.define("product_price", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		cost_price: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		sale_price: {
			type: DataTypes.DECIMAL,
			allowNull: true 
		},
		mrp: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
        barcode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
		is_default : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
		status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
	    date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		discount_percentage:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
	}, {
		tableName: "product_price",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	ProductPrice.belongsTo(Status, {
		as: "statusDetail",
		foreignKey: "status",
	});

	ProductPrice.hasOne(product_index, {
		as: "productDetails",
		sourceKey: "product_id",
		foreignKey: "product_id",
	});

	return ProductPrice;
};
