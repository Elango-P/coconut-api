module.exports = (sequelize, DataTypes) => {
    const apartmentSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
    };

    const apartment = sequelize.define("apartment", apartmentSchema, {
        sequelize,
        freezeTableName: true,
        timestamps: true,
    });

    return apartment;
};
