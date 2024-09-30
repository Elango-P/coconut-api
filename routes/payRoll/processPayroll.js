const utils = require("../../lib/utils");

function processHolidays(result) {
	const payrolls = result.get();
	const data = {
		id: payrolls.id,
		userId: payrolls.user_id,
		name: payrolls.user.name,
		workingDays: payrolls.working_days,
		workedDays: payrolls.worked_days,
		additionalDays: payrolls.additional_days,
		storyPoints: payrolls.story_points,
		basicSalary: payrolls.basic_salary,
		currentMonthSalary: payrolls.current_month_salary,
		tds: payrolls.tds,
		paidLeaves: payrolls.paid_leaves,
		unpaidLeaves: payrolls.unpaid_leaves,
		specialAllowance: payrolls.special_allowance,
		additionalDaysBonus: payrolls.additional_days_bonus,
		lossOfPayAmount: payrolls.loss_of_pay_amount,
		loanDeduction: payrolls.loan_deduction,
		NetSalary: payrolls.net_salary,
		grossSalary: payrolls.gross_salary,
		panNumber: payrolls.pan_number,
		snacks: payrolls.snacks,
		professionalTax: payrolls.professional_tax,
		medicalAllowance: payrolls.medical_allowance,
		performanceBonus: payrolls.performance_bonus,
		gratuity: payrolls.gratuity,
		hra: payrolls.hra,
		month: payrolls.month,
		monthName: utils.getMonthName(payrolls.month),
		year: payrolls.year,
		conveyanceAllowance: payrolls.conveyance_allowance,
		bankName: payrolls.bank_name,
		bankAccountNumber: payrolls.bank_account_number,
		lateHours: payrolls.late_hours,
		totalEarning: payrolls.total_earning,
		totalDeductions: payrolls.total_deductions,
	};

	return data;
}

module.exports = processHolidays;
