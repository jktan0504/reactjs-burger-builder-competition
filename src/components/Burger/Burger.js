import React from 'react';

import classes from './Burger.module.css'

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import {withRouter} from 'react-router-dom';

const burger = (props) => {

    // transform object to array
    /** 
     *  Object key return Array of key
     * 
    */
    ;
    let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
        console.log('key: '+igKey);
        console.log('value '+props.ingredients[igKey]);
        console.log(Array(props.ingredients[igKey]));
        
        return [...Array(props.ingredients[igKey])].map((_, i) => {
            console.log(igKey+' => '+i);
            return <BurgerIngredient key={igKey + i} type={igKey} />
        })
    }).reduce((previous, current) => {
        return previous.concat(current);
    }, []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = (
            <p>Please start adding ingredients !</p>
        ); 
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default withRouter(burger);
