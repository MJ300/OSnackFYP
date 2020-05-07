

//#region *** *** Common URLs *** ***

export const CURRENT_URL = window.location.href;
export const STORE_URL = "https://osnack.co.uk";
//export const API_URL = "https://api.osnack.co.uk";
export const API_URL = "https://localhost:44399/";
//export const MANAGEMENT_URL = "https://management.osnack.co.uk";
export const MANAGEMENT_URL = "https://localhost:44393/";
export const EPOS_URL = "https://epos.osnack.co.uk";
export const LOGO_URL = "/Images/Logo.svg";

//#endregion


export const AccessClaims = {
   Admin: "Admin",
   Manager: "Manager",
   Customer: "Customer",
   Staff: "Staff",
   List: [
      { id: 0, name: "Admin" },
      { id: 1, name: "Customer" },
      { id: 2, name: "Manager" },
      { id: 3, name: "Staff" },
   ]
};

export const CouponType = [
   "Free Delivery",
   "Discount Price",
   "Percentage of Total",
];

export const OrderStatusType = [
   { id: 0, name: "Placed" },
   { id: 1, name: "Hold" },
   { id: 2, name: "Confirmed" },
   { id: 3, name: "Delivered" },
   { id: 4, name: "Canceled" },
];

export const ProductUnitType = [
   { id: 0, name: "Kg" },
   { id: 1, name: "Grams" },
   { id: 2, name: "Per Item" },
];

export const AlertTypes = {
   Success: "Success",
   Error: "Error",
   Warning: "Warning",
};

/// <summary>
/// Get all records from search API
/// </summary>
export const GetAllRecords = "***GET-ALL***";

export class oError {
   key = '';
   value = '';
   constructor(error = {
      key: '',
      value: ''
   }) {
      this.key = error.key;
      this.value = error.value;

   }
};

export const ConstMaxNumberOfPerItemsPage = 5;
