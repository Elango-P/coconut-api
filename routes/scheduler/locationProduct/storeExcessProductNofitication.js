
const Request = require("../../../lib/request");

const storeProductQuantityEmailService = require("../../../services/StoreProductQuantityNotificationService");
const StoreService = require("../../../services/LocationService");
const locationProductService = require("../../../services/locationProductService");
const ProductService = require("../../../services/ProductService");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const Response = require("../../../helpers/Response");
const { SchedulerJob } = require('../../../db').models;
const errors = require("restify-errors");



module.exports = async (req, res) => {

    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
        companyId = req.query.companyId
    }

    let id = req.query.id;

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

    res.send(Response.OK, { message: `${schedularData?.name} Job Started` });

    // systemLog

    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

    let toMail = schedularData?.to_email

    let params = { companyId: companyId, id: id, toMail: toMail };

    res.on("finish", async () => {
        try {

            await schedulerJobCompanyService.setStatusStarted(params, err => {
                if (err) {
                    throw new err();
                }
            });
            if (companyId) { // get store lsit
                const storeList = await StoreService.search(companyId)

                let sendData = new Array();

                // validate store list length
                if (storeList && storeList.length > 0) {
                    for (let i = 0; i < storeList.length; i++) {
                        const { name, id } = storeList[i];

                        const locationData = await locationProductService.search(companyId, id)

                        let updateData = new Array();

                        let data = {}
                        for (let k = 0; k < locationData.length; k++) {

                            const { max_quantity, product_id, quantity } = locationData[k];

                            let productData = await ProductService.getDetail(product_id, companyId)

                            if (quantity >= max_quantity) {
                                data = {
                                    quantity: quantity - max_quantity,
                                    product_id: product_id,
                                    productName: productData?.product_display_name

                                }
                                let minData = {
                                    ...data
                                }
                                updateData.push(minData)
                            }
                        }
                        if (data && data.product_id > 0)
                            sendData.push({ locationName: name, data: updateData })
                    }

                    if (!schedularData?.to_email) {
                        throw new errors.NotFoundError('To Mail Not Found');
                    }
                    else {
                        toMail = toMail.split(",");
                    }

                    if (toMail.length > 0 && toMail !== null, sendData.length > 0) {
                        storeProductQuantityEmailService.sendMail(params, {
                            storeProductData: sendData
                        }, () => { });
                    } else {
                        await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
                            if (err) {
                                throw new err();
                            }
                        });
                    }
                }
            }
        } catch (err) {
            console.log(err);

            await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });
        }
    })


};
