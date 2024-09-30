const OrderProductConstants = {
    GROUP_QUERY: `with orderProduct as (
        select product_id, sum(quantity) as max_quant
        from order_product
        group by product_id
      ),     
      cte2 AS (select t1.*, t2.max_quant from order_product t1
      left join orderProduct t2 
              on t1.product_id = t2.product_id)
                        
      SELECT * FROM cte2`,

      STATUS_DRAFT: "Draft",
      STATUS_COMPLETED: "Completed",
      STATUS_CANCELLED: "Cancelled",
      REPORT_TYPE_LOCATION_WISE:"Location Wise",
      REPORT_TYPE_MONTH_WISE:"Month Wise",
      REPORT_TYPE_DATE_WISE:"Date Wise",
      REPORT_TYPE_USER_WISE:"User Wise",
      REPORT_TYPE_QUANTITY_WISE: "Quantity Wise",
      REPORT_TYPE_AMOUNT_WISE:"Amount Wise",
      REPORT_TYPE_BRAND_WISE:"Brand Wise",
      REPORT_TYPE_CATEGORY_WISE:"Category Wise",
      REPORT_TYPE_PRODUCT_WISE:"Product Wise",

}

module.exports = OrderProductConstants