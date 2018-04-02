import React from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import Full from './containers/Full';


class Portal extends React.Component{

  render(){
    if(this.props.user.email){
      return (
        <Full user={this.props.user} />
      );
    }
    else {
      return (
        <Switch>
          <Route path='/register'exact component={RegisterPage} />
          <Route path='/login'exact component={LoginPage} />
          <Redirect to="/login"/>
        </Switch>
      );
    }

  }

}


export {Portal};
