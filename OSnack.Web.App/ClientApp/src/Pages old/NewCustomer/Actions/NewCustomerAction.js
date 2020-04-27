import { getCookieValue } from '../../../components/_Main/AppConst';

const initialState = {
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndCondition: false,
}

export const newCustomer = (customer = initialState) => {
    return async dispatch => {
        let state = {
            created: false,
            errors: [],
        };

        const response = await fetch('api/User/NewCustomerAsync', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AF-TOKEN': getCookieValue("AF-TOKEN"),
            },
            body: JSON.stringify(customer),
        });
        switch (response.status) {
            case 201: // Created response
                await response.json().then(data => {
                    state.created = data.created;
                }).catch(err => { console.log(err) });
                break;
            case 400: // Bad response
                await response.json().then(data => {
                    state.created = data.created;
                    state.errors = data.errors;
                }).catch(err => { console.log(err) });
                break;
            default:
                break;
        }
        return state;
    };
}