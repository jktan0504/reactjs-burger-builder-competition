import React from 'react';
import './App.css';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';

import { Route, Switch } from 'react-router-dom';

function App() {
	return (
		<div>
			<Layout>
				<Switch>
					<Route path="/" component={BurgerBuilder} exact />
					<Route path="/checkout" component={Checkout} />
					<Route path="/orders" component={Orders} />
				</Switch>
			</Layout>
		</div>
	);
}

export default App;
