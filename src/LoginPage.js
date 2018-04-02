import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {FormFeedback, FormGroup, Label, Container, Row, Col, CardGroup, Card, CardBody, Button, Input} from 'reactstrap';

import * as firebase from 'firebase';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  handleEmailChange(event){
    this.setState({ email: event.target.value, emailError: ''});
  }
  handlePasswordChange(event){
    this.setState({ password: event.target.value, passwordError: ''});
  }
  handleSubmit(){
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error)=> {
      var errorCode = error.code;
      var errorMessage ={};

      switch(errorCode){
      case 'auth/invalid-email':{
        errorMessage.emailError = 'Invalid email format';
        break;
      }
      case 'auth/user-disabled':{

        errorMessage.emailError = 'User account has been disabled, please contact administrator';
        break;
      }
      case 'auth/user-not-found':{
        errorMessage.emailError = 'Email not found';
        break;
      }
      case 'auth/wrong-password':{
        errorMessage.passwordError = 'Wrong Password';
        break;
      }
      default:{
        errorMessage = {};
      }
      }
      if(!this.state.email){
        errorMessage.emailError = 'Fill the email field';
      }
      if(!this.state.password){
        errorMessage.passwordError = 'Fill the password field';
      }
      this.setState({...errorMessage});

      console.log('errorCode: ' + errorCode );
      console.log('errorMessage: ' + errorMessage);

    });
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <FormGroup>
                      <Label for="exampleEmail">Email</Label>


                      <Input invalid={(this.state.emailError)?true:false} type="email" placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleEmailChange} />
                      <FormFeedback invalid={(this.state.emailError)?true:false}  >{this.state.emailError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Password</Label>


                      <Input invalid={(this.state.passwordError)?true:false} type="password" placeholder="Password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}/>
                      <FormFeedback invalid={(this.state.passwordError)?true:false}  >{this.state.passwordError}</FormFeedback>


                    </FormGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4"
                          onClick={()=>this.handleSubmit()}
                          >Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Link to="/register"><Button color="link" className="px-0">Register?</Button></Link>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Start earning money and make use of your valueable time</p>
                      <Link to="/register"><Button color="primary" className="mt-3" active>Register Now!</Button></Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LoginPage;
