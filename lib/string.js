const roles = require("../routes/user/roles");

class String {

    static replaceSpecialCharacter(string){
		if (string) {
			//remove special charater
			let replacedString = string.replace(/[^a-zA-Z0-9]/g, ' ');

			if (replacedString) {
				//remove multiple space add single space
				replacedString = replacedString.replace(/\s+/g, " ");
				//add "-" symbol for sepecial charater
				replacedString = replacedString.replace(/[^a-zA-Z0-9]/g, '-');

				replacedString = `${replacedString}.png`
			}
			return replacedString;
		}
	};

    static formattedName(name) {
		return name
			.replace(/[^a-z0-9]+/gi, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "")
			.toLowerCase();
	};

    static concatName(firstName, lastName){
		const name = [];

		if (firstName) {
			name.push(firstName);
		}

		if (lastName) {
			name.push(lastName);
		}

		if (name) {
			return name.join(" ");
		}

		return "";
	};

    //capitalize first letter
    static capitalizeFirstLetter(str){
		if (!str) {
			return null;
		}

		return str.charAt(0).toUpperCase() + str.slice(1);
	};

    	/**
	 * Random String
	 *
	 * @param length
	 * @returns {string}
	 */
	static randomString(length){
		if (!length) {
			length = 16;
		}
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		let text = "";
		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	};

	    
    /**
     * Convert Text To Slug
     * @param text
     * @returns {string}
     */
	 static convertTextToSlug(text){
        return text
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "")
            .toLowerCase();
    };

		/**
	 * Right trim
	 * @param value
	 * @returns {string|void|*}
	 */
		static rtrim(value) { return value.replace(/\s+$/g, "") };

		 /**
		  * Get Role Text
		  *
		  * @param role
		  * @returns {string}
		  */
		static  getRoleText(role) {
			 if (role === roles.ADMIN) {
				 return "Admin";
			 }
	 
			 if (role === roles.DEVELOPER) {
				 return "Developer";
			 }
	 
			 if (role === roles.QA) {
				 return "QA";
			 }
	 
			 if (role === roles.CUSTOMER) {
				 return "Customer";
			 }
	 
			 if (role === roles.CONSULTANT) {
				 return "Consultant";
			 }
	 
			 if (role === roles.MANAGER) {
				 return "Manager";
			 }
	 
			 if (role === roles.EVALUATION) {
				 return "Evaluation";
			 }
	 
			 if (role === roles.LEAD) {
				 return "Lead";
			 }
	 
			 return "";
		 };

     /**
         * validating data 
         * @param data
         * @returns {string}
         */


	 static Get (value){
		if (value && value !== undefined && value !=="" && value !==null) {
			return value;
		  }
		  return "";
			 }

	      static ParseString(string){
				return string.toString();
		}


		static checkForNameInText = (text, name) => {
			if (text && text.toUpperCase().includes(name.toUpperCase())) {
				return true;
			}
			return false;
		};
		
		static isNotNull(string) {
			const trimmedString = typeof string === 'string' ? string.trim() : string;
			
			return trimmedString && trimmedString !== "undefined" && 
				   trimmedString !== "null" && trimmedString !== "";
		  }

		  static safeStringify(data) {
			return data && Array.isArray(data) && data.length > 0 ? JSON.stringify(data) 
         : data && typeof data === 'object' && Object.keys(data).length > 0 ? JSON.stringify(data)
         : null;
		  }
		  
}

module.exports = String;