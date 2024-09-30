
const { Op } = require("sequelize");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Request = require("../../lib/request");
const Number = require("../../lib/Number");
const Location = require("../../lib/Location");
const Address = require("../../services/AddressService");
const ObjectName = require("../../helpers/ObjectName");

const { Location: LocationModel } = require("../../db").models;

async function location(req, res, next) {

    let { page, pageSize, search, sort, sortDir, user } = req.query;
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        return res.json(BAD_REQUEST, { message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        return res.json(BAD_REQUEST, { message: "Invalid page size" });
    }

    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
        return res.json(400, "Company Not Found")
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        id: "id",
        name: "name",
        distance: "distance",
    };

    const sortParam = sort || "distance";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, { message: `Unable to sort vendor by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }

    const where = {};

    where.company_id = companyId;

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where[Op.or] = [
            {
                name: {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        where,
    };

    try {
        let addressData = await Address.Get(ObjectName.USER, user, companyId);
        const locationList = await LocationModel.findAndCountAll(query);
        let locationData = locationList && locationList.rows;

        let data = []
        if (locationData && locationData.length > 0) {
            for (let i = 0; i < locationData.length; i++) {
                const { name, latitude, longitude } = locationData[i];
                let value = {
                    name: name,
                }

                if ((Number.isNotNull(latitude) && Number.isNotNull(longitude)) && (Number.isNotNull(addressData?.latitude) && Number.isNotNull(addressData?.longitude))) {
                    let distance = Location.getDistance(latitude, longitude, addressData?.latitude, addressData?.longitude)
                    value.distance = distance,
                    value.locationLatitude = latitude
                    value.locationLongitude = longitude
                    value.userLatitude = addressData?.latitude
                    value.userLongitude = addressData?.longitude
                    value.isDirection=true
                } else {
                    value.distance = ""
                }
                data.push(value)
            }
        }
        if (sortParam === "name") {
            if (sortDirParam === 'ASC') {
                data.sort((a, b) => a?.name.localeCompare(b?.name));
            } else {
                data.sort((a, b) => b?.name.localeCompare(a?.name));
            }
        }

        if (sortParam === "distance") {
            data.sort((a, b) => {
                if (!a?.distance && !b?.distance) return 0;
                if (!a?.distance) return 1;
                if (!b?.distance) return -1;
                const distanceA = parseFloat(a.distance);
                const distanceB = parseFloat(b.distance);
                if (sortDirParam === 'ASC') {
                    return distanceA - distanceB;
                } else {
                    return distanceB - distanceA;
                }
            });
        }


        const offset = (page - 1) * pageSize;

        const sliceData = data.slice(offset, offset + pageSize);


        res.json(OK, {
            totalCount: locationList.count,
            currentPage: page,
            pageSize,
            data: sliceData,
            search,
            sort,
            sortDir,
        });

    } catch (err) {
        console.log(err);
        res.json(OK, { message: err.message });
    }
};

module.exports = location;

