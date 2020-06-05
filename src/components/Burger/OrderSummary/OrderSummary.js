import React, {Component} from 'react';
import Aux from '../../../hoc/Aux/Aux';
import * as STRINGS from '../../../util/strings';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component{

    componentDidUpdate() {
        console.log('Burger Order Summary Will Update');
    }

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
            .map(igKey => {
                return (
                    <li key={igKey}>
                        <span style={{textTransform: 'capitalize'}} >{igKey}</span>: {this.props.ingredients[igKey]}
                    </li>
                );
            });

        return (
            <Aux>
                <h3>{ STRINGS.ORDER_SUMMARY_TITLE }</h3>
                <p>{ STRINGS.ORDER_SUMMARY_DESCRIPTION }</p>
                <ul>{ingredientSummary}</ul>
                <p>Total Price: $ <strong>{this.props.totalPrice.toFixed(2)}</strong></p>
                <p>{ STRINGS.ORDER_CONTINUE_CHECKOUT }</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancel}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinue}>CONTINUE</Button>
            </Aux>
        );
    }
};

export default OrderSummary;