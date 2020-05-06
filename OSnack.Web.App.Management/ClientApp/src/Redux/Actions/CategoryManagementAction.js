import { apiCaller } from '../../_CoreFiles/CommonJs/AppFunc.Shared';
import { oCategory } from '../../_CoreFiles/CommonJs/Models-OSnack';
import { oError } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const getCategories = (
   selectedPage = 1,
   maxNumberPerItemsPage = 1,
   searchValue = "",
   filterProductUnit = "",
   filterStatus = "",
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         categoryList: [],
         totalCount: 0,
         errors: [],
      };
      try {
         try {

            filterProductUnit = filterProductUnit.replace(' ', '');
            filterStatus = filterStatus.replace(' ', '');
         } catch (e) { }
         const response = await apiCaller.get(`Category/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}/${filterProductUnit}/${filterStatus}/`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.list.map(d => {
                     state.categoryList.push(new oCategory(d));
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

export const postCategory = (
   newCategory = new oCategory(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         category: new oCategory(),
         errors: []
      };
      try {
         const response = await apiCaller.post("Category/Post", newCategory);
         switch (response.status) {
            case 201: // Created Response
               await response.json().then(data => {
                  state.category = new oCategory(data);
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

export const putCategory = (
   modifiedCategory = new oCategory(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         category: new oCategory(),
         errors: []
      };
      try {
         const response = await apiCaller.put("Category/Put", modifiedCategory);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  state.category = new oCategory(data);
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

export const deleteCategory = (
   category = new oCategory(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         isDeleted: false,
         errors: []
      };
      try {
         const response = await apiCaller.delete("Category/Delete", category);
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
