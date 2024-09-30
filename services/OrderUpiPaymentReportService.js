const { Op } = require("sequelize");
const { BAD_REQUEST } = require("../helpers/Response");
const Boolean = require("../lib/Boolean");
const Request = require("../lib/request");
const validator = require('../lib/validator');
const ArrayList = require("../lib/ArrayList");
const ObjectName = require("../helpers/ObjectName");
const { getMediaUrlsByMediaId } = require("./MediaService");
const DateTime = require("../lib/dateTime");
const { order: orderModel, Location, Shift, User, Media } = require('../db').models;
const Where = require('../lib/Where')


class OrderUpiPaymentReportService {

    static async report(req, res, next) {
        try {
        let { page, pageSize, search, sort, sortDir, pagination,  startDate, endDate, location, shift, user } = req.query;

        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            return res.json(BAD_REQUEST, { message: 'Invalid page' });
        }

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            return res.json(BAD_REQUEST, { message: 'Invalid page size' });
        }

        const companyId = Request.GetCompanyId(req);

        const validOrder = ['ASC', 'DESC'];
        const sortableFields = {
            id: 'id',
            order_number: "order_number",
            order_date: "order_date",
            location_name: "location_name",
            sales_executive_name: "sales_executive_name",
            upi_amount: "upi_amount",
            shift_name: "shift_name",
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        };

        const sortParam = sort || 'order_date';

        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            return res.json(BAD_REQUEST, { message: `Unable to sort by ${sortParam}` });
        }

        const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
        }

        const where = {};
        where.company_id = companyId;

        Where.id(where,"store_id",location)
        Where.id(where,"shift",shift)
        Where.id(where,"owner",user)

        where.upi_amount = {
            [Op.gt]: 0
        }

        if (startDate && !endDate) {
            where.date = {
                [Op.and]: {
                    [Op.gte]: startDate,
                },
            };
        }

        if (endDate && !startDate) {
            where.date = {
                [Op.and]: {
                    [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
                },
            };
        }
        if (startDate && endDate) {
            where.date = {
                [Op.and]: {
                    [Op.gte]: startDate,
                    [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
                },
            };
        }

        const searchTerm = search ? search.trim() : null;
        if (searchTerm) {
            where[Op.or] = [
                {
                    "$location.name$": {
                        [Op.iLike]: `%${searchTerm}%`,
                    },
                },
                {
                    "$shiftDetail.name$": {
                        [Op.iLike]: `%${searchTerm}%`,
                    },
                },
                {
                    "$ownerDetail.name$": {
                        [Op.iLike]: `%${searchTerm}%`,
                    },
                },
            ];
        }
        let order = []

        if (sortParam == "location_name") {
            order.push(["location", "name", sortDirParam])
        }
        if (sortParam == "sales_executive_name") {
            order.push(["owner", "name", sortDirParam])
        }
        if (sortParam == "shift_name") {
            order.push(["shiftDetail", "name", sortDirParam])
        }

        if (sortParam == "order_date") {
            order.push(["date", sortDirParam])
        }

        if (sortParam !== "location_name" && sortParam !== "sales_executive_name" && sortParam !== "shift_name" && sortParam !== "order_date") {
            order.push([sortParam, sortDirParam])
        }
        const include = [
            {
                required: false,
                model: Location,
                as: "location",
                attributes: ["id", "name"],
            },
            {
                required: false,
                model: Shift,
                as: "shiftDetail",
                attributes: ["name", "id"]
            },
            {
                model: User,
                as: "ownerDetail",
                attributes: ["name", "last_name", "media_url"]
            },
        ];

        const query = {
            order: order,
            where,
            include
        };
        if (validator.isEmpty(pagination)) {
            pagination = true;
        }
        if (Boolean.isTrue(pagination)) {
            if (pageSize > 0) {
                query.limit = pageSize;
                query.offset = (page - 1) * pageSize;
            }
        }
        let data = []
        const orderList = await orderModel.findAndCountAll(query);
        if (ArrayList.isArray(orderList?.rows)) {

            const mediaDetails = await Media.findAll({
                where: {
                    object_name: ObjectName.ORDER,
                    object_id: { [Op.in]: orderList.rows.map(order => order?.id) },
                },
                attributes: ["id", "file_name", "object_name", "object_id", "visibility"],
            });

            const mediaGroupedByOrder = ArrayList.isArray(mediaDetails) && mediaDetails.reduce((acc, media) => {
                if (!acc[media.object_id]) {
                    acc[media.object_id] = [];
                }
                const media_url = getMediaUrlsByMediaId(media.id, media.file_name, media.visibility);
                acc[media.object_id].push(media_url);
                return acc;
            }, {}) || [];

            let orderUpiPaymentList = orderList && orderList?.rows;

            for (let i = 0; i < orderUpiPaymentList.length; i++) {
                const { id, order_number, date, shiftDetail, location, upi_amount, ownerDetail, type } = orderUpiPaymentList[i];
                data.push({
                    id: id,
                    order_number: order_number,
                    order_date: date,
                    location_name: location?.name,
                    first_name: ownerDetail?.name,
                    last_name: ownerDetail?.last_name,
                    media_url: ownerDetail?.media_url,
                    shift_name: shiftDetail?.name,
                    upi_amount: upi_amount,
                    order_type: type,
                    paytm_image_urls: mediaGroupedByOrder[id] !==undefined ? mediaGroupedByOrder[id]:[]
                })
            }
        }


        return res.json(200, {
            totalCount: orderList && orderList.count,
            currentPage: page,
            pageSize,
            data: data,
            sort,
            search,
            sortDir,
        });

    } catch (error) {
            console.log(error)
    }

    }
}

module.exports = OrderUpiPaymentReportService;