const errors = require('restify-errors');

// Utils
const utils = require('../../lib/utils');

// Models
const { Purchase } = require('../../db').models;
const {
  PurchaseMedia,
  Media,
  account: accountModel,
  status: statusModel,
  Location,
  Bill,
  PurchaseProduct,
  ProductPrice: ProductPriceModel,
  AccountProductModel,
  product,
  User: userModel,
  productIndex,
  storeProduct,
} = require('../../db').models;
const MediaService = require('../../services/media');
const { ACTIVE } = require('../../helpers/Account');

// Slack Notification
const accountNotificationService = require('../../services/notifications/account');

const Request = require('../../lib/request');
const ObjectName = require('../../helpers/ObjectName');
const History = require('../../services/HistoryService');
const AddressService = require('../../services/AddressService');

const validator = require('../../lib/validator');
const s3 = require('../../lib/s3');

const purchaseService = require('../../services/PurchaseService');
const accountService = require('../../services/AccountService');
const userService = require('../../services/UserService');
const statusService = require('../../services/StatusService');

const { isExistById } = require('../../services/LocationService');

const String = require('../../lib/string');

const { getPageDetails } = require('../../lib/utils');
const accountsPurchase = require('../../routes/purchase/processList');

const { Op, Sequelize } = require('sequelize');
const { BAD_REQUEST } = require('../../helpers/Response');
const {
  settingService,
  getSettingValue,
  getSettingValueByObject,
} = require('../../services/SettingService');

const fs = require('fs');
const path = require('path');
const Boolean = require('../../lib/Boolean');
const StatusService = require('../../services/StatusService');
const mediaService = require('../../services/MediaService');
const Response = require('../../helpers/Response');
const UserService = require('../../services/UserService');
const DateTime = require('../../lib/dateTime');
const Status = require('../../helpers/Status');
const Number = require('../../lib/Number');
const ProductService = require('./ProductService');
const ProductPriceService = require('../ProductPriceService');
const {
  sendPurchaseDueDateChangeNotification,
  sendPurchaseOwnerChangeNotification,
} = require('../notifications/purchase');
const Account = require("../../helpers/Account");
const { Type } = require("../../helpers/Purchase");
const PurchaseProductService = require("./PurchaseProductService");
const { reindex } = require('../ProductService');
const Setting = require("../../helpers/Setting");
const ObjectHelper = require("../../helpers/ObjectHelper");
const history = require("../../services/HistoryService");

