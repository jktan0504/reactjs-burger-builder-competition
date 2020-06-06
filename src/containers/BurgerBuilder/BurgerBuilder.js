import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import classes from './BurgerBuilder.module.css';
import * as STRINGS from '../../util/strings';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-order';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.5,
    bacon: 0.6
};

class BuigerBuilder extends Component {

    // state
    state = {
        ingredients: null,
        totalPrice: 5.0,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: null
    };

    componentDidMount() {
        // getting ingredient
        axios.get('/ingredients.json')
            .then(res => {
                this.setState({
                    ingredients: res.data
                })
            })
            .catch(e => {
                this.setState({error: e});
            });
        
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
        this.setState( { purchasable: sum > 0 } );
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseStateHandler(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount > 0 ? oldCount - 1 : oldCount;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceMinus = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice > 0 ? oldPrice - priceMinus : oldPrice;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseStateHandler(updatedIngredients);
    }

    purchaseContinueHandler = () => {
        this.setState({loading: true});

        const data = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'JKTAN',
                address: {
                    street: 'Test Street 1',
                    zipCode: '81300',
                    country: 'Malaysia'
                },
                email: 'jktan0504@hotmail.com',
                deliveryMethod: 'fastest'
            }
        };
        axios.post('/orders.json', data)
            .then(response => {
                console.log(response);
                this.setState({loading: false, purchasing: false});
            })
            .catch(e => {
                console.log(e);
                this.setState({loading: false, purchasing: false});
            })
    }


    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        let burger = !this.state.error ? (
            <Aux>
                <Spinner />
            </Aux>
        ) : <p>{this.state.error.message}</p>;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        totalPrice={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary =  <OrderSummary ingredients={this.state.ingredients} 
                purchaseContinue={this.purchaseContinueHandler}
                purchaseCancel={this.purchaseCancelHandler}
                totalPrice={this.state.totalPrice}
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

export default withErrorHandler(BuigerBuilder, axios);