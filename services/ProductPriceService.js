const Response = require("../helpers/Response");
const DataBaseService = require("../lib/dataBaseService");
const DateTime = require("../lib/dateTime");
const Request = require("../lib/request");
const History = require("./HistoryService");
const ObjectName = require("../helpers/ObjectName");
const ProductPrice = require("../helpers/ProductPrice");
const Number = require("../lib/Number");
const ArrayList = require("../lib/ArrayList");
const ProductService = require("../services/ProductService");

const { Op, Sequelize } = require("sequelize");

const { ProductPrice: ProductPriceModal, product, status: statusModel, ProductPrice: ProductPriceModel } = require("../db").models;
const productPriceService = new DataBaseService(ProductPriceModal);
const productService = new DataBaseService(product);
const validator = require('.././lib/validator');
const Boolean = require('../lib/Boolean');
const StatusService = require('../services/StatusService');
const Status = require("../helpers/Status");
const { sequelize } = require("../db");
const Currency = require("../lib/currency");


class ProductPriceService {

    static async create(req, res) {
        try {
            const data = req.body;
            const companyId = Request.GetCompanyId(req);


            let productPriceDetail = await productPriceService.findOne({
                where: { company_id: companyId, product_id: data.productId, barcode: data.barCode, sale_price: data.salePrice }
            });

            if (productPriceDetail) {
                return res.json(Response.BAD_REQUEST, { message: "Product Price Already Exist" });
            }

            let statusDetail = await StatusService.Get(ObjectName.PRODUCT_PRICE, Status.GROUP_DRAFT, companyId);

            let historyMessage=[]
            const createData = {
                product_id: data.productId,
                company_id: companyId,
                barcode: data.barCode.trim(),
                cost_price: Number.Get(data.costPrice) || null,
                mrp: Number.Get(data.mrp) || null,
                sale_price: Number.roundOff(data.salePrice),
                date: data.date,
                status: statusDetail ? statusDetail.id : null,
                is_default: data.isDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT,
                discount_percentage: Number.GetFloat(data.discount_percentage),

            };

            let priceDetail = await productPriceService.create(createData);

            if (priceDetail && priceDetail.is_default == ProductPrice.IS_DEFAULT) {

                await this.updateIsDefault(priceDetail.id, priceDetail.product_id, companyId)
            }

            if(data && Number.isNotNull(data?.productId)){

                if(data?.barCode){
                    historyMessage.push(`Product ${data.productId}# Price added with barcode ${data.barCode.trim()}`)
                }
                if(data?.costPrice){
                    historyMessage.push(`Product ${data.productId}# Price added with Cost Price ${Currency.IndianFormat(data?.costPrice)}`)
                }
                if(data?.mrp){
                    historyMessage.push(`Product ${data.productId}# Price added with mrp ${Currency.IndianFormat(data?.mrp)}`)
                }
                if(data?.salePrice){
                    historyMessage.push(`Product ${data.productId}# Price added with Sale Price ${Currency.IndianFormat(data?.salePrice)}`)
                }
                if(data?.date){
                    historyMessage.push(`Product ${data.productId}# Price added with Date ${DateTime.shortMonthDate(data?.date)}\n`);
                }
                if(statusDetail){
                    historyMessage.push(`Product ${data.productId}# Price added with Status ${statusDetail?.name}\n`);
                }
                if(data?.discount_percentage){
                    historyMessage.push(`Product ${data.productId}# Price added with discount percentage ${data?.discount_percentage}`)
                }
                
            }

            if (priceDetail && priceDetail.id) {
                return { status: Response.OK, data: priceDetail.product_id, priceId: priceDetail?.id,historyMessage:historyMessage }
            }

        } catch (err) {
            console.log(err);
            // create a log
            History.create(`Product Price Creation Error - ${err.message
                }`, req);
            res.json(Response.BAD_REQUEST, { message: err.message });
        }
    };

    static async updateIsDefault(productPriceId, productId, companyId) {
        try {
            const query = {
                where: {
                    company_id: companyId,
                    product_id: productId,
                    id: { [Op.ne]: productPriceId },
                },
            };
            await productPriceService.update({ is_default: ProductPrice.IS_NOT_DEFAULT }, query);

        } catch (err) {
            console.log(err);
        }
    }

