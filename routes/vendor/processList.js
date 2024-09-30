function vendorDetails(result) {
	const vendorDetails = result.get();

	return {
		id: vendorDetails.id,
		name: vendorDetails.name,
		email: vendorDetails.email,
		phone: vendorDetails.phone,
		address1: vendorDetails.address1,
		address2: vendorDetails.address2,
		city: vendorDetails.city,
		state: vendorDetails.state,
		country: vendorDetails.country,
		bankName: vendorDetails.bank_name,
		bankAccountNumber: vendorDetails.bank_account_number,
		bankRoutingNumber: vendorDetails.bank_routing_number,
	};
}
module.exports = vendorDetails;