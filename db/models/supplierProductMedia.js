module.exports =(sequelize, DataTypes) => {
    const supplierProductMediaSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        supplier_product_id: {
            type: DataTypes.INTEGER,
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
        position : {
			type: DataTypes.STRING,  
			allowNull: true
		},
    };

    const vendorProduct = sequelize.define(
        "supplier_product_media",
        supplierProductMediaSchema,
        {
            tableName: "supplier_product_media",
            sequelize,
            freezeTableName: true,
            timestamps: true,
        }
    );

    return vendorProduct;
};
