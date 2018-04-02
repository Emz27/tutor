import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';


class Portal extends React.Component{

  render(){
    if(this.props.user.email){
      if(this.props.user.type === 'Tutor'){
        return (
          <div>
            Logged in as Tutor
          </div>
        );
      }
      else if(this.props.user.type === 'Student'){
        return (
          <div>
            Logged in as Student
          </div>
        );
      }

    }
    else {
      return (
        <Switch>
          <Route path='/register'exact component={RegisterPage} />
          <Route component={LoginPage} />
        </Switch>
      );
    }

  }

}


export {Portal};
