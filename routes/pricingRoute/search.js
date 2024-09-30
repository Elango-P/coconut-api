// Utils
const DateTime = require("../../lib/dateTime");
// Status
const { BAD_REQUEST } = require("../../helpers/Response");
const Request = require("../../lib/request");

const { product, vendorProductImage, vendorProduct } = require("../../db").models;

async function search(req, res, next){
    try{
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;
    let company_id = Request.GetCompanyId(req); 
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        return res.status(BAD_REQUEST).send({ message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        return res.status(BAD_REQUEST).send({ message: "Invalid page size" });
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        id: "id",
        name: "name",
        price: "price",
        salePrice: "sale_price",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        return res
            .status(BAD_REQUEST)
            .send({ message: `Unable to sort product by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        return res.status(BAD_REQUEST).send({ message: "Invalid sort order" });
    }

    const data = req.query;

    const where = {};
    where.company_id = company_id

    // Search by name
    const name = data.name;
    if (name) {
        where.name = {
            $like: `%${name}%`,
        };
    }

    // Search by status
    const status = data.status;
    if (status) {
        where.status = status;
    }

    const priceFilter = data.priceFilter;

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            {
                name: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        attributes: { exclude: ["deletedAt"] },
        order: [[sortableFields[sortParam], sortDirParam]],
        where,
        include: [
            {
                required: false,
                model: vendorProductImage,
                as: "vendorProductImages",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
            },
            {
                required: false,
                model: product,
                as: "product",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
            },
        ],
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get Product list and count
    vendorProduct.findAndCountAll(query).then(vendorProducts => {

        // Return products is null
        if (vendorProducts.count === 0) {
            return res.json({});
        }
        const data = [];
        vendorProducts.rows.forEach(vendorProductDetails => {
            const {
                id,
                createdAt,
                updatedAt,
                vendorProductImages,
                product,
            } = vendorProductDetails;
            const vendorProduct = { ...vendorProductDetails.get() };

            let productImage = null;
            if (vendorProductImages && vendorProductImages.length > 0) {
                vendorProductImages.forEach(image => {
                  let imageUrl = typeof image.image_url == "string" && JSON.parse(image.image_url);
                  productImage = Array.isArray(imageUrl) && imageUrl[0];
                });
            }
            vendorProduct.image = productImage;

            if (product) {
                vendorProduct.productPrice = product.price ? product.price : "";
                vendorProduct.productSalePrice = product.sale_price
                    ? product.sale_price
                    : "";
                vendorProduct.productId = product.id ? product.id : "";
                vendorProduct.productName = product.name ? product.name : "";
                vendorProduct.cost = product.cost ? product.cost : "";
            }
            vendorProduct.createdAt = DateTime.defaultDateFormat(createdAt);
            vendorProduct.updatedAt = DateTime.defaultDateFormat(updatedAt);

            // filter by pricefilter
            if (priceFilter === "Price") {
                if (
                    product &&
                    product.price &&
                    product.price != vendorProduct.price
                ) {
                    data.push(vendorProduct);
                }
            } else if (priceFilter === "Sale Price") {
                if (
                    product &&
                    product.sale_price &&
                    product.sale_price != vendorProduct.sale_price
                ) {
                    data.push(vendorProduct);
                }
            } else if (!priceFilter) {
                data.push(vendorProduct);
            }
        });

        res.json({
            totalCount: vendorProducts.count,
            currentPage: page,
            pageSize,
            data,
            sort,
            sortDir,
            search,
       });
    });
 } catch(err){
    res.json({message : err.message});
 }
};

module.exports = search;
