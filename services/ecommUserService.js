const md5 = require('md5');
const ObjectName = require('../helpers/ObjectName');
const { BAD_REQUEST, OK } = require('../helpers/Response');
const User = require('../helpers/User');
const DateTime = require("../lib/dateTime");
const Request = require('../lib/request');
const String = require('../lib/string');
const { md5Password } = require('../lib/utils');
const mailService = require('./MailService');

const { Setting, User: userModel,account,productCategory } = require('../db').models;
const errors = require('restify-errors');
const History = require('./HistoryService');

class bookMyWaterCanService {
  static async getEmail(name) {
    let value = await Setting.findOne({
      where: {
        name: name,
      },
    });
    if (value) {
      return value && value?.value;
    }
    return null;
  }

  static async create(req, res, next) {
    let data = req.body;
    let fromEmail = await this.getEmail('from_email');
    let toEmail = await this.getEmail('to_email');

    if (!fromEmail) {
      throw new errors.NotFoundError('From Mail Not Found');
    }
    if (!toEmail) {
      throw new errors.NotFoundError('To Mail Not Found');
    }
    if (!data?.name) {
      throw new errors.NotFoundError('Name is Required');
    }

    const emailSubstitutions = {
      name: data?.name,
      address: data?.address,
      mobile: data?.mobile,
      products: data?.product && JSON.parse(data?.product),
    };

    // Email Data
    const emailData = {
      fromEmail: fromEmail,
      toEmail: toEmail,
      template: 'bookMyWaterCanMail',
      subject: 'New Order',
      substitutions: emailSubstitutions,
    };

    // Sent Email
    mailService.sendMail({}, emailData, async (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.send(200, { message: 'Mail Sended' });
  }

  static async signUp(req, res, next) {
    let data = req.body;

    let companyId = await Request.GetCompanyIdBasedUrl(data?.baseUrl);

    if (!companyId) {
      return res.json(BAD_REQUEST, { message: 'Company id Not found' });
    }
    if (!data.name) {
      return res.json(BAD_REQUEST, { message: 'Name Not found' });
    }
    if (!data.mobile) {
      return res.json(BAD_REQUEST, { message: 'Mobile Not found' });
    }
    if (!data.mobile) {
      return res.json(BAD_REQUEST, { message: 'Mobile Not found' });
    }

    let signUpData = {
      name: data?.name,
      mobile_number1: data?.mobile && data?.mobile.replaceAll(/\D/g, ''),
      email: data?.email,
      password: md5Password(data?.newPassword),
      company_id: companyId,
      status:User.STATUS_ACTIVE,
    };

    let accountSignInData ={
      name: data?.name,
      mobile_number1: data?.mobile && data?.mobile.replaceAll(/\D/g, ''),
      email: data?.email,
      password: md5Password(data?.newPassword),
      company_id: companyId,
      status: User.STATUS_ACTIVE_TEXT,
    }

   await userModel.create(signUpData)
   await account.create(accountSignInData)
      res.send(200, { message: 'Sign Up Successfully' });
  }

  static async category (req,res,next){

    let data = req.query;

    let companyId = await Request.GetCompanyIdBasedUrl(data?.baseUrl);
    
    if (!companyId) {
        return res.json(400, { message: "Company Not Found" })
    }

    const where = {};

    where.company_id = companyId;

    const status = data.status;
    if (status) {
        where.status = status;
    }

    const query = {
        order: [["name", "ASC"]],
        where,
    };
 
    try {
        const productCategories = await productCategory.findAndCountAll(query);

        if (productCategories.count === 0) {
            return res.json({});
        }

        const data = [];
        productCategories.rows.forEach(productCategory => {
            const {
                id,
                name,
                status,
                createdAt,
                updatedAt,
            } = productCategory.get();

            data.push({
                id,
                name,
                status,
                createdAt: DateTime.defaultDateFormat(createdAt),
                updatedAt: DateTime.defaultDateFormat(updatedAt),
            });
        });

        res.json(OK, {
            data,
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }

  }

  static async login (req, res, next) {
    const data = req.body;
    const email = data.email;
    if (!email) {
        return next(new errors.BadRequestError("Email is required"));
    }
    const password = data.password;
    if (!password) {
        return next(new errors.BadRequestError("Password is required"));
    }
    userModel.findOne({
        where: parseInt(data.email) ? { mobile_number1: data.email } : { email: data.email },
    }).then((customer) => {
        if (!customer) {
            return next(
                new errors.UnauthorizedError(
                    "Invalid Username or Password"
                )
            );
        }
        if (customer.password !== md5(password)) {
            return next(new errors.UnauthorizedError("Invalid credentials"));
        }
        const session_id = customer.session_id || Math.floor(Date.now());
        customer
            .update({
                session_id,
            })
            .then(() => {
                let req = new Object();
                History.create("User LoggedIn", req, ObjectName.CUSTOMER, customer.id);
                res.send({
                    message: "User LoggedIn SuccessFully",
                    customer: {
                        token: session_id,
                        id: customer.id,
                        firstName: customer.name,
                        lastName: customer.last_name,
                        companyId: customer.company_id
                    },
                });
            })
            .catch((err) => {
                req.log.error(err);
                return next(err);
            });
    }).catch((err)=>{
        console.log(err);
    });
}
}

module.exports = bookMyWaterCanService;