class PurchaseService {
  static async create(req, res, next) {
    try {
      //get body from request
      const data = req.body;

      //get image from request
      const image = req && req.files;
      const imageNames = data && data.imageName && JSON.parse(data.imageName);
      const storeId = data && data.location;
      //get bill date

      //get company Id from request
      const company_id = Request.GetCompanyId(req);
      const vendor_name = data.vendor_name;
      const vendor_id = data.vendor_id;

      //validate date exist or not
      if (!data.date) {
        return next(new errors.BadRequestError('Date is required'));
      }
      let query = {
        order: [['createdAt', 'DESC']],
        where: { company_id },
        attributes: ['purchase_number'],
      };
      let purchaseData = await Purchase.findOne(query);
      let purchase_number;
      let purchaseNumberData = purchaseData && purchaseData.get('purchase_number');

      if (!purchaseNumberData) {
        purchase_number = 1;
      } else {
        purchase_number = parseInt(purchaseNumberData) + 1;
      }

      const status = await StatusService.getFirstStatusDetail(ObjectName.PURCHASE, company_id);

      let createData = new Object();

      createData.purchase_number = purchase_number;
      createData.description = data.description;
      createData.status = status ? status.id : null;
      createData.company_id = req.user.company_id;
      createData.purchase_date = data && data.date || null;
      createData.store_id = storeId;
      createData.vendor_bill_number = data.vendor_bill_number;
      createData.net_amount = data.net_amount;
      createData.vendor_invoice_number = data.vendor_invoice_number;
      (createData.owner_id = data && data?.owner ? Number.Get(data?.owner) : req.user.id),
        (createData.vendor_invoice_date = data.vendor_invoice_date || null);
      createData.due_date = status && status.due_date ? status.due_date : data.due_date;
      createData.returned_items_amount = data?.returnedItemAmount ? data?.returnedItemAmount : null;
      createData.invoice_amount = data?.invoice_amount ? data?.invoice_amount : null;
      (createData.reviewer_id = data?.reviewer ? data?.reviewer : null)

      //validate account name exist or not
      if (vendor_name) {
        let isVendorExist = await accountModel.findOne({
          where: { name: vendor_name, company_id },
        });
        createData.vendor_name = data.vendor_name;
        createData.vendor_id = isVendorExist.id;
        try {
          if (!isVendorExist) {
            await accountModel.create({
              company_id,
              status: ACTIVE,
              storeId,
            });
          }
        } catch (err) { }
      } else if (vendor_id) {
        createData.vendor_id = data?.vendor_id;
      }
      Purchase.create(createData)
        .then(async (purchase) => {
          let mediaDetails;
          // if image more than one
          if (image && image.length > 0) {
            let imageDetail = [];
            image.forEach(async (result) => {
              imageDetail.push({
                name: result.name,
                path: result.path,
              });
            });

            for (let data of imageDetail) {
              let imgData = {
                file_name: data.name,
                company_id: company_id,
              };

              // create media
              if (imgData) {
                mediaDetails = await Media.create(imgData);
              }

              let PurchaseMediaData;
              if (!mediaDetails) {
                PurchaseMediaData.media_id = mediaDetails.id;
                PurchaseMediaData.bill_id = purchase.id;
                PurchaseMediaData.company_id = company_id;
              }

              // create bill medial
              await PurchaseMedia.create({
                PurchaseMediaData,
              }).then(async () => {
                // upload to s3
                await MediaService.uploadMedia(`${data.path}`, mediaDetails.id, mediaDetails.file_name, false);
              });
            }
            res.json(201, {
              message: 'Account Bills Added',
            });
          } else {
            // if image is one
            const imageData = {
              file_name: imageNames && imageNames.length > 0 ? imageNames[0].name : null,
              company_id: company_id,
            };
            // create media
            if (imageData) {
              mediaDetails = await Media.create(imageData);
            }

            let PurchaseMediaData;
            if (!mediaDetails) {
              PurchaseMediaData.media_id = mediaDetails.id;
              PurchaseMediaData.bill_id = purchase.id;
              PurchaseMediaData.company_id = company_id;
            }

            // create bill media table
            PurchaseMediaData &&
              PurchaseMedia.create({
                PurchaseMediaData,
              }).then((PurchaseMedia) => {
                // upload to s3
                MediaService.uploadMedia(`${image.path}`, mediaDetails.id, mediaDetails.file_name, false);
              });
            res.on('finish', async () => {
              this.createAuditLog(createData, req, purchase?.id);
            });
            res.json(201, {
              purchase,
            });
          }
          if (!image && purchase) {
            res.json(201, {
              message: 'Purchase Added',
            });
            res.on('finish', async () => {
              this.createAuditLog(createData, req, purchase?.id);
            });
          }

          //send slack message for bill
          accountNotificationService.sendAddBillNotification(company_id, () => { });
        })
        .catch((err) => {
          req.log.error(err);
          return next(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  static delete(req, res, next) {
    try {
      const id = req.params.id;
      const company_id = Request.GetCompanyId(req);

      if (!validator.isInteger(id)) {
        return next(new errors.BadRequestError('Invalid Account Purchase id'));
      }

      Purchase.findOne({
        attributes: ['id', 'purchase_number', 'purchase_date', 'description', 'amount', 'file'],
        where: { id, company_id },
      }).then((accountbill) => {
        if (!accountbill) {
          res.on('finish', async () => {
            History.create(`Account Purchase not found`, req, ObjectName.PURCHASE, id);
          });

          return next(new errors.NotFoundError('Account Purchase not found'));
        }

        Purchase.destroy({
          where: { id: accountbill.id, company_id },
        })
          .then(() => {
            s3.delFile(`media/accounts-bill/${accountbill.file}`, (err) => {
              if (err) {
                return next(err);
              }
              res.json({ message: 'Purchase Deleted' });
              res.on('finish', async () => {
                History.create("Purchase Deleted", req, ObjectName.PURCHASE, id);
              });
            });
          })
          .catch((err) => {
            console.log(err);
            req.log.error(err);
            return next(err);
          });
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async get(params, res) {
    try {
      let { companyId, purchaseId } = params

      if (!purchaseId) {
        return res.json(400, { message: ' Purchase Id is required' });
      }

      let purchaseDetails = await purchaseService.get(purchaseId, companyId);

      if (!purchaseDetails) {
        return res.json(400, { message: ' Purchase not found' });
      }

      let vendorDetails;
      let marginData
      if (purchaseDetails.vendor_id) {
        vendorDetails = await accountService.get(purchaseDetails.vendor_id, companyId);
        marginData = await PurchaseProductService.getCount(purchaseId, companyId, purchaseDetails.vendor_id);
      }
      let ownerDetails;
      if (purchaseDetails.owner_id) {
        ownerDetails = await userService.get(purchaseDetails.owner_id, companyId);
      }

      if (purchaseDetails.store_id) {
        let locationDetails = await isExistById(purchaseDetails.store_id);
        purchaseDetails.location_name = await locationDetails?.name;
      }

      const statusData = await statusService.getData(purchaseDetails?.status, companyId);
      let mediaDetail = await mediaService.getMediaURLByObjectId(purchaseId, ObjectName.PURCHASE, companyId);
      let billData = await Bill.findOne({ where: { id: purchaseDetails.bill_id, company_id: companyId } });

      let marginMistached;
      let marginCount;
      let marginMatched;

      marginMistached =
        marginData && marginData.mismatchCount > 1
          ? `${marginData.mismatchCount} product margins are not matched`
          : marginData && marginData.mismatchCount == 1
            ? `${marginData.mismatchCount} product margin is not matched`
            : ``;
      marginCount = marginData && marginData.mismatchCount >= 0 ? marginData && marginData.mismatchCount : 0
      if (marginData && marginData.mismatchCount == 0 && marginData.productCount > 1) {
        marginMatched = " All Products Margins are Matched."
      }
      let settingData = await getSettingValueByObject(Setting.INVOICE_LINE_ITEM_AMOUNT_INCLUDES_TAX, companyId, vendorDetails && vendorDetails.id, ObjectName.ACCOUNT);

      let billingAddress = await AddressService.list({ companyId: companyId, objectName: ObjectName.COMPANY })
      let billingOption = [];
      if (billingAddress && billingAddress.length > 0) {
        for (let i = 0; i < billingAddress.length; i++) {
          const title = String.Get(billingAddress[i].title);
          const name = billingAddress[i].name ? String.Get(billingAddress[i].name) : '';
          const label = name ? `${title}, (${name})` : title;
          billingOption.push({ label, value: billingAddress[i].id });
        }
      }

      let billingName = billingOption.find(value => value.value == vendorDetails.billing_name)
      return {
        data: purchaseDetails,
        statusName: statusData?.name,
        statusValue: statusData?.id,
        bill_id: billData?.id ? billData?.id : '',
        vendor_name: vendorDetails && vendorDetails.name ? vendorDetails.name : '',
        vendor_id: vendorDetails && vendorDetails.id ? vendorDetails.id : '',
        ownerName: ownerDetails && String.concatName(ownerDetails.name, ownerDetails.last_name),
        media_url: mediaDetail && mediaDetail.media_url,
        mediaName: mediaDetail && mediaDetail.detail && mediaDetail.detail.name,
        mediaId: mediaDetail && mediaDetail.detail && mediaDetail.detail.id,
        marginMistachedText: marginData && marginData.productCount > 0 ? marginMistached : "",
        marginMismatchedCount: marginData && marginData.productCount > 0 ? marginCount : "",
        payment_terms: vendorDetails && vendorDetails.payment_terms ? vendorDetails.payment_terms : '',
        return_terms: vendorDetails && vendorDetails.return_terms ? vendorDetails.return_terms : '',
        invoiceLineItemAmountIncludesTax: settingData == "" ? "false" : settingData,
        billingOption: billingOption,
        billing_name: billingName ? billingName.label : "",
        cash_discount_percentage: vendorDetails && vendorDetails.cash_discount ? vendorDetails.cash_discount : "",
        reviewer: purchaseDetails?.reviewer_id ? purchaseDetails?.reviewer_id : "",
        productCount: marginData && marginData.productCount,
        marginMatchedText: marginMatched ? marginMatched : ""


      }
    } catch (err) {
      console.log(err);
    }
  }

  static async search(params, res) {
    try {
      let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        status,
        pagination,
        vendor,
        bill_id,
        companyId,
        account,
        startDate,
        endDate,
        excludeStatus,
        userId,
        purchase_manage_others,
        showTotal
      } = params;

      const where = new Object();

      if (vendor) {
        where.vendor_id = vendor;
      }

      if (page && pageSize) {
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
      }

      if (purchase_manage_others == false) {
        where.owner_id = userId;
      }

      if (account && parseInt(account)) {
        where.vendor_id = account;
      }

      if (excludeStatus) {
        where.status = {
          [Op.notIn]: [excludeStatus],
        };
      }

      if (startDate && !endDate) {
        where.purchase_date = {
          [Op.and]: {
            [Op.gte]: startDate,
          },
        };
      }

      if (!startDate && endDate) {
        where.purchase_date = {
          [Op.and]: {
            [Op.lte]: endDate,
          },
        };
      }

      if (startDate && endDate) {
        where.purchase_date = {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        };
      }

      if (companyId) {
        where.company_id = companyId;
      }

      // Sortable Fields
      const validOrder = ['ASC', 'DESC'];
      const sortableFields = {
        id: 'id',
        name: 'name',
        purchase_number: 'purchase_number',
        due_date: 'due_date',
        status: 'status',
        purchase_date: 'purchase_date',
        amount: 'amount',
        description: 'description',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        vendor_name: 'name',
        vendor_invoice_date: "vendor_invoice_date",
        owner_id: "name",
      };

      const sortParam = sort ? sort : "purchase_date";

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, {
          message: `Unable to sort product by ${sortParam}`,
        });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
      }

      if (search) {
        // Search term
        const searchTerm = search ? search.trim() : null;
        if (searchTerm) {
          where[Op.or] = [
            { purchase_number: { [Op.iLike]: `%${searchTerm}%` } },
            { description: { [Op.iLike]: `%${searchTerm}%` } },
            {
              '$account.name$': {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
            {
              '$location.name$': {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
            { vendor_invoice_number: { [Op.iLike]: `%${searchTerm}%` } },
          ];
        }
      }

      if (bill_id) {
        where.bill_id = bill_id;
      }

      if (status) {
        where.status = status;
      }

      page = page ? parseInt(page, 10) : 1;

      if (isNaN(page)) {
        return next(new errors.BadRequestError('Invalid page'));
      }

      pageSize = pageSize ? parseInt(pageSize, 10) : 25;

      if (isNaN(pageSize)) {
        return next(new errors.BadRequestError('Invalid page size'));
      }

      const order = [];

      if (sortParam === 'purchase_date') {
        order.push(['purchase_date', sortDirParam], ['id', sortDirParam]);
      } else if (sortParam === 'vendor_name') {
        order.push([
          { model: accountModel, as: 'account' },
          'name',
          sortDirParam,
        ]);
      } else if (sort === 'owner_id') {
        order.push([
          { model: userModel, as: 'UserDetails' },
          'name',
          sortDirParam,
        ]);
      } else if (
        sortParam !== 'vendor_name' &&
        sortParam !== 'purchase_date' &&
        sort
      ) {
        order.push([sortParam, sortDirParam]);
      }

      const query = {
        attributes: { exclude: ['deletedAt'] },
        include: [
          {
            required: true,
            model: accountModel,
            as: 'account',
          },
          {
            required: true,
            model: Location,
            as: 'location',
          },
          {
            required: false,
            model: statusModel,
            as: 'statusDetail',
          },
          {
            required: false,
            model: userModel,
            as: 'UserDetails',
          },
          {
            required: false,
            model: userModel,
            as: 'UserData',
          },
        ],
        order: order,
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

      // Total Amount start
      const totalAmountQuery = {
        order:
          sort !== 'vendor_name'
            ? [[sortParam, sortDirParam]]
            : [[{ model: accountModel, as: 'account' }, 'name', sortDir]],
        include: [
          {
            required: true,
            model: accountModel,
            as: 'account',
          },
          {
            required: true,
            model: Location,
            as: 'location',
          },
        ],
        where,
      };

      let totalAmount = 0;

      const purchaseAmount = await Purchase.findAndCountAll(totalAmountQuery);

      purchaseAmount.rows.forEach((value) => {
        totalAmount += Number.Get(value.get('net_amount'));
      });

      let data = await Promise.all([Purchase.findAndCountAll(query)])
        .then(async ([accountpurchase]) => {
          const accountspurchaseList = [];
          // accountpurchase.rows.forEach(async(accountspurchase) => {
          for (let index = 0; index < accountpurchase.rows.length; index++) {
            if (accountpurchase.rows[index].store_id) {
              let locationDetails = await isExistById(
                accountpurchase.rows[index].store_id
              );
              accountpurchase.rows[index].location_name =
                await locationDetails?.name;
            }
            accountspurchaseList.push(
              accountsPurchase(accountpurchase.rows[index])
            );
          }

          if (showTotal) {
            let lastReCord = ObjectHelper.createEmptyRecord(accountspurchaseList[0])
            lastReCord.net_amount = totalAmount || "";
            accountspurchaseList.push(lastReCord);
          }

          // eslint-disable-next-line no-unused-vars
          const { accountspurchase } = getPageDetails();
          const { count, currentPage, lastPage, pageStart, pageEnd } =
            getPageDetails(
              accountpurchase.count,
              page,
              pageSize,
              accountspurchaseList.length
            );

          return {
            totalCount: accountpurchase.count,
            accountspurchase: accountspurchaseList,
            data: accountspurchaseList,
            currentPage: page,
            totalAmount,
            pageSize,
            lastPage,
            pageStart,
            pageEnd,
          };
        })
        .catch((err) => {
          req.log.error(err);
          next(err);
        });
      return data && data;
    } catch (err) {
      console.log(err);
    }
  }

  static updateMedia(purchaseNumber, mediaName, image, data, callback) {
    if (image) {
      const mediaFileName = `${data.purchaseNumber}${utils.getExtensionByType(image.type) ? `.${utils.getExtensionByType(image.type)}` : path.extname(mediaName)
        }`;
      const mediaUploadPath = `media/accounts-purchase/${mediaFileName}`;

      if (image && image.name) {
        s3.delFile(`media/accounts-purchase/${mediaName}`, (err) => {
          if (err) {
            return callback(err);
          }

          s3.uploadFile(image.path, mediaUploadPath, (err) => {
            if (err) {
              return callback(err);
            }

            fs.unlink(image.path, () => callback(null, mediaFileName));
          });
        });
      } else {
        s3.renameFile(`media/accounts-purchase/${mediaName}`, mediaUploadPath, (err) => {
          if (err) {
            return callback(err);
          }

          return callback(null, mediaFileName);
        });
      }
    } else {
      return callback(null, null);
    }
  }

  static getAccountpurchase(oldpurchaseNumber, newBillNumber, callback) {
    if (oldpurchaseNumber && newBillNumber) {
      const old_value = [];
      const new_value = [];
      if (oldpurchaseNumber.purchaseNumber !== newBillNumber.purchaseNumber) {
        old_value.push(oldpurchaseNumber.purchaseNumber);
        new_value.push(newBillNumber.purchaseNumber);
      }
      newBillNumber.field = 'purchase Number';
      newBillNumber.purchaseNumber = oldpurchaseNumber.purchaseNumber;
      newBillNumber.original_value = old_value.join(',');
      newBillNumber.new_value = new_value.join(',');
      return callback(null, newBillNumber);
    }
    return callback();
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const id = req.params.id;
      const status = data?.status;
      const purchaseNumber = data?.purchaseNumber;
      const description = data?.description;
      const purchaseDate = data?.date;
      const vendor_invoice_date = data?.vendor_invoice_date;
      const dueDate = data?.due_date;
      const orderNumber = parseInt(data?.order_number) || null;
      const paymentType = data?.payment_type;
      const paymentTerm = data?.payment_term;
      // const vendorName = data?.vendor_name;
      const vendor_id = data?.vendor_id;
      const location = data?.location;
      const vendor_invoice_number = data?.vendor_invoice_number == 0 ? '' : data?.vendor_invoice_number;
      const image = req.files && req.files.image;
      let companyId = Request.GetCompanyId(req)
      let updateData = {};

      if (data && data?.status || data?.status === "") {
        updateData.status = status;
      }

      if (data && data?.purchaseNumber || data?.purchaseNumber === "") {
        updateData.purchaseNumber = purchaseNumber ? purchaseNumber : null;
      }


      if (data && data?.description || data?.description === "") {
        updateData.description = description;
      }

      if (data && data?.date || data?.date !== "") {
        updateData.purchase_date = purchaseDate;
      }

      if (data && data?.vendor_invoice_date || data?.vendor_invoice_date !== "") {
        updateData.vendor_invoice_date = vendor_invoice_date;
      }

      if (data && data?.due_date !== "") {
        updateData.due_date = dueDate ? dueDate : null;
      }

      if (data && data?.order_number || data?.order_number === "") {
        updateData.order_number = orderNumber;
      }

      if (data && data?.payment_type || data?.payment_type === "") {
        updateData.payment_type = paymentType;
      }

      if (data && data?.payment_term || data?.payment_term === "") {
        updateData.payment_term = paymentTerm;
      }

      if (data && data?.vendor_id || data?.vendor_id === "") {
        updateData.vendor_id = vendor_id;
      }


      if (data && data?.location || data?.location === "") {
        updateData.store_id = location;
      }

      if (data && data?.vendor_invoice_number || data?.vendor_invoice_number === "") {
        updateData.vendor_invoice_number = vendor_invoice_number ? vendor_invoice_number : null;
      }


      if (data && data?.notes || data?.notes === "") {
        updateData.notes = data?.notes;
      }

      if (Number.isNotNull(data?.owner) || Number.isNotNull(data?.user)) {
        updateData.owner_id = data?.owner || data?.user;
      }
      if (validator.isKeyAvailable(data, "reviewer")) {
        updateData.reviewer_id = Number.isNotNull(data?.reviewer) ? data?.reviewer : null;
      }

      if (data && data?.returnedItemAmount || data?.returnedItemAmount === "") {
        updateData.returned_items_amount = data?.returnedItemAmount ? Number.GetFloat(data?.returnedItemAmount) : null;
      }



      if (data && data?.invoice_amount || data?.invoice_amount === "") {
        updateData.invoice_amount = data?.invoice_amount ? data?.invoice_amount : null;
      }






      data.purchaseNumber = data.purchaseNumber && utils.ucFirst(data.purchaseNumber);

      Purchase.findOne({
        where: { id, company_id: companyId },
      }).then((accountpurchase) => {
        if (!accountpurchase) {
          return next(new errors.NotFoundError('  Purchase not found'));
        }

        let invoice_amount = data?.invoice_amount === "" ? "" : data?.invoice_amount ? data?.invoice_amount : accountpurchase?.invoice_amount;
        let returned_items_amount = data?.returnedItemAmount === "" ? 0 : data?.returnedItemAmount ? data?.returnedItemAmount : accountpurchase?.returned_items_amount ? accountpurchase?.returned_items_amount : 0
        let minusAmount = Number.GetFloat(returned_items_amount)

        let netAmount = invoice_amount && invoice_amount !== "" && invoice_amount !== 0 && Number.GetFloat(invoice_amount) > Number.GetFloat(minusAmount) ? Number.GetFloat(invoice_amount) - Number.GetFloat(minusAmount) : null


        PurchaseService.updateMedia(
          accountpurchase.purchase_number,
          accountpurchase.file,
          image,
          data,
          (err, updatedFileName) => {
            if (err) {
              return next(err);
            }
            // eslint-disable-next-line no-unused-vars
            this.getAccountpurchase(accountpurchase, data, (err, accountpurchaseDate) => {
              Purchase.update({ ...updateData, file: updatedFileName, net_amount: netAmount }, { where: { id, company_id: companyId } })
                .then(() => {
                  res.json({ message: 'Purchase Updated' });
                  res.on('finish', async () => {
                    if (data?.due_date) {
                      await sendPurchaseDueDateChangeNotification({ company_id: companyId, user_id: accountpurchase?.owner_id, due_date: DateTime.shortMonthDate(data?.due_date), purchase_id: id })
                    }
                    if (data?.owner || data?.user) {
                      await sendPurchaseOwnerChangeNotification({ company_id: companyId, user_id: data?.owner ? data?.owner : data?.user, purchase_id: id })
                    }
                    this.updateAuditLog(updateData, accountpurchase, req, id);
                  });
                })
                .catch((err) => {
                  console.log(err);
                  req.log.error(err);
                  return next(err);
                });
            });
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async updateProductStatus(req, res, next) {
    const data = req.body;

    const { id } = req.params;
    let company_id = Request.GetCompanyId(req);
    // Validate Vendor id
    if (!id) {
      return res.json(Response.BAD_REQUEST, { message: 'Purchase Product id is required' });
    }

    // Update Vendor status
    const updateStatus = {
      status: data.status,
    };

    let purchaseProductData = await PurchaseProduct.findOne({
      where: { id: id, company_id: company_id }
    });
    try {
      const save = await PurchaseProduct.update(updateStatus, { where: { id: id, company_id } });

      let statusData = await statusService.getData(data.status, company_id);


      let purchaseData = await Purchase.findOne({ where: { id: purchaseProductData.purchase_id, company_id: company_id } });

      if (!purchaseData) {
        return res.json(Response.BAD_REQUEST, { message: 'Purchase id is required' });
      }
      let historyMessage;


      if (purchaseProductData && purchaseProductData?.status !== data.status) {
        if (statusData && statusData.update_account_product == Status.UPDATE_ACCOUNT_PRODUCT_ENABLED) {

          let accountProductExists = await AccountProductModel.findOne({
            where: {
              product_id: purchaseProductData.product_id,
              account_id: purchaseData && purchaseData.vendor_id,
              company_id: company_id,
            },
          });

          if (!accountProductExists) {
            await AccountProductModel.create({
              company_id: company_id,
              product_id: purchaseProductData.product_id,
              account_id: purchaseData && purchaseData.vendor_id,

            });
          }
        }
        if (statusData && statusData.update_product_price == Status.UPDATE_PRODUCT_PRICE_ENABLED) {

          let param = {
            productId: purchaseProductData && purchaseProductData.product_id,
            companyId: company_id,
            unitPrice: purchaseProductData && purchaseProductData.unit_price,
            marginAmount: purchaseProductData && purchaseProductData.unit_margin_amount,
            barcode: purchaseProductData && purchaseProductData.barcode,
            mrp: purchaseProductData && purchaseProductData.mrp,
            date: purchaseData && purchaseData.purchase_date

          }

          let response = await ProductPriceService.updatePrice(param)

          historyMessage = response?.historyMessage

          await reindex(response?.productId, company_id);

        }

        if (statusData && statusData.update_quantity_in_location_product == Status.UPDATE_QUANTITY_IN_LOCATION_PRODUCT_ENABLED) {
          let getProductDetail = await ProductService.getProductDetailsById(purchaseProductData && purchaseProductData.product_id, company_id);

          let packSize = parseInt(getProductDetail?.pack_size, 10) || 1;


          let isStoreProductExist = await storeProduct.findOne({ where: { store_id: purchaseData.store_id, product_id: purchaseProductData.product_id } })

          if (isStoreProductExist) {
            let updatedQuantity;

            //Multiply quantity with pack size
            let packSizeQuantity = packSize && purchaseProductData.quantity ? packSize * purchaseProductData.quantity : null;

            //validate quqntity is number
            if (!isNaN(packSizeQuantity) && isStoreProductExist.quantity) {
              updatedQuantity = isStoreProductExist.quantity + packSizeQuantity;
            } else if (!isNaN(packSizeQuantity)) {
              updatedQuantity = packSizeQuantity;
            }
            if (!isNaN(updatedQuantity)) {
              //update quantity
              await storeProduct.update(
                { quantity: updatedQuantity },
                { where: { product_id: purchaseProductData.product_id, company_id: company_id, store_id: purchaseData.store_id } }
              );
            }
          }

        }

      }
      res.json(Response.UPDATE_SUCCESS, {
        message: 'Purchase Product updated',
      });

      res.on('finish', async () => {

        if (historyMessage && historyMessage.length > 0) {

          let message = historyMessage.join();
          history.create(message, req, ObjectName.PRODUCT, purchaseProductData?.product_id);
        }
      });

      // API response
    } catch (err) {
      res.json(Response.BAD_REQUEST, {
        message: err.message,
      });
    }
  }
  static async report(params, companyId) {
    try {

      let { startDate, endDate, vendor, type } = params;
      const where = new Object();

      if (vendor && parseInt(vendor)) {
        where.vendor_id = vendor;
      }
      if (startDate && !endDate) {
        where.purchase_date = {
          [Op.and]: {
            [Op.gte]: startDate,
          },
        };
      }
      if (!startDate && endDate) {
        where.purchase_date = {
          [Op.and]: {
            [Op.lte]: endDate,
          },
        };
      }
      if (startDate && endDate) {
        where.purchase_date = {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        };
      }
      where.company_id = companyId;

      const query = {
        attributes: ["net_amount", "purchase_date", "vendor_id"],
        include: [
          {
            required: true,
            model: accountModel,
            as: "account",
            attributes: ["name", "id"],
            where: { type: Account.CATEGORY_VENDOR, company_id: companyId }
          },
        ],
        where,
      };

      const purchaseData = await Purchase.findAll(query);
      let purchaseDataArray = this.getDataBasedOnType(type, purchaseData)
      const totalAmount =
        purchaseDataArray && purchaseDataArray.reduce((sum, result) => sum + Number.Get(result.totalAmount, 0), 0);

      return {
        graphData: purchaseDataArray,
        totalAmount: totalAmount,
        average: Number.Get(totalAmount) / purchaseDataArray.length,
        totalCount: purchaseDataArray.length
      }

    } catch (err) {
      console.log(err);
    }
  }

  static async createAuditLog(createData, req, id) {
    let companyId = Request.GetCompanyId(req);
    let auditLogMessage = new Array();
    auditLogMessage.push(`Purchase Created From: \n`);
    if (createData?.purchase_number) {
      auditLogMessage.push(`Purchase Number: ${createData?.purchase_number}\n`);
    }

    if (createData?.description) {
      auditLogMessage.push(`Description: ${createData?.description}\n`);
    }


    if (createData?.status) {
      let statusDetail = await StatusService.getData(createData?.status, companyId);
      auditLogMessage.push(`Status: ${statusDetail && statusDetail?.name}\n`);
    }

    if (createData?.purchase_date) {
      auditLogMessage.push(`Purchase_date: ${DateTime.shortMonthDate(createData?.purchase_date)}\n`);
    }

    if (createData?.store_id) {
      const storeDetail = await Location.findOne({ where: { id: createData?.store_id, company_id: companyId } });
      auditLogMessage.push(`Store: ${storeDetail?.name}\n`);
    }

    if (createData?.net_amount) {
      auditLogMessage.push(`Net Amount: ${createData?.net_amount}\n`);
    }

    if (createData?.net_amount && !isNaN(createData?.net_amount)) {
      auditLogMessage.push(`Net Amount: ${createData?.net_amount}\n`);
    }


    if (createData?.vendor_invoice_number && !isNaN(createData?.vendor_invoice_number)) {
      auditLogMessage.push(`Vendor Invoice Number: ${createData?.vendor_invoice_number}\n`);
    }

    if (createData?.owner_id) {
      let userDetail = await UserService.getUserDetailById(createData?.owner_id, companyId);
      auditLogMessage.push(`owner Name: ${String.concatName(userDetail?.name, userDetail?.last_name)}\n`);
    }

    if (createData?.vendor_invoice_date) {
      auditLogMessage.push(`Vendor Invoice Date: ${DateTime.shortMonthDate(createData?.vendor_invoice_date)}\n`);
    }

    if (createData?.due_date) {
      auditLogMessage.push(`Due Date: ${DateTime.shortMonthDate(createData?.due_date)}\n`);
    }

    if (createData?.returned_items_amount && !isNaN(createData?.returned_items_amount)) {
      auditLogMessage.push(`Retured Items Amount: ${createData?.returned_items_amount}\n`);
    }

    if (createData?.invoice_amount && !isNaN(createData?.invoice_amount)) {
      auditLogMessage.push(`Invoice Amount: ${createData?.invoice_amount}\n`);
    }

    if (createData?.vendor_name && !isNaN(createData?.vendor_name)) {
      auditLogMessage.push(`Vendor Name: ${createData?.vendor_name}\n`);
    }

    if (auditLogMessage && auditLogMessage.length > 0) {
      let message = auditLogMessage.join();
      History.create(message, req, ObjectName.PURCHASE, id);
    } else {
      History.create("Purchase Added", req, ObjectName.PURCHASE, id);
    }
  }

  static async updateAuditLog(updatedData, olddata, req, id) {
    let companyId = Request.GetCompanyId(req);
    let auditLogMessage = new Array();

    if (
      updatedData?.description &&
      updatedData?.description !== '' &&
      updatedData?.description !== olddata.description
    ) {
      auditLogMessage.push(`Description Changed to ${updatedData?.description}\n`);
    }

    if (
      updatedData?.purchase_date &&
      updatedData?.purchase_date !== '' &&
      updatedData?.purchase_date !== olddata.purchase_date
    ) {
      auditLogMessage.push(`Purchase Date Changed to ${DateTime.shortMonthDate(updatedData?.purchase_date)}\n`);
    }

    if (
      updatedData?.vendor_invoice_number &&
      updatedData?.vendor_invoice_number !== '' &&
      updatedData?.vendor_invoice_number !== olddata.vendor_invoice_number
    ) {
      auditLogMessage.push(`Vendor Invoice Number Changed to ${updatedData?.vendor_invoice_number}\n`);
    }
    if (
      updatedData?.vendor_invoice_date &&
      updatedData?.vendor_invoice_date !== '' &&
      DateTime.getSQlFormattedDate(updatedData?.vendor_invoice_date) !== olddata.vendor_invoice_date
    ) {
      auditLogMessage.push(
        `Vendor Invoice Date Changed to ${DateTime.shortMonthDate(updatedData?.vendor_invoice_date)}\n`
      );
    }

    if (
      updatedData?.invoice_amount &&
      updatedData?.invoice_amount !== '' &&
      updatedData?.invoice_amount !== olddata.invoice_amount
    ) {
      auditLogMessage.push(`Invoice Amount Changed to ${updatedData?.invoice_amount}\n`);
    }

    if (
      updatedData?.returned_items_amount &&
      updatedData?.returned_items_amount !== '' &&
      Number.Get(updatedData?.returned_items_amount) !== Number.Get(olddata.returned_items_amount)
    ) {
      auditLogMessage.push(`Returned Items Amount Changed to ${updatedData?.returned_items_amount}\n`);
    }

    if (updatedData?.net_amount && updatedData?.net_amount !== '' && updatedData?.net_amount !== olddata.net_amount) {
      auditLogMessage.push(` Net Amount Changed to ${updatedData?.net_amount}\n`);
    }

    if (updatedData?.store_id && updatedData?.store_id !== '' && Number.Get(updatedData?.store_id) !== olddata.store_id) {
      const storeDetail = await Location.findOne({ where: { id: updatedData?.store_id, company_id: companyId } });
      auditLogMessage.push(` Location Changed to ${storeDetail && storeDetail?.name}\n`);
    }

    if (updatedData?.owner_id && updatedData?.owner_id !== '' && Number.Get(updatedData?.owner_id) !== olddata.owner_id) {
      let userDetail = await UserService.getUserDetailById(updatedData?.owner_id, companyId);
      auditLogMessage.push(` Owner Changed to ${String.concatName(userDetail?.name, userDetail?.last_name)}\n`);
    }

    if (updatedData?.vendor_id && updatedData?.vendor_id !== '' && Number.Get(updatedData?.vendor_id) !== olddata.vendor_id) {
      const vendorDetail = await accountModel.findOne({ where: { id: updatedData?.vendor_id, company_id: companyId } });
      auditLogMessage.push(` Vendor Changed to ${vendorDetail && vendorDetail?.name}\n`);
    }

    if (updatedData?.due_date && updatedData?.due_date !== '' && DateTime.getSQlFormattedDate(updatedData?.due_date) !== olddata.due_date) {
      auditLogMessage.push(` Due Date Changed to ${DateTime.shortMonthDate(updatedData?.due_date)}\n`);
    }

    if (updatedData?.notes && updatedData?.notes !== '' && updatedData?.notes !== olddata.notes) {
      auditLogMessage.push(` Notes Changed to ${updatedData?.notes}\n`);
    }

    if (auditLogMessage && auditLogMessage.length > 0) {
      let message = auditLogMessage.join();
      History.create(message, req, ObjectName.PURCHASE, id);
    } else {
      History.create("Purchase Updated", req, ObjectName.PURCHASE, id);
    }
  }


  static async getProduct(params, companyId) {

    try {
      const { id } = params;

      // To get the product featured image from product index table.
      const productIndexDetails = await productIndex.findOne({
        where: { product_id: id, company_id: companyId },
        attributes: ["cgst_percentage", "igst_percentage", "sgst_percentage", "tax_percentage", "product_id"]
      });

      return productIndexDetails
    } catch (err) {
      console.log(err);
    }
  }


  static getDataBasedOnType(type, purchaseData) {
    let purchaseDataArray = [];
    if (purchaseData && purchaseData.length > 0) {
      for (let i = 0; i < purchaseData.length; i++) {
        const currentPurchase = purchaseData[i];
        const vendorId = currentPurchase?.vendor_id;
        const netAmount = parseFloat(currentPurchase?.net_amount) || 0;
        const vendorName = currentPurchase?.account?.name;
        const purchaseDate = currentPurchase?.purchase_date;
        let year = DateTime.getYear(purchaseDate);
        let month = DateTime.getMonth(purchaseDate) + " " + year?.toString();

        if (type == Type.VENDOR_WISE) {
          let existingData = purchaseDataArray.find((item) => Number.Get(item.vendor_id) == Number.Get(vendorId));
          if (existingData) {
            existingData.totalAmount += netAmount;
          } else {
            purchaseDataArray.push({ name: vendorName, totalAmount: netAmount, vendor_id: vendorId });
          }
        }

        if (type == Type.DATE_WISE) {
          let existingData = purchaseDataArray.find((item) => item.name === purchaseDate);
          if (existingData) {
            existingData.totalAmount += netAmount;
          } else {
            purchaseDataArray.push({ name: purchaseDate, totalAmount: netAmount });
          }
        }

        if (type == Type.MONTH_WISE) {
          let existingData = purchaseDataArray.find((item) => item.name === month);
          if (existingData) {
            existingData.totalAmount += netAmount;
          } else {
            purchaseDataArray.push({ name: month, totalAmount: netAmount });
          }
        }
      }
    }
    return purchaseDataArray
  }
}

module.exports = PurchaseService;
