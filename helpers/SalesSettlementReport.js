
const saleSettlement = require('./SaleSettlement');
const DateTime = require('../lib/dateTime');

class SaleReport {


  static EMAIL_SENT_FAILED = 'Email Sent Failed';
  static EMAIL_SENT_SUCCESS = 'Email Sent Successfully';



  static groupByDate = (data, type) => {
    if (type == saleSettlement.AMOUNT_CASH) {
      const groupedData = data.reduce((acc, { date, amount_cash }) => {
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += amount_cash;
        return acc;
      }, {});

      const groupedDataArray = Object.entries(groupedData).map(([date, amount_cash]) => ({
        date: DateTime.Format(date),
        amount_cash,
      }));
      return groupedDataArray;
    }
    if (type == saleSettlement.AMOUNT_UPI) {
      const groupedData = data.reduce((acc, { date, amount_upi }) => {
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += amount_upi;
        return acc;
      }, {});

      const groupedDataArray = Object.entries(groupedData).map(([date, amount_upi]) => ({
        date: DateTime.Format(date),
        amount_upi,
      }));
      return groupedDataArray;
    }
    const groupedData = data.reduce((acc, { date, amount }) => {
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += amount;
      return acc;
    }, {});

    const groupedDataArray = Object.entries(groupedData).map(([date, amount]) => ({
      date: DateTime.Format(date),
      amount,
    }));
    return groupedDataArray;
  };

  static groupByMonth = (data, type) => {
    let ArrayData = [];

    //  type = amount_cash
    if (type == saleSettlement.AMOUNT_CASH) {
      const groupedData = data.reduce((accumulator, current) => {
        let year = DateTime.getYear(current.date);
        year = String(year).slice(-2);
        const month = DateTime.getMonth(current.date) + year;
        accumulator[month] = (accumulator[month] || 0) + current.amount_cash;
        return accumulator;
      }, {});

      for (const [date, amount_cash] of Object.entries(groupedData)) {
        const data = { date: date, amount_cash: amount_cash };
        ArrayData.push(data);
      }
      return ArrayData;
    }

    //  type = amount_upi
    if (type == saleSettlement.AMOUNT_UPI) {
      const groupedData = data.reduce((accumulator, current) => {
        let year = DateTime.getYear(current.date);
        year = String(year).slice(-2);
        const month = DateTime.getMonth(current.date) + year;
        accumulator[month] = (accumulator[month] || 0) + current.amount_upi;
        return accumulator;
      }, {});

      for (const [date, amount_upi] of Object.entries(groupedData)) {
        const data = { date: date, amount_upi: amount_upi };
        ArrayData.push(data);
      }
      return ArrayData;
    }

    const groupedData = data.rows.reduce((accumulator, current) => {
      let year = DateTime.getYear(current.date);
      year = String(year).slice(-2);

      const month = DateTime.getMonth(current.date) + year;
      let amount = Number(current.amount_cash) + Number(current.amount_upi);
      accumulator[month] = (accumulator[month] || 0) + amount;
      return accumulator;
    }, {});

    for (const [date, amount] of Object.entries(groupedData)) {
      const data = { date: date, amount: amount };
      ArrayData.push(data);
    }
    return ArrayData;
  };
}
module.exports = SaleReport;
