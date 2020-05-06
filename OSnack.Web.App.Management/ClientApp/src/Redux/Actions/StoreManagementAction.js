import { apiCaller } from '../../_CoreFiles/CommonJs/AppFunc.Shared';
import { oStore } from '../../_CoreFiles/CommonJs/Models-OSnack';
import { oError } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const getStores = (
   selectedPage = 1,
   maxNumberPerItemsPage = 1,
   searchValue = "",
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         storeList: [],
         totalCount: 0,
         errors: [],
      };
      try {
         const response = await apiCaller.get(`Store/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.list.map(d => {
                     state.storeList.push(new oStore(d));
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

export const postStore = (
   newStore = new oStore(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         store: new oStore(),
         errors: []
      };
      try {
         const response = await apiCaller.post("Store/Post", newStore);

         switch (response.status) {
            case 201: // Created Response
               await response.json().then(data => {
                  state.store = new oStore(data);
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

export const putStore = (
   modifiedStore = new oStore(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         store: new oStore(),
         errors: []
      };
      try {
         const response = await apiCaller.put("Store/Put", modifiedStore);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  state.store = new oStore(data);
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

export const deleteStore = (
   store = new oStore(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         isDeleted: false,
         errors: []
      };
      try {
         const response = await apiCaller.delete("Store/Delete", store);
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
