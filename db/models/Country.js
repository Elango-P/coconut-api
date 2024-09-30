module.exports = (sequelize, DataTypes) => {
    const country = sequelize.define(
        "country",
        {
            country_name: {
                type: DataTypes.STRING,
            },
            company_id : {
                type: DataTypes.INTEGER,  
                allowNull: false
            },
        },
        
        {
            freezeTableName: true,
            paranoid: true,
        }
    );
    return country;
};
