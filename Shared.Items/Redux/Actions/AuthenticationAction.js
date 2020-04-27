
export const postLogin = (LoginDetails = { email: '', password: '', rememberMe: '' }) => {
    return async dispatch => {
        let state = {
            type: 'LOGIN',
            payload: {
                isAuthenticated: true,
                accessClaim: 'Admin',
            },
            errors: []
        };
        //try {
        //const response = await apiCaller.post("PATH", LoginDetails);
        //    switch (response.status) {
        //        case 201: // Created Response
        //            await response.json().then(data => {
        //                state.payload.PayloadPropName = data;
        //                state.PayloadPropName = data;
        //            }).catch(e => { console.log(e) })
        //            break;
        //        case 400: //Bad Response
        //            await response.json().then(data => {
        //                data.map(e => {
        //                    state.payload.errors.push(new oError({ key: e.key, value: e.value }))
        //                    state.errors.push(new oError({ key: e.key, value: e.value }))
        //                });
        //                state.payload.errors = data;
        //                state.errors = data;
        //            }).catch(e => { console.log(e) })
        //            break;
        //        default:
        //            state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.state}` }))
        //            break;
        //    };
        //} catch (e) {
        //    state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }))
        //}
        dispatch(state);
        return state;
    }
}

export const getLogout = () => {
    return async dispatch => {
        let state = {
            type: "LOGOUT",
            payload: {
                isAuthenticated: false,
                //user: new gUser(),
                accessClaim: "Anon"
            }
        };
        //try {
        //await apiCaller.get("authentication/logout");
        dispatch(state);
        //} catch (e) {
        //console.log(e)
        //state.errors.push(new gError({ key: "ConnectionError", value: "Server Connection Error" }))
        //}
    }
}

export const getSilentAuthentication = (currentAuthentication, user) => {
    return async dispatch => {
        let state = {
            type: 'SILENT_ATHENTICATION',
            payload: {
                isAuthenticated: false,
                //user: new gUser(),
                accessClaim: "Anon"
            }
        };

        if (currentAuthentication) {
            state.payload.isAuthenticated = true;
            state.payload.accessClaim = 'Admin';
        }
        if ((!currentAuthentication && state.payload.isAuthenticated) || (currentAuthentication && !state.payload.isAuthenticated))
            dispatch(state);
        //try {
        //const response = await apiCaller.get('authentication/silent');

        //switch (response.status) {
        //case 200: // Ok response
        //await response.json().then(data => {
        //state.payload.isAuthenticated = true;
        //state.payload.user = new gUser(data);
        //state.payload.accessClaim = data.role.accessClaim;
        //}).catch(e => { })
        //console.log(state.payload.isAuthenticated)
        //if (!currentAuthentication && state.payload.isAuthenticated)
        //dispatch(state);
        //break;
        //case 401: //Unauthorized 
        //default:
        //if (currentAuthentication)
        //dispatch(state);
        //if (user)
        //break;
        //};
        //} catch (e) {
        //console.log(e)

        //try {
        //state.errors.push(new gError({ key: "ConnectionError", value: "Server Connection Error" }))
        //} catch (e) {

        //}
    }
}
