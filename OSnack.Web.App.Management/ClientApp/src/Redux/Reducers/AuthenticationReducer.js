const initState = {
    isAuthenticated: false,
    accessClaim: "Anon"
}
const AuthenticationReducer = (state = initState, action) => {

    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            return state = {
                isAuthenticated: action.payload.isAuthenticated,
                userRole: initState.userRole,
                message: initState.message,
            };
        case "SILENT_ATHENTICATION":
            return state = {
                isAuthenticated: action.payload.isAuthenticated,
                userRole: action.payload.userRole,
                message: initState.message,
            };
        default:
            return state;
    }
}
export default AuthenticationReducer;