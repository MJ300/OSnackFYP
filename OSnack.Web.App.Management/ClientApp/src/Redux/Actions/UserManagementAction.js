import { apiCaller } from '../../_CoreFiles/CommonJs/AppFunc.Shared';
import { oUser } from '../../_CoreFiles/CommonJs/Models-OSnack';
import { oError } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const getUsers = (
   selectedPage = 1,
   maxNumberPerItemsPage = 1,
   searchValue = "",
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         userList: [],
         totalCount: 0,
         errors: [],
      };
      try {
         const response = await apiCaller.get(`User/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}`);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  data.list.map(d => {
                     state.userList.push(new oUser(d));
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

export const postUser = (
   newUser = new oUser(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         user: new oUser(),
         errors: []
      };
      try {
         if (newUser.role.id == null)
            newUser.role.id = 0;
         const response = await apiCaller.post("User/Post/Employee", newUser);

         switch (response.status) {
            case 201: // Created Response
               await response.json().then(data => {
                  state.user = new oUser(data);
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

export const putUser = (
   modifiedUser = new oUser(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         user: new oUser(),
         errors: []
      };
      try {
         const response = await apiCaller.put("User/Put", modifiedUser);
         switch (response.status) {
            case 200: // Ok Response
               await response.json().then(data => {
                  state.user = new oUser(data);
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

export const deleteUser = (
   user = new oUser(),
   callBack = () => { },
   callBackArgs = []) => {
   return async dispatch => {
      let state = {
         isDeleted: false,
         errors: []
      };
      try {
         const response = await apiCaller.delete("User/Delete", user);
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
