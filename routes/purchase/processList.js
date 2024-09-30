const utils = require("../../lib/utils");
const DateTime = require("../../lib/dateTime");

function accountspurchase(result) {
	const purchase = result.get();
	const { statusDetail, UserDetails, UserData } = purchase;
	const locationName = result.location_name;
	return {
		id: purchase.id,
		purchaseNumber: purchase.purchase_number,
		status: purchase.status,
		statusName: statusDetail?.name,
		statusColor: statusDetail?.color_code,
		file: purchase.file,
		mediaUrl: `${purchase.file}`,
		mediaAttachmentUrl: utils.getAccountBillUrl(purchase.file),
		description: purchase.description,
		amount: purchase.amount,
		Createat: DateTime.Format(purchase.created_at),
		purchaseDate: purchase.purchase_date,
		dueDate: DateTime.formatDate(purchase.due_date, "DD MMM, Y"),
		vendorName: purchase.account ? purchase.account.name : "",
		orderNumber: purchase.order_number,
		paymentType: purchase.payment_type,
		paymentTerm: purchase.payment_term,
		companyId: purchase.company_id,
		location_name: locationName,
		location: purchase.store_id,
		purchaseing_name: purchase.billing_name,
		vendor_id: purchase.vendor_id,
		discount_amount: result.discount_amount,
		net_amount: result.net_amount,
		vendorInvoiceNumber: purchase.vendor_invoice_number,
		vendor_invoice_date: DateTime.Format(purchase.vendor_invoice_date),
		owner_id: purchase.owner_id,
		ownerName: UserDetails && UserDetails?.name,
		ownerLastName: UserDetails && UserDetails?.last_name,
		ownerAvatarUrl: UserDetails && UserDetails?.media_url,
		invoice_amount: purchase?.invoice_amount,
		reviewer_id: purchase.reviewer_id,
		reviewerFirstName: UserData && UserData?.name,
		reviewerLastName: UserData && UserData?.last_name,
		reviewerAvatarUrl: UserData && UserData?.media_url,
		returned_items_amount: purchase?.returned_items_amount,
		due_date:purchase.due_date,
		vendorInvoiceDate:purchase.vendor_invoice_date,

	};
}
module.exports = accountspurchase;