    static async updateIsDefaultPrice(req, res) {
        try {
            const data = req.body;

            const { id } = req.params;
            const companyId = Request.GetCompanyId(req);

            let updateData = new Object();

            if (!id) {
                return res.json(Response.BAD_REQUEST, {
                    message: " Product Price Id Required",
                })
            }

            let productPriceDetail = await productPriceService.findOne({
                where: { company_id: companyId, id: id }
            });

            if (!productPriceDetail) {
                return res.json(Response.BAD_REQUEST, {
                    message: " Product Price not Found",
                })
            }
            if (data.isDefault != undefined) {

            let statusDetail = await StatusService.Get(ObjectName.PRODUCT_PRICE, Status.GROUP_DRAFT, companyId);
            if(statusDetail?.id !== productPriceDetail?.status){
                updateData.is_default = data?.isDefault === true ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT;
            }else{
                return res.json(Response.BAD_REQUEST, {
                    message: "The price is currently not active",
                })
            }
            }

            let priceDetail = await productPriceService.update(
                updateData,
                {
                    where: { company_id: companyId, id: id },
                    returning: true,
                    plain: true,
                },
            );
            priceDetail = ArrayList.isNotEmpty(priceDetail) && priceDetail[1];
            if (priceDetail && priceDetail.is_default == ProductPrice.IS_DEFAULT) {
                await this.updateIsDefault(priceDetail.id, priceDetail.product_id, companyId);
                await productService.update({
                    cost: priceDetail.cost_price,
                    sale_price: priceDetail.sale_price,
                    mrp: priceDetail.mrp,
                    barcode: priceDetail.barcode,
                    discount_percentage: priceDetail.discount_percentage,
                }, { where: { id: priceDetail.product_id } })

            }

            if (priceDetail && priceDetail.id) {
                return { statusCode: Response.OK, product_id: priceDetail.product_id }
            }

        } catch (err) {
            console.log(err);
            return res.json(Response.BAD_REQUEST, { message: err.message });
        }
    }


