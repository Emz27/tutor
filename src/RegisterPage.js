import React, {Component} from 'react';

import {FormGroup, Label, FormFeedback, Container, Row, Col, Card, CardBody, Button, Input} from 'reactstrap';

import * as firebase from 'firebase';
import 'firebase/firestore';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';



class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: '',
      address: '',
      contact: '',
      type: '',
      coordinates: {},
      contactError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      firstnameError: '',
      lastnameError: '',
      addressError: '',
      typeError: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailBlur = this.handleEmailBlur.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
    this.handleLastnameChange = this.handleLastnameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.registerUserAuth = this.registerUserAuth.bind(this);
    this.registerUserData = this.registerUserData.bind(this);

    this.firebase = firebase;


  }
  handleEmailChange(event){
    this.setState({ email: event.target.value, emailError: ''});
  }
  handleEmailBlur(event){
    this.firebase.firestore().collection('users').where('email', '==', this.state.email).get().then((querySnapshot)=> {
      querySnapshot.forEach((data)=>{
        console.dir(data);
        this.setState({emailError: 'Email address is not available'});

      });
    }).catch((error)=>{
      console.log('Error getting documents: ', error);
    });
  }
  handlePasswordChange(event){
    this.setState({ password: event.target.value, passwordError: ''});
  }
  handleConfirmPasswordChange(event){
    var error = '';
    if(event.target.value !== this.state.password){
      error = 'password does not match';
    }
    this.setState({ confirmPassword: event.target.value, confirmPasswordError: error});
  }
  handleFirstnameChange(event){
    this.setState({ firstname: event.target.value, firstnameError: ''});
  }
  handleLastnameChange(event){
    this.setState({ lastname: event.target.value, lastnameError: ''});
  }
  handleContactChange(event){
    this.setState({ contact: event.target.value, contactError: ''});
  }
  handleAddressChange(address){
    this.setState({ address: address, addressError: ''});
  }
  handleTypeChange(event){
    this.setState({ type: event.target.value, typeError: '' });
  }
  handleSubmit(event){
    var s = this.state;
    var error ={};

    if(!s.email) error.emailError = 'Fill the email field';
    if(!s.password) error.passwordError = 'Fill the password field';
    if(!s.confirmPassword) error.confirmPasswordError = 'Fill the confirm password field';
    if(!s.firstname) error.firstnameError = 'Fill the firstname field';
    if(!s.lastname) error.lastnameError = 'Fill the lastname field';
    if(!s.address) error.addressError = 'Fill the Address field';
    if(!s.contact) error.contactError = 'Fill the Contact field';
    if(!s.type) error.typeError = 'Fill the user type field';

    if(Object.getOwnPropertyNames(error).length !== 0){
      this.setState({...error});

    }
    else if(Object.getOwnPropertyNames(error).length === 0){
      geocodeByAddress(this.state.address)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
          this.setState({
            coordinates:new firebase.firestore.GeoPoint(latLng.lat, latLng.lng)
          },()=>{this.registerUserAuth();});
        })
        .catch(error => {
          this.setState({addressError:error});
        });
    }
  }
  registerUserData(uid){
    var userData = {
      type: this.state.type,
      email: this.state.email,
      address: this.state.address,
      coordinates: this.state.coordinates,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      contact: this.state.contact,
      rating: 2.5,
      subjects: {},
      schedule: {}
    };
    this.firebase.firestore().collection('users').doc(uid).set(userData)
    .then(function(docRef) {
      console.log('Document successfully written!');
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
    });
  }
  registerUserAuth(){


    this.firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((data)=>{
      console.log('createuser resolved');
      this.registerUserData(firebase.auth().currentUser.uid);
    })
    .catch((error)=> {
      var errorCode = error.code;
      var errorMessage ={};

      switch(errorCode){
      case 'auth/invalid-email':{
        errorMessage.emailError = 'Invalid email format';
        break;
      }
      case 'auth/email-already-in-use':{

        errorMessage.emailError = 'Email not available';
        break;
      }
      case 'auth/operation-not-allowed':{
        errorMessage.emailError = 'Operation not allowed';
        break;
      }
      case 'auth/weak-password':{
        errorMessage.passwordError = 'Weak Password';
        break;
      }
      default:{
        errorMessage = {};
      }
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
            <Col md="9">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>


                    <FormGroup>
                      <Label for="typeSelect">Select</Label>
                      <Input invalid={(this.state.typeError)?true:false}placeholder="Select user type" type="select" id="typeSelect"
                        value={this.state.type}
                        onChange={this.handleTypeChange}
                        >
                        <option></option>
                        <option>Tutor</option>
                        <option>Student</option>
                      </Input>
                      <FormFeedback invalid={(this.state.typeError)?true:false}  >{this.state.typeError}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                      <Label for="exampleEmail">Email</Label>


                      <Input invalid={(this.state.emailError)?true:false} type="email" placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        onBlur={this.handleEmailBlur} />
                      <FormFeedback invalid={(this.state.emailError)?true:false}  >{this.state.emailError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Password</Label>


                      <Input invalid={(this.state.passwordError)?true:false} type="password" placeholder="Password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}/>
                      <FormFeedback invalid={(this.state.passwordError)?true:false}  >{this.state.passwordError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Confirm Password</Label>


                      <Input invalid={(this.state.confirmPasswordError)?true:false} type="password" placeholder="Password"
                        value={this.state.confirmPassword}
                        onChange={this.handleConfirmPasswordChange}/>
                      <FormFeedback invalid={(this.state.confirmPasswordError)?true:false}  >{this.state.confirmPasswordError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Firstname</Label>


                      <Input invalid={(this.state.firstnameError)?true:false} type="text" placeholder="Firstname"
                        value={this.state.firstname}
                        onChange={this.handleFirstnameChange}/>
                      <FormFeedback invalid={(this.state.firstnameError)?true:false}  >{this.state.firstnameError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Lastname</Label>


                      <Input invalid={(this.state.lastnameError)?true:false} type="text" placeholder="Lastname"
                        value={this.state.lastname}
                        onChange={this.handleLastnameChange}/>
                      <FormFeedback invalid={(this.state.lastnameError)?true:false}  >{this.state.lastnameError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Contact Number</Label>


                      <Input invalid={(this.state.contactError)?true:false} type="text" placeholder="Contact Number"
                        value={this.state.contact}
                        onChange={this.handleContactChange}/>
                      <FormFeedback invalid={(this.state.contactError)?true:false}  >{this.state.contactError}</FormFeedback>


                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleEmail">Address</Label>
                      <PlacesAutocomplete
                        inputProps={{
                          value: this.state.address,
                          onChange: this.handleAddressChange
                        }} />
                      <FormFeedback invalid={(this.state.addressError)?true:false}  >{this.state.addressError}</FormFeedback>


                    </FormGroup>


                  <Button color="success" block
                    onClick={this.handleSubmit}>Create Account</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RegisterPage;
