
module.exports = (sequelize, DataTypes) => {
	const account = require("./account")(sequelize, DataTypes);
	const location = require("./Location")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);
	const User = require("./User")(sequelize, DataTypes);
	
	const AccountsBill = sequelize.define("purchase", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		purchase_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		purchase_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		store_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		file: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		order_number: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		payment_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		payment_term: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		vendor_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		vendor_invoice_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		net_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		discount_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		discrepancy_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		tax_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		owner_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		bill_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		vendor_invoice_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},

		due_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		returned_items_amount: {
			type: DataTypes.NUMERIC,
			allowNull: true
		},
		other_deduction_amount: {
			type: DataTypes.NUMERIC,
			allowNull: true
		},
		cash_discount_percentage: {
			type: DataTypes.NUMERIC,
			allowNull: true
		},
		invoice_amount: {
			type: DataTypes.NUMERIC,
			allowNull: true
		},
		cash_discount_amount: {
			type: DataTypes.NUMERIC,
			allowNull: true
		},
		reviewer_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
	}, {
		tableName: "purchase",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
	AccountsBill.belongsTo(account, {
		as: "account",
		foreignKey: "vendor_id"
	})
	AccountsBill.belongsTo(location, {
		as: "location",
		foreignKey: "store_id"
	})
	AccountsBill.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	})
	AccountsBill.belongsTo(User, {
		as: "UserDetails",
		foreignKey: "owner_id",
	})
	AccountsBill.belongsTo(User, {
		as: "UserData",
		foreignKey: "reviewer_id",
	})

	return AccountsBill;
};
