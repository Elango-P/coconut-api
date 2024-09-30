"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["bonus"]) {
      await queryInterface.addColumn("salary", "bonus", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["salary_per_day"]) {
      await queryInterface.addColumn("salary", "salary_per_day", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["tds"]) {
      await queryInterface.addColumn("salary", "tds", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["provident_fund"]) {
      await queryInterface.addColumn("salary", "provident_fund", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["other_deductions"]) {
      await queryInterface.addColumn("salary", "other_deductions", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["lop"]) {
      await queryInterface.addColumn("salary", "lop", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["additional_day_allowance"]) {
      await queryInterface.addColumn("salary", "additional_day_allowance", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && tableDefinition["bonus"]) {
      await queryInterface.removeColumn("salary", "bonus");
    }
    if (tableDefinition && !tableDefinition["salary_per_day"]) {
      await queryInterface.removeColumn("salary", "salary_per_day", {
       
      });
    }
    if (tableDefinition && !tableDefinition["tds"]) {
      await queryInterface.removeColumn("salary", "tds", {
       
      });
    }
    if (tableDefinition && !tableDefinition["provident_fund"]) {
      await queryInterface.removeColumn("salary", "provident_fund", {
       
      });
    }
    if (tableDefinition && !tableDefinition["other_deductions"]) {
      await queryInterface.removeColumn("salary", "other_deductions", {
       
      });
    }
    if (tableDefinition && !tableDefinition["lop"]) {
      await queryInterface.removeColumn("salary", "lop", {
       
      });
    }
    if (tableDefinition && !tableDefinition["additional_day_allowance"]) {
      await queryInterface.removeColumn("salary", "additional_day_allowance", {
       
      });
    }

  },
};