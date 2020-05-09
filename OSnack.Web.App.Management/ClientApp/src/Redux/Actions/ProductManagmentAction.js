import { apiCaller } from '../../_CoreFiles/CommonJs/AppFunc.Shared';
import { oProduct, oStoreProduct } from '../../_CoreFiles/CommonJs/Models-OSnack';
import { oError } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const getProducts = (
   selectedPage = 1,
   maxNumberPerItemsPage = 1,
   filterProductStoreId = 1,
   filterProductCategory = "",
   searchValue = "",
   filterProductUnit = "",
   filterStatus = "",
   isAccendingSort = true,
   sortByType= 0,
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         storeProductList: [],
         totalCount: 0,
         errors: [],
      };
      try {
         try {

            filterProductUnit = filterProductUnit.replace(' ', '');
            filterStatus = filterStatus.replace(' ', '');
         } catch (e) { }
         const response = await apiCaller.get(`Product/Get/${selectedPage}/${maxNumberPerItemsPage}/${filterProductStoreId}/${filterProductCategory}/${searchValue}/${filterProductUnit}/${filterStatus}/`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  console.log(data);
                  data.list.map(d => {
                     state.storeProductList.push(new oStoreProduct(d));
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

export const getStoresProduct = (
   productId = 0,
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         storeProductList: [],
         errors: [],
      };
      try {

         const response = await apiCaller.get(`Product/Get/AllStore/${productId}`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.map(d => {
                     state.storeProductList.push(new oStoreProduct(d));
                  });
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


export const postProduct = (
   newProduct = new oProduct(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         product: new oProduct(),
         errors: []
      };
      try {
         //if (newProduct.category.id == null)
         //   newProduct.category.id = 0;
         console.clear();
         console.log(JSON.stringify(newProduct));

         const response = await apiCaller.post("Product/Post", newProduct);
         console.log(response);
         switch (response.status) {
            case 201: // Created Response
               await response.json().then(data => {
                  state.product = new oProduct(data);
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
         console.log(e);
         state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
      }

      callBack(state, ...callBackArgs);
      return state;
   };
};

export const putProduct = (
   modifiedProduct = new oProduct(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         product: new oProduct(),
         errors: []
      };
      try {
         const response = await apiCaller.put("Product/Put", modifiedProduct);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  state.product = new oProduct(data);
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

export const deleteProduct = (
   product = new oProduct(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         isDeleted: false,
         errors: []
      };
      try {
         const response = await apiCaller.delete("Product/Delete", product);
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
