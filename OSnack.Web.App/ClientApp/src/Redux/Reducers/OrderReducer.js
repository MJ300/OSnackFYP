const order = {
    id: 0,
    customerId: 0,
    products: [],
}
const OrderReducer = (state = order, action) => {
    switch (action.type) {
        case "ADD_CUSTOMER_TO_ORDER":
            state.customerId = action.customerId;
            break;
        case "ADD_PRODUCT_TO_ORDER":
        case "REMOVE_PRODUCT_TO_ORDER":
            state.products = action.products;
            break;
        default:
            state = state;
            break;

    }
    return state;
};
export default OrderReducer;
