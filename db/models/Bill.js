


module.exports = (sequelize, DataTypes) => {
	const account = require("./account")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);
	const location = require("./Location")(sequelize, DataTypes);
	const AccountsBill = sequelize.define("bill", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		bill_date: {
			type: DataTypes.DATEONLY,
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
		account_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		billing_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		invoice_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		net_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		cgst_amount: {
            type: DataTypes.DECIMAL, 
            allowNull: true,
          },
          sgst_amount: {
            type: DataTypes.DECIMAL, 
            allowNull: true,
          },
          cess_amount: {
            type: DataTypes.DECIMAL, 
            allowNull: true,
          },
		  igst_amount: {
            type: DataTypes.DECIMAL, 
            allowNull: true,
          },
		  gst_status: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		bill_number: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		gst_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		cash_discount_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		other_deduction_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		invoice_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		cash_discount_percentage: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		notes:{
			type:DataTypes.STRING,
			allowNull:true,
		},

		owner_id:{
			type:DataTypes.INTEGER,
			allowNull:true
		},
		due_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		rejected_product_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		expiry_returned_product_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
	}, {
		tableName: "bill",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
	AccountsBill.belongsTo(account, {
		as: "account",
		foreignKey: "account_id"
	})
	// AccountsBill.belongsTo(location, {
	// 	as: "location",
	// 	foreignKey: "store_id"
	// })
	AccountsBill.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	})
	AccountsBill.belongsTo(status, {
		as: "gstStatusDetail",
		foreignKey: "gst_status"
	})

	return AccountsBill;
};
