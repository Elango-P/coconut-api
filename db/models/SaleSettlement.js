module.exports = (sequelize, DataTypes) => {
	const Location = require("./Location")(sequelize, DataTypes);
	const User = require("./User")(sequelize, DataTypes);
	const shift = require("./Shift")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);
	const SaleSettlement = sequelize.define("sale_settlement", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		store_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		shift: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		amount_cash: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		amount_upi: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		order_cash_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		order_upi_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		order_total_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		sale_settlement_number: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		sales_executive: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		discrepancy_amount_cash: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		discrepancy_amount_upi: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		calculated_amount_cash: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		calculated_amount_upi: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		received_amount_cash: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		received_amount_upi: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		cash_in_store: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		total_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		total_calculated_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		total_received_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		total_discrepancy_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		owner_id:{
			type:DataTypes.INTEGER,
			allowNull:true
		},
		cash_to_office: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		reviewer: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		due_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		draft_order_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
	},
		{
			tableName: "sale_settlement",
			timestamps: true,
			paranoid: true,
			createdAt: "createdAt",
			updatedAt: "updatedAt",
			deletedAt: "deletedAt"
		});

	SaleSettlement.belongsTo(Location, {
		as: "location",
		foreignKey: "store_id"
	})
	SaleSettlement.belongsTo(User, {
		as: "salesExecutive",
		foreignKey: "sales_executive"
	})
	SaleSettlement.belongsTo(shift, {
		as: "shiftDetail",
		foreignKey: "shift"
	})
	SaleSettlement.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	})

	return SaleSettlement;
};
