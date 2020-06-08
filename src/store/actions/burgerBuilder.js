import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name,
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
};

// FETCH & SET
export const setIngredient = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const fetchIngredientFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

export const initIngredients = () => {
    return dispatch => {
        // getting ingredient
        axios.get('/ingredients.json')
            .then(res => {
                dispatch(setIngredient(res.data));
            })
            .catch(e => {
                dispatch(fetchIngredientFailed());
            });
    };
};