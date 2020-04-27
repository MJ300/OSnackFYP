import { getCookieValue } from '../../_Main/AppConst';

export const confirmEmail = (token = '') => {
    return async dispatch => {
        let state = {
            type: 'FAILED',
            message:'Token not recognized!',
        };
        const response = await fetch('api/User/ConfirmEmail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AF-TOKEN': getCookieValue("AF-TOKEN"),
            },
            body: JSON.stringify(token),
        });
        switch (response.status) {
            case 200: // Ok Response
                await response.json().then(data => {
                    state.type = 'SUCCESS';
                    state.message = data.message;
                }).catch(e => { })
                dispatch(state);
                return state;
            case 400: // Bad Request. Unable to Logout
                await response.json().then(data => {
                    state.type = 'WARNING';
                    state.message = data.message;
                }).catch(e => { })
                dispatch(state);
                return state;
            default:
                dispatch(state);
                return state;
        }
    }
}