import { apiCaller } from '../../_CoreFiles/CommonJs/AppFunc.Shared';
import { oCoupon } from '../../_CoreFiles/CommonJs/Models-OSnack';
import { oError } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const getCoupons = (
   selectedPage = 1,
   maxNumberPerItemsPage = 1,
   searchValue = "",
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         couponList: [],
         totalCount: 0,
         errors: [],
      };
      try {
         const response = await apiCaller.get(`Coupon/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.list.map(d => {
                     state.couponList.push(new oCoupon(d));
                  });
                  state.totalCount = data.totalCount;
               }).catch(e => { console.log(e); });
               break;
            case 417: //Expectation Failed)
               await response.json().then(data => {
                  data.map(d => {
                     state.errors = new oError(data);
                  });
               }).catch(e => { console.log(e); });
               break;
            default:
               state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.status}` }));
               break;
         };
      } catch (e) {
         state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
      }
      callBack(state, ...callBackArgs);
      return state;
   };
};

export const postCoupon = (
   newCoupon = new oCoupon(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         coupon: new oCoupon(),
         errors: []
      };
      try {
         const response = await apiCaller.post("Coupon/Post", newCoupon);

         switch (response.status) {
            case 201: // Created Response
               await response.json().then(data => {
                  state.coupon = new oCoupon(data);
               }).catch(e => { console.log(e); });
               break;
            case 422: //Unprocessable Entity
            case 412: //Precondition Failed
            case 417: //Expectation Failed
               await response.json().then(data => {
                  data.map(e => {
                     state.errors.push(new oError(e));
                  });
               }).catch(e => { console.log(e); });
               break;
            default:
               state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.status}` }));
               break;
         };
      } catch (e) {
         state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
      }

      callBack(state, ...callBackArgs);
      return state;
   };
};

export const putCoupon = (
   modifiedCoupon = new oCoupon(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         coupon: new oCoupon(),
         errors: []
      };
      try {
         const response = await apiCaller.put("Coupon/Put", modifiedCoupon);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  state.coupon = new oCoupon(data);
               }).catch(e => { console.log(e); });
               break;
            case 412: //Precondition Failed
            case 422: //Unprocessable Entity
            case 404: //Not Found
            case 417: //Expectation Failed
               await response.json().then(data => {
                  data.map(e => {
                     state.errors.push(new oError(e));
                  });
               }).catch(e => { console.log(e); });
               break;
            default:
               state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.status}` }));
               break;
         };
      } catch (e) {
         state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
      }
      callBack(state, ...callBackArgs);
      return state;
   };
};

export const deleteCoupon = (
   coupon = new oCoupon(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         isDeleted: false,
         errors: []
      };
      try {
         const response = await apiCaller.delete("Coupon/Delete", coupon);
         switch (response.status) {
            case 200: // Ok Response
               state.isDeleted = true;
               break;
            case 412: //Precondition Failed
            case 404: //Not Found
            case 417: //Expectation Failed
               await response.json().then(data => {
                  data.map(e => {
                     state.errors.push(new oError(e));
                  });;
               }).catch(e => { console.log(e); });
               break;
            default:
               state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.status}` }));
               break;
         };
      } catch (e) {
         state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
      }
      callBack(state, ...callBackArgs);
      return state;
   };
};
