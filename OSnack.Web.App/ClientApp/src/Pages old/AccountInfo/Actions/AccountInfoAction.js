const initAcountInfo = {
    name:"",
    surname:"",
    phoneNumber:"",
    email:"",
}
const initAccountPasswordInfo = {
    password:"",
    newPassword:"",
    newConfirmPassword:"",
}
export const getUserInfo = () => {
    return async dispatch => {
        let state = {
            name: "Error",
            surname: "Error",
            phoneNumber: "Error",
            email: "Error",
        }
        const response = await fetch('api/User/GetUserInfoAsync');
        switch (response.status) {
            case 200:// Ok Response
                await response.json().then(data => {
                    state.name = data.name;
                    state.surname = data.surname;
                    state.phoneNumber = data.phoneNumber;
                    state.email = data.email;
                }).catch(e => { });
            case 400: // Bad Request
                break;
        }
        return state;
    }
}
export const editAccountInfo = (accountInfo = initAcountInfo) => {
    return async dispatch => {
        let state = {
            errors: [{
                id: "error",
                message: "Cannot connect to server!"
            }],
            returnStatus: "",
        }
        const response = await fetch("api/User/EditAccountInfoAsync", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountInfo),
        });

        switch (response.status) {
            case 200: // ok response
                state.errors = [];
                state.returnStatus = "Updated";
                break;
            case 400: // Bad response
                await response.json().then(data => {
                    state.errors = data.errors;
                    state.returnStatus = "Failed";
                }).catch(err => { console.log(err) });
                break;
        }
        return state;
    }
}
export const editAccountPassword = (accountPasswordInfo = initAccountPasswordInfo) => {
    return async dispatch => {
        let state = {
            message: "Cannot connect to server!",
            returnStatus: "",
        }
        const response = await fetch("api/User/EditAccountPasswordAsync", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountPasswordInfo),
        });

        switch (response.status) {
            case 200: // ok response
                state.message = "";
                state.returnStatus = "Password Updated";
                break;
            case 400: // Bad response
                await response.json().then(data => {
                    state.message = data.message;
                }).catch(err => { console.log(err) });
            default:
                state.returnStatus = "Failed";
                break;
        }
        return state;
    }
}