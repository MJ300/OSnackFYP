const initState = {
    isOpen: false,
    redirectUrl: ""
}
const loginModalReducer = (state = initState, action) => {
    switch (action.type) {
        case "TOGGLE_ON":
            return action.payload;
        case "TOGGLE_OFF":
            return action.payload;
        default:
            return state
    }
}
export default loginModalReducer;