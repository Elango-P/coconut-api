const ObjectName = require("../helpers/ObjectName");
const Request = require("../lib/request");
const { Message, User } = require('../db').models;

class ChannelMessageService{


    static async create (req,res,next){

        try {
            const data = req.body;
            const companyId = Request.GetCompanyId(req);
            const userId = Request.getUserId(req);
            const createData = {
              user_id: userId,
              message: data.message,
              company_id: companyId,
              object_name: ObjectName.MESSAGE,
              channel_id: Number(data?.channel_id)
            };
            await Message.create(createData);
          
            res.json(200, { message: 'Message Sent', data: data.message });
                
          } catch (err) {
              console.log(err);
          }
    }

    static async search(req,res,next){


        let data = req.query;

        let company_id = Request.GetCompanyId(req);
        let where={}
        where.company_id = company_id
        if(data && data?.channel_id){
            where.channel_id = data?.channel_id
        }

            let query={
                include: [
                    {
                      required: true,
                      model: User,
                      as: 'sender',
                    }
                  ],
                  where: where,
                  order: [['createdAt', 'DESC']],
            }

        let MessagesList = await Message.findAndCountAll(query);

        let messageList=[]
        let messages = MessagesList && MessagesList?.rows;
        for (let i = 0; i < messages.length; i++) {
            const { id ,user_id, message, sender } = messages[i];

            messageList.push({
                id: id,
                user_id: user_id,
                message: message,
                first_name: sender?.name,
                last_name: sender?.last_name,
                media_url: sender?.media_url
            })
            
        }

        res.json(200,{
            data:messageList
        })

    }
}

module.exports=ChannelMessageService;