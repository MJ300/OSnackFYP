const initState =
    [
        {
            id: 0,
            path: "/Shop",
            displayName: "Shop",
            displayOnRight: false
        },
        {
            id: 1,
            path: "/AboutUs",
            displayName: "About Us",
            displayOnRight: false
        },
        {
            id: 2,
            path: "/Fetch-data",
            displayName: "Fetch Data",
            displayOnRight: false
        },
    ]
const NavMenuReducer = (state = initState, action) => {
    switch (action.type) {
        case "CUSTOMER_NAV_MENU":
        case "MANAGER_NAV_MENU":
            return action.payload;
        case "DEFAULT_NAV":
            return initState;
        default:
            return state;
    }
}
export default NavMenuReducer;