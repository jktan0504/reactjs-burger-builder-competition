import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import classes from './BurgerBuilder.module.css';
import * as STRINGS from '../../util/strings';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-order';
import * as actionTypes from '../../store/actions/actionTypes';
import * as burgerBuilderActions from '../../store/actions/index';


class BuigerBuilder extends Component {

    // state
    state = {
        purchasable: false,
        purchasing: false,
        loading: false,
    };

    componentDidMount() {
        this.props.onInitIngredients();
        
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    updatePurchaseStateHandler = (ingredients) => {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        // this.setState( { purchasable: sum > 0 } );
        return sum > 0;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.props.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients
    //     });
    //     this.updatePurchaseStateHandler(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount > 0 ? oldCount - 1 : oldCount;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceMinus = INGREDIENT_PRICES[type];
    //     const oldPrice = this.props.totalPrice;
    //     const newPrice = oldPrice > 0 ? oldPrice - priceMinus : oldPrice;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients
    //     });
    //     this.updatePurchaseStateHandler(updatedIngredients);
    // }

    purchaseContinueHandler = () => {
        // const queryParams = [];

        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price='+this.props.totalPrice);
        // const queryString = queryParams.join('&');

        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: queryString
        // });
        this.props.onInitPurchaseInit();
        this.props.history.push('/checkout');
    }


    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        let burger = !this.props.error ? (
            <Aux>
                <Spinner />
            </Aux>
        ) : <p>{this.props.error.message}</p>;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseStateHandler(this.props.ings)}
                        totalPrice={this.props.totalPrice}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary =  <OrderSummary ingredients={this.props.ings} 
                purchaseContinue={this.purchaseContinueHandler}
                purchaseCancel={this.purchaseCancelHandler}
                totalPrice={this.props.totalPrice}
            />;
        }


        return (
            <Aux>
                <div className={classes.ContentTitle}>
                    { STRINGS.BURGER_BUILDER_TITLE }
                </div>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {
                        orderSummary
                    }
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(burgerBuilderActions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(burgerBuilderActions.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchaseInit: () => dispatch(burgerBuilderActions.purchaseInit()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BuigerBuilder, axios));