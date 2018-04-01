import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';


class Portal extends React.Component{

  render(){
    if(this.props.userRecord.email){
      if(this.props.userRecord.type === 'Tutor'){
        return (
          <div>
          </div>
        );
      }
      else if(this.props.userRecord.type === 'Student'){
        return (
          <div>
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
