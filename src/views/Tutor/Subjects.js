import React, { Component } from 'react';

import {Col, Card, CardHeader, Row,CardBody, FormGroup, Input, FormFeedback, Table, FormText, Button} from 'reactstrap';

import {notify} from 'react-notify-toast';

import * as firebase from 'firebase';
import 'firebase/firestore';

class Subjects extends Component {
  constructor(props){
    super(props);
    this.state = {
      subject: '',
      subjectCategory: '',
      ratePerHour: '',

      subjectCategories: [],

      subjectError: '',
      subjectCategoryError: '',
      ratePerHourError: '',

      tutorSubjects: props.user.subjects,
      contractSubjects: {}
    };
    firebase.firestore().collection('categories').get()
    .then((querySnapshot)=>{
      let subjectCategories = [];
      querySnapshot.forEach((doc)=>{
            // doc.data() is never undefined for query doc snapshots
        subjectCategories.push({
          name: doc.data().name,
          subjects: Object.getOwnPropertyNames(doc.data().subjects),
          id: doc.id
        });
      });

      console.dir(subjectCategories);
      this.setState({
        subjectCategories: subjectCategories
      });
    });

    firebase.firestore().collection('contracts').where('tutor','==','users/'+props.user.id).get()
    .then((querySnapshot)=>{
      let subject = {};
      querySnapshot.forEach((doc)=>{
        subject[doc.data().subject]=true;
      });
      console.dir(querySnapshot);
      this.setState({contractSubjects: subject});
    })
    .catch((error)=>{
      console.log(error);
    });

    this.days = {};
    this.time = {};
    this.days = ['Sunday', 'Monday', 'Tuesday'
                      , 'Wednesday', 'Friday', 'Saturday'];
    this.time = ['6:00 am'
                , '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am', '12:00 pm'
                , '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm'
                , '7:00 pm', '9:00 pm', '10:00 pm'];
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleSubjectCategoryChange = this.handleSubjectCategoryChange.bind(this);
    this.handleRatePerHourChange = this.handleRatePerHourChange.bind(this);
    this.handleSubjectAdd = this.handleSubjectAdd.bind(this);
    this.handleSubjectDelete = this.handleSubjectDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.dir(Object.getOwnPropertyNames(this.state.tutorSubjects));
  }
  handleSubjectCategoryChange(event){
    this.setState({
      subjectCategory: event.target.value,
      subjectCategoryError: ''
    });
  }
  handleSubjectChange(event){
    this.setState({
      subject: event.target.value,
      subjectError: ''
    });
  }
  handleRatePerHourChange(event){
    this.setState({
      ratePerHour: event.target.value,
      ratePerHourError: ''
    });
  }
  handleSubjectAdd(event){
    var s = this.state;
    var error ={};

    if(!s.subject) error.subjectError = 'Fill the subject field';
    if(!s.subjectCategory) error.subjectCategoryError = 'Fill the subject category field';
    if(!s.ratePerHour) error.ratePerHourError = 'Fill the rate per hour field';

    if(Object.getOwnPropertyNames(error).length !== 0){
      this.setState({...error});

    }
    else if(Object.getOwnPropertyNames(error).length === 0){
      var obj = {};
      var subCat = this.state.subjectCategories;
      var subIndex = this.state.subject;
      var catIndex = this.state.subjectCategory;
      var subject = subCat[catIndex].subjects[subIndex];
      obj[subject] = {
        category: subCat[catIndex].name,
        rate_per_hour: this.state.ratePerHour,
        exist: true
      };
      this.props.user.subjects = {...this.state.tutorSubjects,...obj};
      this.setState({tutorSubjects: {...this.state.tutorSubjects,...obj}});
    }
  }
  handleSubjectDelete(event,subject){
    var tutSub = Object.assign({},this.state.tutorSubjects);
    delete tutSub[subject];
    this.props.user.subjects = tutSub;
    this.setState({
      tutorSubjects: tutSub
    });
  }
  handleSubmit(event){
    console.log(this.props.user.id);
    firebase.firestore().collection('users').doc(this.props.user.id).update({
      subjects: this.state.tutorSubjects
    })
    .then((data)=>{
      let myColor = { background: '#5cb85c', text: '#FFFFFF' };
      notify.show('Subjects Saved!', 'custom', 3000, myColor);
      console.log('save success');
    })
    .catch((error)=>{
      console.error(error);
    });
  }
  render() {

    var input = this.state;
    var subjectErrorProp = {};
    var subjectCategoryErrorProp = {};
    var ratePerHourErrorProp = {};


    if(input.subjectError) subjectErrorProp.invalid = true;
    if(input.subjectCategoryError) subjectCategoryErrorProp.invalid = true;
    if(input.ratePerHourError) ratePerHourErrorProp.invalid = true;
    return (
      <div className="animated fadeIn">

          <Col>
            <Card>
              <CardHeader>
                Subjects
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>

                      <FormGroup row>
                        <Col md="3">
                          <Input {...subjectCategoryErrorProp} type="select" value={this.state.subject_category}
                            onChange={this.handleSubjectCategoryChange}>
                            <option></option>
                            {
                              this.state.subjectCategories.map((data,index)=>{
                                return (
                                  <option key={index} value={index}>{data.name}</option>
                                );
                              })
                            }
                          </Input>
                          <FormFeedback {...subjectCategoryErrorProp} >{this.state.subjectCategoryError}</FormFeedback>
                          <FormText className="text-center">Subject Category</FormText>
                        </Col>
                        <Col md="4">
                          <Input {...subjectErrorProp} type="select" value={this.state.subject}
                            onChange={this.handleSubjectChange}>
                            <option></option>
                            {
                              (this.state.subjectCategory)?(
                                this.state.subjectCategories[this.state.subjectCategory].subjects.map((data,index)=>{
                                  return (
                                    <option key={index} value={index}>{data}</option>
                                  );
                                })
                              ):(<option></option>)
                            }
                          </Input>
                          <FormFeedback {...subjectErrorProp} >{this.state.subjectError}</FormFeedback>
                          <FormText className="text-center">Subject</FormText>
                        </Col>
                        <Col md="3">
                          <Input {...ratePerHourErrorProp} type="number" value={this.state.ratePerHour}
                            onChange={this.handleRatePerHourChange} ></Input>
                          <FormFeedback {...ratePerHourErrorProp} >{this.state.ratePerHourError}</FormFeedback>
                          <FormText className="text-center">Rate Per Hour</FormText>
                        </Col>
                        <Col>
                          <Button color="primary" onClick={this.handleSubjectAdd}><i className="fa fa-chevron-down"></i> Add</Button>
                        </Col>
                      </FormGroup>
                      <FormGroup row>

                      </FormGroup>


                  </Col>
                </Row>
                <Table hover responsive className="table-outline mb-0">
                  <thead className="thead-light">
                  <tr>
                    <th className="text-center">Subject</th>
                    <th className="text-center">{'Rate/Hour'}</th>
                    <th className="text-center">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                    {
                      Object.getOwnPropertyNames(this.state.tutorSubjects).map((subject,index)=>{
                        /////////////////////////////////////////////
                        return (
                          <tr key={subject}>
                            <td className="text-center">
                              <div><strong>
                                  {subject}
                                </strong></div>
                              <div className="small text-muted">{this.state.tutorSubjects[subject].category}</div>
                            </td>
                            <td className="text-center">
                              <div><strong>P {
                                  this.state.tutorSubjects[subject].rate_per_hour
                                }</strong></div>
                              <div className="small text-muted">Rate per Hour</div>
                            </td>
                            <td className="text-center">
                              <Button color="primary" onClick={(event)=>this.handleSubjectDelete(event,subject)}><i className="fa fa-times"></i> Delete</Button>
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </Table>
                <br />
                <Button color="primary" onClick={this.handleSubmit}><i className="fa fa-save"></i> Save</Button>
              </CardBody>
            </Card>
          </Col>

      </div>
    );
  }
}

export {Subjects};
