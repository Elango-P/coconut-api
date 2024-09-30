const { User, UserEmployment } = require("../../db").models;

const processUserList = require("./processUserList");

function get(req, res) {
	const id =  req.user.id;
try{
	User
		.findOne({
			where: { id },
			include: [
				{
				  model: UserEmployment,
				  as: 'UserEmployment',
				},
			  ],

		})
		.then(async (user) => {
			res.json(await processUserList(user));
		});
	}catch(err){
		console.log(err);
	}
};

module.exports = get;
