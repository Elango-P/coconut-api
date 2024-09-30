const { Op, literal } = require("sequelize");
const ObjectName = require("../helpers/ObjectName");
const { BAD_REQUEST, OK, UPDATE_SUCCESS } = require("../helpers/Response");
const Boolean = require("../lib/Boolean");
const Number = require("../lib/Number");
const Request = require("../lib/request");
const validator = require("../lib/validator");
const history = require("./HistoryService");
const { CurrencyDenomination } = require("../db").models;


class CurrencyDenominationService {

    static async create(createData) {

        await CurrencyDenomination.create(createData).then((response) => {
            return response;
        })
    }


    static async search(req, res, next) {

        try {

            let { page, pageSize, search, sort, sortDir, pagination, object_id, object_name } = req.query;
            const companyId = Request.GetCompanyId(req);
            // Validate if page is not a number
            page = page ? parseInt(page, 10) : 1;
            if (isNaN(page)) {
                return res.json(BAD_REQUEST, { message: 'Invalid page' });
            }
            // Validate if page size is not a number
            pageSize = pageSize ? parseInt(pageSize, 10) : 25;
            if (isNaN(pageSize)) {
                return res.json(BAD_REQUEST, { message: 'Invalid page size' });
            }
            const where = {};

            const validOrder = ['ASC', 'DESC'];
            const sortableFields = {
              id: 'id',
              denomination: 'denomination',
              count: 'count',
              amount: 'amount',
              createdAt: 'createdAt',
              updatedAt: 'updatedAt',
            };
      
            const sortParam = sort || 'denomination';
      
            // Validate sortable fields is present in sort param
            if (!Object.keys(sortableFields).includes(sortParam)) {
              return res.json(BAD_REQUEST, { message: `Unable to sort Denomination by ${sortParam}` });
            }
      
            const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
            // Validate order is present in sortDir param
            if (!validOrder.includes(sortDirParam)) {
              return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
            }


            if (search) {
                const searchTerm = search ? search.trim() : null;
                if (searchTerm) {
                    where[Op.or] = [
                        literal(`CAST("denomination" AS TEXT) ILIKE '%${searchTerm}%'`),
                        literal(`CAST("amount" AS TEXT) ILIKE '%${searchTerm}%'`)
                    ];
                }
            }

            if (!companyId) {
                return res.json(400, 'Company Not Found');
            }


            if (Number.isNotNull(object_id)) {
                where.object_id = object_id
            }

            if (Number.isNotNull(object_name)) {
                where.object_name = object_name
            }

            where.company_id = companyId;

            const query = {
                order: [[sortParam,sortDirParam]],
                where,
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

            let totalAmount = await CurrencyDenomination.sum("amount",{where:where});
            const currencydenominationList = await CurrencyDenomination.findAndCountAll(query);
            let dataList = currencydenominationList && currencydenominationList?.rows
            let data = []

            if (dataList && dataList.length > 0) {
                for (let i = 0; i < dataList.length; i++) {
                    const { id,
                        object_name,
                        object_id,
                        denomination,
                        amount,
                        count } = dataList[i];

                    data.push({
                        id,
                        object_name,
                        object_id,
                        denomination,
                        amount,
                        count
                    })
                }
            }

            res.json(OK, {
                totalCount: currencydenominationList?.count,
                currentPage: page,
                pageSize,
                data,
                search,
                sort,
                sortDir,
                totalAmount:totalAmount
            });

        } catch (error) {
            console.log(error);
        }
    }

    static async update (req,res,next){
        let data = req.params;
        let body = req.body;
        let companyId = Request.GetCompanyId(req);

        if(!companyId){
            return res.json(400,{message:"CompanyId Not Found"})
        }

        let updateData={
            ...body,
            amount: Number.Multiply(body?.denomination, body?.count)
        }

        await CurrencyDenomination.update(updateData,{where:{company_id:companyId, id:data?.id}}).then((response)=>{
            res.json(200, {
                message: "Currency Denomination Updated",
            });
            res.on("finish", async () => {
                history.create("Currency Denomination Updated", req, ObjectName.SALE_SETTLEMENT, data?.id);
            });
        })
    }


    static async del(req, res, next) {

        try {

            let data = req.params;
            const companyId = Request.GetCompanyId(req);

            const isDetailExite = await CurrencyDenomination.findOne({
                where: { id: data?.id, company_id: companyId },
            });

            if (!isDetailExite) {
                return res.json(BAD_REQUEST, { message: "Detail Not Found" });
            }

            const del = await isDetailExite.destroy();

            res.json(UPDATE_SUCCESS, {
                message: "Currency Denomination Deleted ",
            });

            res.on("finish", async () => {
                history.create("Currency Denomination Deleted", req, ObjectName.SALE_SETTLEMENT, del.id);
            })

        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, {
                message: err.message
            });
        }

    }
}
module.exports = CurrencyDenominationService;