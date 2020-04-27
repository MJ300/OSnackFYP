import  React from 'react';

export const DefaultNav = () => {
    return async (dispatch) => {
        dispatch({ type: 'DEFAULT_NAV' });
    }
}
export const CustomerNav = () => {
    return async (dispatch) => {
        dispatch({
            type: 'CUSTOMER_NAV_MENU',
            payload: [
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
                    path: "/AccountInfo",
                    displayName: "Account Info",
                    displayOnRight: true

                },
                {
                    id: 3,
                    path: "/MyOrders",
                    displayName: "My Orders",
                    displayOnRight: true

                },
            ]
        });
    }
}
export const ManagerNav = () => {
    return async (dispatch) => {
        dispatch({
            type: 'MANAGER_NAV_MENU',
            payload: [
                {
                    id: 0,
                    path: "/ShopManagement",
                    displayName: <div>Shop <small>Management</small></div>,
                    displayOnRight: false
                },
                {
                    id: 1,
                    path: "/UserManagement",
                    displayName: <div>User <small>Management</small></div>,
                    displayOnRight: false

                },
                {
                    id: 2,
                    path: "/CouponManagement",
                    displayName: <div>Coupon <small>Management</small></div>,
                    displayOnRight: false

                },
                {
                    id: 3,
                    path: "/AccountInfo",
                    displayName: "Account Info",
                    displayOnRight: true

                },
                {
                    id: 4,
                    path: "/Fetch-data",
                    displayName: "Fetch Data",
                    displayOnRight: false
                },
            ]
        })
    };
}