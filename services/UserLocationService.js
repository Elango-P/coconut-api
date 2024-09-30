const { UserLocation, User } = require("../db").models;
const Request = require("../lib/request");
const Response = require("../helpers/Response");
const String = require("../lib/string");
const validator = require("../lib/validator");
const Boolean = require("../lib/Boolean");

class UserLocationService {


    static async create(req, res) {

        try {

        const data = req.body;

        const companyId = Request.GetCompanyId(req);

        const userId = Request.getUserId(req);

        const createData = {
            latitude: data?.latitude,
            longitude: data?.longitude,
            user_id: userId,
            company_id: companyId,
        }

        await UserLocation.create(createData);

        res.json(Response.OK, { message: "UserLocation Added" })
    } catch (err) {
            console.log(err);
        }
    };

    static async search(req, res) {

        try {
            let { page, pageSize, search, sort, sortDir, pagination, user_id } = req.query;


            // Validate if page is not a number
            page = page ? parseInt(page, 10) : 1;
            if (isNaN(page)) {
                return res.json(Response.BAD_REQUEST, { message: 'Invalid page' });
            }

            // Validate if page size is not a number
            pageSize = pageSize ? parseInt(pageSize, 10) : 25;
            if (isNaN(pageSize)) {
                return res.json(Response.BAD_REQUEST, { message: 'Invalid page size' });
            }
            const companyId = Request.GetCompanyId(req);


            if (!companyId) {
                return res.json(Response.BAD_REQUEST, 'Company Not Found');
            }

            // Sortable Fields
            const validOrder = ['ASC', 'DESC'];
            const sortableFields = {
                id: "id",
                created_at: "created_at",
                latitude: "latitude",
                longitude: "longitude"
            };

            const sortParam = sort || 'created_at';

            // Validate sortable fields is present in sort param
            if (!Object.keys(sortableFields).includes(sortParam)) {
                return res.json(Response.BAD_REQUEST, { message: `Unable to sort userLocation by ${sortParam}` });
            }

            const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
            // Validate order is present in sortDir param
            if (!validOrder.includes(sortDirParam)) {
                return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
            }


            const where = {};
            where.company_id = companyId;
            // Search by name

            if (user_id) {
                where.user_id = user_id;
            }

            const query = {
                order: [["created_at", "DESC"]],
                include: [
                    {
                        required: false,
                        model: User,
                        as: 'userDetails',
                    },
                ],
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

            // Get Vendor list and count
            const details = await UserLocation.findAndCountAll(query);

            const data = [];

            details.rows.forEach((value) => {
                const {
                    id,
                    latitude,
                    longitude,
                    user_id,
                    created_at,
                    userDetails

                } = value.get();

                data.push({
                    id,
                    latitude,
                    longitude,
                    user_id,
                    created_at,
                    userName: String.concatName(userDetails && userDetails.name, userDetails && userDetails.last_name),
                    media_url: userDetails && userDetails?.media_url
                });
            });

            res.json(Response.OK, {
                totalCount: details.count,
                currentPage: page,
                pageSize,
                data,
                search,
                sort,
                sortDir,
            });

        } catch (err) {
            console.log(err);
        }
    };


}

module.exports = UserLocationService
