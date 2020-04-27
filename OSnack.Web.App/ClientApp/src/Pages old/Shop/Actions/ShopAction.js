import { getCookieValue, preloadImages } from '../../../components/_Main/AppConst';
export const getProductCategories = () => {
    return async dispatch => {
        let state = {
            categories: [],
            Loading: true
        }
        const response = await fetch('api/Products/getCategories');
        switch (response.status) {
            case 200:// Ok Response
                await response.json().then(async data => {
                    await preloadImages(data).then(loaded => {
                        console.log(data)
                        state.categories = data;
                        state.Loading = false;
                    })
                }).catch(err => console.log(err));
            case 400: // Bad Request
            default:
                    state.categories = [];
                break;
        }
        console.log(state)
        return state;
    }
}
export const getProducts = categoryId => {
    return async dispatch => {
        let state = {
            products: []
        }
        const response = await fetch('api/Products/getShopProducts', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AF-TOKEN': getCookieValue("AF-TOKEN"),
            },
            body: JSON.stringify(categoryId)
        }).catch(err => console.log(err));
        switch (response.status) {
            case 200:// Ok Response
                await response.json().then(data => {
                    state.products = data;
                }).catch(err => { console.log(err); });
                break;
            case 400: // Bad Request
            default:
                state.products = [];
                break;
        }
        return state;
    }
}
export const addProductToOrder = (product = {
    id: 0,
    name: "",
    imagePath: "",
    price: "",
    unit: "",
    unitQuantity: "",
    orderQuantity: 0,
    description: ""
}, currentOrderProducts = []) => {
    return dispatch => {
        let state = {
            type: "ADD_PRODUCT_TO_ORDER",
            products:[]
        }
        product.orderQuantity++;
        /// if there are no products ordered yet
        if (currentOrderProducts.length == 0) {
            state.products = [product];
            dispatch(state);
        }
        if (!!currentOrderProducts.find(i => i.id == product.id)) {
            let productIndex = state.products.findIndex((value, index, obj) => {
                value.id = product.id;
                return index;
            })
            currentOrderProducts.splice(productIndex, 1, product)
        } else {
            currentOrderProducts.push(product);
        }
        state.products = currentOrderProducts;
        dispatch(state);
        console.log(state)
    }
};