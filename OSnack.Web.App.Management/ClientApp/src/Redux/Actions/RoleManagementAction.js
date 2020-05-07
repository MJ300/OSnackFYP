import { apiCaller } from '../../_CoreFiles/CommonJs/AppFunc.Shared';
import { oRole } from '../../_CoreFiles/CommonJs/Models-OSnack';
import { oError, ConstMaxNumberOfPerItemsPage } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const getAllRoles = () => {
   return async dispatch => {
      let state = {
         roleList: [],
         errors: [],
      };
      try {
         const response = await apiCaller.get(`Role/Get/All`);
         console.log(response);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.map(d => {
                     state.roleList.push(new oRole(d));
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
      return state;
   };
};

export const getRoles = (
   selectedPage = 1,
   maxNumberPerItemsPage = ConstMaxNumberOfPerItemsPage,
   searchValue = "",
   filterAccessClaim = "",
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         roleList: [],
         totalCount: 0,
         errors: [],
      };
      try {
         const response = await apiCaller.get(`Role/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}/${filterAccessClaim}`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.list.map(d => {
                     state.roleList.push(new oRole(d));
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

export const postRole = (
   newRole = new oRole(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         role: new oRole(),
         errors: []
      };
      try {
         const response = await apiCaller.post("Role/Post", newRole);

         switch (response.status) {
            case 201: // Created Response
               await response.json().then(data => {
                  state.role = new oRole(data);
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

export const putRole = (
   modifiedRole = new oRole(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         role: new oRole(),
         errors: []
      };
      try {
         const response = await apiCaller.put("Role/Put", modifiedRole);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  state.role = new oRole(data);
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

export const deleteRole = (
   role = new oRole(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         isDeleted: false,
         errors: []
      };
      try {
         const response = await apiCaller.delete("Role/Delete", role);
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
