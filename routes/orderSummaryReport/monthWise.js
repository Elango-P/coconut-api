const Response = require("../../helpers/Response");
const DateTime = require("../../lib/dateTime");
const Request = require("../../lib/request");
const { order, User } = require('../../db').models;


async function monthWise(req, res, next) {

    try {

    let companyId = Request.GetCompanyId(req);
    let total = 0;

    if (!companyId) {
        return res.send(Response.BAD_REQUEST, {
            message: 'Company Not Found',
        });
    }
    let orderWhere = {}
    orderWhere.company_id = companyId;
    if (req && req.user && req.user.id) {
        orderWhere.owner = req?.user?.id;
    }

    const query = {
        include: [
            {
                required: true,
                model: User,
                as: 'ownerDetail',
            },
        ],
        where: orderWhere,
        order: [['date', 'DESC']],
    };

    const orderDetail = await order.findAndCountAll(query);

    let arrayData = [];
    orderDetail.rows.forEach((value) => {
        let { ownerDetail } = value;
        let year = DateTime.getYear(value.date);
        year = String(year);
        let data = {
            amount: Number(value.get('total_amount')),
            date: DateTime.getMonth(value.date) + ' ' + year,
            user_name: ownerDetail?.name + " " + ownerDetail?.last_name
        };
        arrayData.push(data);
    });
    const groupedData = arrayData.reduce((acc, { date, amount }) => {
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += amount;
        return acc;
    }, {});
    const groupedDataArray = Object.entries(groupedData).map(([date, amount]) => ({ date, amount }));
    const average = total / groupedDataArray.length;
    res.json({
        data: groupedDataArray,
        totalAmount: total,
        average,
        user_name: arrayData && arrayData[0].user_name
    });
} catch (err){
    console.log(err);
}

}

module.exports = monthWise;