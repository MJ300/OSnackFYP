import { getCookieValue } from '../../../components/_Main/AppConst';
export const requestPasswordReset = (email = "") => {
    return async dispatch => {
        let state = {
            accepted: false,
            message: ''
        };
        const response = await fetch("api/User/RequestPasswordResetAsync", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AF-TOKEN': getCookieValue("AF-TOKEN"),
            },
            body: JSON.stringify(email),
        });
        switch (response.status) {
            case 200: // ok response
                await response.json().then(data => {
                    state.accepted = true;
                    state.message = data.message;
                }).catch(err => { console.log(err) });
                break;
            case 400: // Bad response
                await response.json().then(data => {
                    state.accepted = false;
                    state.message = data.message;
                }).catch(err => { console.log(err) });
                break;
            default:
                break;
        }
        return state;
    }
}
export const resetPassword = (data = {
    password: "",
    confirmPassword: "",
    token:""
}) => {
    return async dispatch => {
        let state = {
            accepted: false,
            errors: [],
            message: ""
        };
        const response = await fetch("api/User/ResetPasswordAsync", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AF-TOKEN': getCookieValue("AF-TOKEN"),
            },
            body: JSON.stringify(data),
        });
        switch (response.status) {
            case 200: // ok response
                await response.json().then(data => {
                    state.accepted = true;
                    state.message = data.message;
                }).catch(err => { console.log(err) });
                break;
            case 400: // Bad response
                await response.json().then(data => {
                    state.accepted = false;
                    state.message = data.message;
                }).catch(err => { console.log(err) });
                break;
            default:
                break;
        }
        return state;
    }
}
export const passwordResetTokenValid = (token = "") => {
    return async dispatch => {
        let state = {
            isValid: false,
            message: "Connection Error!",
        };
        const response = await fetch("api/User/PasswordResetTokenValid", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AF-TOKEN': getCookieValue("AF-TOKEN"),
            },
            body: JSON.stringify(token),
        });
        switch (response.status) {
            case 200: // ok response
                state.isValid = true;
                break;
            case 400: // Bad response
                await response.json().then(data => {
                    state.isValid = false;
                    state.message = data.message;
                }).catch(err => { console.log(err) });
                break;
        }
        return state;
    }
}