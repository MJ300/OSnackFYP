export const loginModalOn = (redirectUrl= "") => {
    return async dispatch => {
        dispatch({
            type: 'TOGGLE_ON',
            payload: {
                isOpen: true,
                redirectUrl: redirectUrl
            }
        })
    }
}
export const loginModalOff = () => {
    return async dispatch => {
        dispatch({
            type: 'TOGGLE_OFF',
            payload: {
                isOpen: false,
                redirectUrl: ""
            }
        });
    } 
}
