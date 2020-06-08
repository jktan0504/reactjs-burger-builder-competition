import * as actionTypes from '../actions/actionTypes';

const initialState = {
    orders: [],
    loading: false,
    purchased: false,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.PURCHASE_INIT:
            return {
                ...state,
                loading: false,
                purchased: false
            };  
            break;
        case actionTypes.PURCHASE_BURGER_START:
            return {
                ...state,
                loading: true
            };  
            break;
        case actionTypes.PURCHASE_BURGER_SUCCESS:

            const newOrder = {
                ...action.orderData,
                id: action.orderId
            };

            return {
                ...state,
                loading: false,
                orders: state.orders.concat(newOrder),
                purchased: true
            };  
            break;
        case actionTypes.PURCHASE_BURGER_FAILED:
            return {
                ...state,
                loading: false
            };  
            break;
        case actionTypes.FETCH_ORDERS_START:
            return {
                ...state,
                loading: true,
            };  
            break;
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                orders: state.orders.concat(action.orders),
                loading: false,
            };  
            break;
        case actionTypes.FETCH_ORDERS_FAILED:
            return {
                ...state,
                loading: false,
            };  
            break;
        default:
            return state;
    }
};

export default reducer;