    static async search(req, res) {
        try {
            //get req params
            let params = req.query;

            //destructure the params
            let { page, pageSize, sort, sortDir, pagination, product_id, status } = params;

            //get company Id from request
            const companyId = Request.GetCompanyId(req);

            // Get the timeZone
            let timeZone = Request.getTimeZone(req);

            // Validate if page is not a number
            page = page ? parseInt(page, 10) : 1;
            if (isNaN(page)) {
                throw {
                    message: "Invalid page",
                };
            }

            // Validate if page size is not a number
            pageSize = pageSize ? parseInt(pageSize, 10) : 25;
            if (isNaN(pageSize)) {
                throw {
                    message: "Invalid page size",
                };
            }

            // Sortable Fields
            const validOrder = ["ASC", "DESC"];
            const sortableFields = {
                id: "id",
                mrp: "mrp",
                cost_price: "cost_price",
                barcode: "barcode",
                sale_price: "sale_price",
                createdAt: "createdAt",
                is_default: "is_default",
                status: "status",
                date: "date"

            };

            const sortParam = sort || "date";
            // Validate sortable fields is present in sort param
            if (!Object.keys(sortableFields).includes(sortParam)) {
                return res.json(Response.BAD_REQUEST, {
                    message: `Unable to sort product by ${sortParam}`,
                });
            }

            const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
            // Validate order is present in sortDir param
            if (!validOrder.includes(sortDirParam)) {
                return res.json(Response.BAD_REQUEST, {
                    message: "Invalid sort order",
                });
            }

            //cretae where object
            let where = new Object();


            //append the company id
            where.company_id = companyId;

            if (product_id) {
                where.product_id = product_id;
            }

            if (status) {
                where.status = status;
            }

            //create query object
            const query = {
                order: [
                    [sortableFields[sortParam] || 'date', sortDirParam || 'desc'],
                    ["date", "desc"],
                    ["id", "desc"]
                ],
                where,
                include: [
                    {
                        required: false,
                        model: statusModel,
                        as: "statusDetail"
                    }
                ]
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

            //create saleProduct array
            let productData = [];

            const productDetail = await productPriceService.findAndCount(query);

            productDetail.rows.forEach((Products) => {
                const {
                    id,
                    quantity,
                    unit_price,
                    createdAt,
                    updatedAt,
                    product_id,
                    item,
                    amount,
                    mrp,
                    barcode,
                    cost_price,
                    sale_price,
                    is_default,
                    status,
                    company_id,
                    date,
                    statusDetail,
                    discount_percentage,
                } = Products;

                const data = {
                    id,
                    unit_price: unit_price,
                    quantity: quantity,
                    product_id: product_id,
                    item: item,
                    amount: amount,
                    mrp: Number.GetFloat(mrp),
                    costPrice: Number.GetFloat(cost_price),
                    barCode: barcode,
                    salePrice: Number.roundOff(sale_price),
                    companyId: company_id,
                    isDefault: is_default == ProductPrice.IS_DEFAULT ? true : false,
                    type: is_default == ProductPrice.IS_DEFAULT ? "Default" : "",
                    status: statusDetail && statusDetail.id,
                    statusText: statusDetail ? statusDetail.name : "",
                    date: date,
                    discount_percentage: discount_percentage,
                    margin_percentage: Number.GetPercentage(((mrp - cost_price) / mrp) * 100),
                    margin_amount: Number.GetCurrency(sale_price - cost_price),
                    createdAt: DateTime.getDateTimeByUserProfileTimezone(createdAt, timeZone),
                    updatedAt: DateTime.getDateTimeByUserProfileTimezone(updatedAt, timeZone)
                };

                productData.push(data);
            });
            //return response
            return res.json(200, {
                totalCount: productDetail.count,
                currentPage: page,
                pageSize,
                data: productData,
                sort,
                sortDir,
            });
        } catch (err) {
            console.log(err);
            return res.json(400, {
                message: err.message,
            });
        }
    }

    static async update(req, res) {
        try {
            const data = req.body;

            const { id } = req.params;

            //get company Id from request
            const companyId = Request.GetCompanyId(req);

            if (!id) {
                return res.json(Response.BAD_REQUEST, {
                    message: " Product Price Id Required",
                })
            }

            let productPriceDetail = await productPriceService.findOne({
                where: { company_id: companyId, id: id }
            });

            if (!productPriceDetail) {
                return res.json(Response.BAD_REQUEST, {
                    message: " Product Price not Found",
                })
            }

            let productPriceExist = await productPriceService.findOne({
                where: { company_id: companyId, cost_price: data.costPrice ? data.costPrice : null, product_id: productPriceDetail.product_id, barcode: data.barCode, sale_price: data.salePrice, mrp: data.mrp, id: { [Op.ne]: id } }
            });

            if (productPriceExist) {
                return res.json(Response.BAD_REQUEST, { message: "Product Price Already Exist" });
            }

            let historyMessage=[]


            let updateData = new Object();

            if (data.barCode !== productPriceDetail?.barCode) {
                updateData.barcode = data?.barCode.trim();
                historyMessage.push(`Product  ${data?.productId}# Price barcode changed to ${data?.barCode.trim()}`)

            }

            if (data?.status  && (Number.Get(data?.status.value )!== Number.Get(productPriceDetail?.status))) {
                
                if (data?.isDefault) {
                let statusDetail = await StatusService.Get(ObjectName.PRODUCT_PRICE, Status.GROUP_DRAFT, companyId);
                if (statusDetail?.id !== data?.status.value) {
                  updateData.status = data?.status.value;
                  historyMessage.push(`Product ${data?.productId}# Status changed to ${statusDetail?.name}\n`);

                }
              } else {
                updateData.status = data?.status.value;
                let statusDetail = await StatusService.getData(data?.status.value,companyId);
                historyMessage.push(`Product ${data?.productId}# Status changed to ${statusDetail?.name}\n`);


              }
                }


            updateData.cost_price = data?.costPrice ? data?.costPrice : null;
            if( Number.GetFloat(data?.costPrice)  !== Number.GetFloat(productPriceDetail?.cost_price)){

                historyMessage.push(`Product ${data?.productId}# Cost Price changed to ${Currency.IndianFormat(data?.costPrice)}`)
            }

            if (Number.GetFloat(data?.mrp)  !== Number.GetFloat(productPriceDetail?.mrp)) {
                updateData.mrp = data?.mrp;
                historyMessage.push(`Product ${data?.productId}# Mrp changed to ${Currency.IndianFormat(data?.mrp)}`)
            }

            if (Number.GetFloat(data?.salePrice) !== Number.GetFloat(productPriceDetail?.sale_price)) {


                updateData.sale_price = Number.roundOff(data?.salePrice);
                historyMessage.push(`Product ${data?.productId}# Sale Price changed to ${Currency.IndianFormat(data?.salePrice)}`)
            }

            if (data?.date !== productPriceDetail?.date) {
                updateData.date = data?.date;
                historyMessage.push(`Product ${data?.productId}# Date changed to ${DateTime.shortMonthDate(data?.date)}\n`);
            }

            if (data?.isDefault != undefined) {
                let statusDetail = await StatusService.Get(ObjectName.PRODUCT_PRICE, Status.GROUP_DRAFT, companyId);
                if (statusDetail?.id !== data?.status.value) {
                    updateData.is_default = data?.isDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT;
                    let defaultValue= data?.isDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT;
                    if(Number.Get(defaultValue) !== Number.Get(productPriceDetail?.is_default)){

                        historyMessage.push(`Product ${data?.productId}# default changed to ${data?.isDefault ? 'true' : 'false'}`);
                    }
                }
            }
            if (Number.GetFloat(data?.discount_percentage )!== Number.GetFloat(productPriceDetail?.discount_percentage)) {
                updateData.discount_percentage = Number.GetFloat(data?.discount_percentage);
                historyMessage.push(`Product ${data?.productId}# discount percentage changed to ${data?.discount_percentage}`)
            }


            let priceDetail = await productPriceService.update(
                updateData,
                {
                    where: { company_id: companyId, id: id },
                    returning: true,
                    plain: true,
                },
            );
            priceDetail = ArrayList.isNotEmpty(priceDetail) && priceDetail[1];

            if (priceDetail && priceDetail.is_default == ProductPrice.IS_DEFAULT) {
            let statusDetail = await StatusService.Get(ObjectName.PRODUCT_PRICE, Status.GROUP_DRAFT, companyId);

            if (statusDetail?.id !== priceDetail?.status) {
                await this.updateIsDefault(priceDetail.id, priceDetail.product_id, companyId);
                await productService.update({
                    cost: priceDetail.cost_price,
                    sale_price: priceDetail.sale_price,
                    mrp: priceDetail.mrp,
                    barcode: priceDetail.barcode,
                    discount_percentage: priceDetail.discount_percentage,
                }, { where: { id: priceDetail.product_id } })
            }
        }
            if (priceDetail && priceDetail.id) {
                return {
                    statusCode: Response.OK,
                    product_id: priceDetail.product_id,
                    salePrice: productPriceDetail?.sale_price,
                    newSalePrice: priceDetail?.sale_price,
                    priceId: priceDetail?.id,
                    historyMessage:historyMessage
                }
            }
        } catch (err) {
            console.log(err);
            return res.json(Response.BAD_REQUEST, { message: err.message });
        }
    };


    static async del(req, res, next) {
        try {
            const id = req.params.id;
            const company_id = Request.GetCompanyId(req);
            await productPriceService.delete({
                where: {
                    id: id,
                    company_id: company_id
                }
            });

            res.json(Response.OK, { message: "Product Price Deleted" });

            res.on("finish", async () => {
                // create system log for Product Price updation
                History.create("Product Price Deleted", req);
            });
        } catch (err) {
            console.log(err);
            return res.json(Response.BAD_REQUEST, { message: err.message });
        }
    };

    static async updateStatus(req, res) {
        try {
            const data = req.body;

            const { id } = req.params;

            //get company Id from request
            const companyId = Request.GetCompanyId(req);

            let updateData = new Object();


            if (!id) {
                return res.json(400, {
                    message: " Product Price Id Required",
                })
            }

            if (data && data.status == undefined) {
                return res.json(400, {
                    message: "Status Is Required",
                })
            }

            let productPriceDetail = await productPriceService.findOne({
                where: { company_id: companyId, id: id }
            });

            if (!productPriceDetail) {
                return res.json(400, {
                    message: " Product Price not Found",
                })
            }

            if (data.status) {

                updateData.status = data.status;

            }


            await productPriceService.update(
                updateData,
                {
                    where: { company_id: companyId, id: id },
                    returning: true,
                    plain: true,
                },
            );

            if (productPriceDetail && productPriceDetail.id) {
                return { statusCode: Response.OK, product_id: productPriceDetail.product_id }
            }
        } catch (err) {
            console.log(err);
            return res.json(400, { message: err.message });
        }
    };


    static async updatePrice(params) {
        try {

            let { productId, companyId, unitPrice, marginAmount, barcode, mrp, date } = params
            let activeStatus = await StatusService.Get(ObjectName.PRODUCT_PRICE, null, companyId, {
                is_active_price: ProductPrice.STATUS_ACTIVE,
            });
            let productData = await product.findOne({
                where: {
                    id: productId,
                    company_id: companyId,
                },
            });
            let mostRecentPrice = await productPriceService.find({
                where: {
                    product_id: productId,
                    company_id: companyId,
                    date: { [Op.ne]: null }
                },
                order: [
                    ["date", "desc"],
                    ["id", "desc"]
                ]
            });

            let historyMessage=[]
            let salePrice;

            if (productData) {
                if (productData.margin_percentage > 0) {
                    let price = Number.GetFloat(unitPrice) + Number.GetFloat(marginAmount);
                    let discountAmount = (price * productData.discount_percentage) / 100;
                    salePrice = Number.GetFloat(price) - Number.GetFloat(discountAmount);
                } else {
                    let discountAmount = (mrp * productData.discount_percentage) / 100;
                    salePrice = Number.GetFloat(mrp) - Number.GetFloat(discountAmount);
                }
            }


            let order = []


            order.push([Sequelize.literal(`${"date DESC NULLS LAST, id DESC"}`)]);


            let productPriceExist = await productPriceService.find({
                where: {
                    product_id: productId,
                    mrp: mrp,
                    sale_price: salePrice,
                    cost_price: unitPrice,
                    barcode: barcode,
                    company_id: companyId,
                    status: { [Op.eq]: activeStatus?.id }
                },
                order,
            });

            let updateDefault = DateTime.compareDates(
                mostRecentPrice && mostRecentPrice.length > 0 && mostRecentPrice[0].date,
                date
            );


            if (productPriceExist && productPriceExist.length == 0) {

                let createData = {
                    product_id: productId,
                    date: date,
                    cost_price: unitPrice,
                    mrp: mrp,
                    company_id: companyId,
                    status: activeStatus && activeStatus?.id,
                    barcode: barcode,
                    sale_price: salePrice,
                    is_default: updateDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT,
                };

                let priceDetail = await productPriceService.create(createData);


                    historyMessage.push(`Product ${productId}# Price added with barcode ${priceDetail.barcode.trim()}`)
                    historyMessage.push(`Product ${productId}# Price added with Cost Price ${Currency.IndianFormat(priceDetail?.cost_price)}`)
                    historyMessage.push(`Product ${productId}# Price added with mrp ${Currency.IndianFormat(priceDetail?.mrp)}`)
                    historyMessage.push(`Product ${productId}# Price added with Sale Price ${Currency.IndianFormat(priceDetail?.sale_price)}`)
                    historyMessage.push(`Product ${productId}# Price added with Date ${DateTime.shortMonthDate(priceDetail?.date)}\n`);
                    historyMessage.push(`Product ${productId}# Price added with Status ${activeStatus?.name}\n`);
                    historyMessage.push(`Product ${productId}# Price added with discount percentage ${priceDetail?.discount_percentage}`)
                    historyMessage.push(`Product ${productId}# Price added with default ${priceDetail?.is_default}`)

                if (priceDetail && priceDetail.is_default == ProductPrice.IS_DEFAULT) {
                    await this.updateIsDefault(priceDetail?.id, priceDetail?.product_id, companyId);
                }
                let productPriceDataExist = await productPriceService.find({
                    where: {
                        product_id: productId,
                        mrp: mrp,
                        sale_price: salePrice,
                        barcode: barcode,
                        company_id: companyId,
                    },
                    order,
                });


                if (productPriceDataExist && productPriceDataExist.length > 0) {

                    let priceIds = productPriceDataExist.map((value) => value.id);


                    let inActiveStatus = await StatusService.Get(ObjectName.PRODUCT_PRICE, null, companyId, {
                        is_active_price: ProductPrice.STATUS_INACTIVE,
                    });



                    // single data
                    if (productPriceDataExist && productPriceDataExist.length == 1) {
                        if (updateDefault) {

                            let updatedData = await productPriceService.update(
                                {
                                    is_default: updateDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT,
                                    status: activeStatus && activeStatus?.id,
                                },
                                { where: { id: productPriceDataExist[0].id }, returning: true, plain: true }
                            );

                                historyMessage.push(`Product ${productId}# Price changed to default ${updateDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT}`)
                                historyMessage.push(`Product ${productId}# Price Status  changed to ${activeStatus?.name}\n`);

                            if (updatedData[1] && updatedData[1].is_default == ProductPrice.IS_DEFAULT) {
                                await this.updateIsDefault(updatedData[1]?.id, productId, companyId);
                            }
                        }
                    }

                    let duplicatesPriceIds = priceIds.filter((value) => value !== productPriceDataExist[0].id);

                    // multiple data
                    if (productPriceDataExist && productPriceDataExist.length > 1) {


                        if (updateDefault) {
                            let updatedData = await productPriceService.update(
                                {
                                    is_default: ProductPrice.IS_DEFAULT,
                                    status: activeStatus && activeStatus?.id,
                                },
                                { where: { id: productPriceDataExist[0].id }, returning: true, plain: true }
                            );

                            historyMessage.push(`Product ${productId}# Price changed to default ${ProductPrice.IS_DEFAULT}`)
                            historyMessage.push(`Product ${productId}# Price Status  changed to ${activeStatus?.name}\n`);

                            if (updatedData[1] && updatedData[1].is_default == ProductPrice.IS_DEFAULT) {
                                await this.updateIsDefault(updatedData[1]?.id, productId, companyId);
                            }


                            await productPriceService.update({ status: inActiveStatus?.id }, { where: { id: duplicatesPriceIds } });

                            historyMessage.push(`Product ${productId}# duplicate price Status  changed to ${inActiveStatus?.name}\n`);
                        } else {

                            let updatedData = await productPriceService.update(
                                {
                                    is_default: ProductPrice.IS_DEFAULT,
                                    status: activeStatus && activeStatus?.id,
                                },
                                { where: { id: mostRecentPrice[0].id }, returning: true, plain: true }
                            );
                            historyMessage.push(`Product ${productId}# Price changed to default ${ProductPrice.IS_DEFAULT}`)
                            historyMessage.push(`Product ${productId}# Price Status  changed to ${activeStatus?.name}\n`);

                            if (updatedData[1] && updatedData[1].is_default == ProductPrice.IS_DEFAULT) {
                                await this.updateIsDefault(updatedData[1]?.id, productId, companyId);
                            }


                            await productPriceService.update({ status: inActiveStatus?.id }, { where: { id: duplicatesPriceIds } });
                            historyMessage.push(`Product ${productId}# duplicate price Status  changed to ${inActiveStatus?.name}\n`);
                        }
                    }

                    return { productId: productId,historyMessage:historyMessage };
                }
                return { productId: priceDetail?.product_id ,historyMessage:historyMessage};
            }

            let productPriceDataExist = await productPriceService.find({
                where: {
                    product_id: productId,
                    mrp: mrp,
                    sale_price: salePrice,
                    barcode: barcode,
                    company_id: companyId,
                    cost_price: unitPrice,
                },
                order,
            });


            if (productPriceDataExist && productPriceDataExist.length > 0) {

                let priceIds = productPriceDataExist.map((value) => value.id);


                let inActiveStatus = await StatusService.Get(ObjectName.PRODUCT_PRICE, null, companyId, {
                    is_active_price: ProductPrice.STATUS_INACTIVE,
                });



                // single data
                if (productPriceDataExist && productPriceDataExist.length == 1) {
                    if (updateDefault) {

                        let updatedData = await productPriceService.update(
                            {
                                is_default: updateDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT,
                                status: activeStatus && activeStatus?.id,
                            },
                            { where: { id: productPriceDataExist[0].id }, returning: true, plain: true }
                        );

                        historyMessage.push(`Product ${productId}# Price changed to default ${updateDefault ? ProductPrice.IS_DEFAULT : ProductPrice.IS_NOT_DEFAULT}`)
                        historyMessage.push(`Product ${productId}# Price Status  changed to ${activeStatus?.name}\n`);

                        if (updatedData[1] && updatedData[1].is_default == ProductPrice.IS_DEFAULT) {
                            await this.updateIsDefault(updatedData[1]?.id, productId, companyId);
                        }
                    }
                }

                let duplicatesPriceIds = priceIds.filter((value) => value !== productPriceDataExist[0].id);

                // multiple data
                if (productPriceDataExist && productPriceDataExist.length > 1) {


                    if (updateDefault) {
                        let updatedData = await productPriceService.update(
                            {
                                is_default: ProductPrice.IS_DEFAULT,
                                status: activeStatus && activeStatus?.id,
                            },
                            { where: { id: productPriceDataExist[0].id }, returning: true, plain: true }
                        );
                        historyMessage.push(`Product ${productId}# Price changed to default ${ProductPrice.IS_DEFAULT}`)
                            historyMessage.push(`Product ${productId}# Price Status  changed to ${activeStatus?.name}\n`);

                        if (updatedData[1] && updatedData[1].is_default == ProductPrice.IS_DEFAULT) {
                            await this.updateIsDefault(updatedData[1]?.id, productId, companyId);
                        }


                        await productPriceService.update({ status: inActiveStatus?.id }, { where: { id: duplicatesPriceIds } });
                        historyMessage.push(`Product ${productId}# duplicate price Status  changed to ${inActiveStatus?.name}\n`);

                    } else {

                        let updatedData = await productPriceService.update(
                            {
                                is_default: ProductPrice.IS_DEFAULT,
                                status: activeStatus && activeStatus?.id,
                            },
                            { where: { id: mostRecentPrice[0].id }, returning: true, plain: true }
                        );
                        historyMessage.push(`Product ${productId}# Price changed to default ${ProductPrice.IS_DEFAULT}`)
                        historyMessage.push(`Product ${productId}# Price Status  changed to ${activeStatus?.name}\n`);
                        if (updatedData[1] && updatedData[1].is_default == ProductPrice.IS_DEFAULT) {
                            await this.updateIsDefault(updatedData[1]?.id, productId, companyId);
                        }


                        await productPriceService.update({ status: inActiveStatus?.id }, { where: { id: duplicatesPriceIds } });
                        historyMessage.push(`Product ${productId}# duplicate price Status  changed to ${inActiveStatus?.name}\n`);

                    }
                }
              
                return { productId: productId, historyMessage:historyMessage };
            }
        } catch (err) {
            throw err;
        }
    }

    static async getProductIds(value, companyId) {

        try {
            let productIds = [];
            if (value !== null) {
                let productPriceList = await productPriceService.find({
                    where: { company_id: companyId, barcode: value },
                });


                if (productPriceList && productPriceList.length > 0) {
                    productIds = productPriceList.map((data) => {
                        return Number.Get(data.product_id);
                    });

                    // Returning only unique product IDs
                    productIds = Array.from(new Set(productIds));
                }

            }
            return productIds;
        } catch (err) {
            console.log(err);
        }
    };

    static async Reindex(companyId) {

        const productPrices = await ProductPriceModel.findAll({
            where: {
                company_id: companyId
            }
        });

        if (productPrices && productPrices.length > 0) {
            await Promise.all(productPrices.map(async (productPrice) => {
                const mrp = productPrice?.mrp;
                const costPrice = productPrice?.cost_price;

                const marginAmount = mrp - costPrice;
                const marginPercentage = (marginAmount / mrp) * 100;

                // Update the record
                await productPrice.update({
                    margin_amount: marginAmount,
                    margin_percentage: marginPercentage
                });
            }));
        }

    }

    static async get(req, res, next) {
        let id = req.params?.id;
        
        let companyId = Request.GetCompanyId(req);


        let productPriceDetail = await ProductPriceModel.findOne({
            where: {
                id: id,
                company_id: companyId
            }
        })

        if (!productPriceDetail) {
            return res.json(Response.BAD_REQUEST, { message: "Product Price not Found" })
        }

        res.json(Response.OK, {
            data: productPriceDetail
        })
    }
}

module.exports = ProductPriceService;
