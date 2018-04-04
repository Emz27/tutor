import React, { Component } from 'react';

import { Button, FormText, FormFeedback,   FormGroup, Input, Row, Col, Card, CardBody, CardHeader, Table} from 'reactstrap';

import Rating from 'react-rating';

import * as firebase from 'firebase';
import 'firebase/firestore';

class FindTutor extends Component {
  constructor(props){
    super(props);
    this.state = {
      subject: '',
      subjectCategory: '',
      day: '',
      startTime: '-1',
      endTime: '-1',

      subjectCategories: [],

      subjectError: '',
      subjectCategoryError: '',
      dayError: '',
      startTimeError: '',
      endTimeError: '',

      tutors:[]
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
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTutor = this.fetchTutor.bind(this);
  }
  handleSubjectCategoryChange(event){
    this.setState({
      subjectCategory: event.target.value,
      subjectCategoryError: '',
      tutors: []
    });
  }
  handleSubjectChange(event){
    this.setState({
      subject: event.target.value,
      subjectError: '',
      tutors: []
    });
  }
  handleDayChange(event){
    this.setState({
      day: event.target.value,
      dayError: '',
      tutors: []
    });
  }
  handleStartTimeChange(event){
    this.setState({
      startTime: event.target.value,
      startTimeError: '',
      tutors: []
    });
  }
  handleEndTimeChange(event){
    this.setState({
      endTime: event.target.value,
      endTimeError: '',
      tutors: []
    });
  }

  handleSubmit(event){
    console.log('handlesubmit!');
    var s = this.state;
    var error ={};
    if(!s.subject) error.subjectError = 'Fill the subject field';
    if(!s.subjectCategory) error.subjectCategoryError = 'Fill the subject category field';
    if(s.startTime==='-1') error.startTimeError = 'Fill the start time field';
    if(s.endTime==='-1') error.endTimeError = 'Fill the end time field';
    if(!s.day) error.dayError = 'Fill the day field';

    if(Object.getOwnPropertyNames(error).length !== 0){
      this.setState({...error});

    }
    else if(Object.getOwnPropertyNames(error).length === 0){
      this.fetchTutor();
    }
    event.preventDefault();
  }
  fetchTutor(){
    var rad = function(x) {
      return x * Math.PI / 180;
    };

    var getDistance = function(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2.latitude - p1.latitude);
      var dLong = rad(p2.longitude - p1.longitude);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      d /= 1000; // meter to kilometer
      var factor = Math.pow(10, 1);
      return Math.round(d * factor) / factor;
      // returns the distance in kilometer
    };

    var subCat = this.state.subjectCategories;
    var subIndex = this.state.subject;
    var catIndex = this.state.subjectCategory;
    var subject = subCat[catIndex].subjects[subIndex];
    var query = firebase.firestore().collection('users');
    var tutorList = [];

    query = query.where('subjects.'+subject+'.exist','==',true);
    query = query.where('type','==','Tutor');

    for(let i = this.state.startTime; i < this.state.endTime; i++ ){
      query = query.where('schedule.'+this.state.day+'.'+this.time[i]+'.available','==',true);
    }

    query = query.get();
    query.then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        tutorList.push({
          ...doc.data(),
          distance: getDistance(this.props.user.coordinates, doc.data().coordinates),
          id: doc.id
        });
        console.dir(doc);
      });
      console.dir(tutorList);
      this.setState({
        tutors: tutorList
      });
    })
    .catch((error)=>{
      console.log(error);
    });
  }
  render() {
    var input = this.state;
    var subjectErrorProp = {};
    var subjectCategoryErrorProp = {};
    var startTimeErrorProp = {};
    var endTimeErrorProp = {};
    var dayErrorProp = {};

    if(input.subjectError) subjectErrorProp.invalid = true;
    if(input.subjectCategoryError) subjectCategoryErrorProp.invalid = true;
    if(input.startTimeError) startTimeErrorProp.invalid = true;
    if(input.endTimeError) endTimeErrorProp.invalid = true;
    if(input.dayError) dayErrorProp.invalid = true;

    return (
      <div className="animated fadeIn">
        <Col>
          <Card>
            <CardHeader>
              Find Tutor
            </CardHeader>
            <CardBody>
              <Row>
                <Col>

                    <FormGroup row>
                      <Col md="5">
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
                      <Col md="7">
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
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">
                        <Input {...dayErrorProp} type="select" value={this.state.day}
                          onChange={this.handleDayChange}>
                          <option></option>
                          {this.days.map((item)=>(<option key={item}>{item}</option>))}
                        </Input>
                        <FormFeedback {...dayErrorProp} >{this.state.dayError}</FormFeedback>
                        <FormText className="text-center">Day</FormText>
                      </Col>
                      <Col md="4">
                        <Input {...startTimeErrorProp} type="select" value={this.state.startTime}
                          onChange={this.handleStartTimeChange}>
                          <option value={'-1'}></option>
                          {
                            this.time.map((item,index)=>{
                              let timeDisable = {};
                              let timeLabel = '';
                              if(index >= +this.state.endTime  && this.state.endTime !== '-1') timeDisable.disabled = true;
                              if(index === +this.state.endTime  && this.state.endTime !== '-1') timeLabel = ' - end time';
                              return (
                                <option {...timeDisable} key={item} value={index}>{ this.time[index] + timeLabel }</option>
                              );
                            })
                          }
                        </Input>
                        <FormFeedback {...startTimeErrorProp} >{this.state.startTimeError}</FormFeedback>
                        <FormText className="text-center">Start Time</FormText>
                      </Col>
                      <Col md="4">
                        <Input {...endTimeErrorProp} type="select" value={this.state.endTime}
                          onChange={this.handleEndTimeChange}>
                          <option value={'-1'}></option>
                          {
                            this.time.map((item,index)=>{
                              let timeDisable = {};
                              let timeLabel = '';
                              if(index <= +this.state.startTime && this.state.startTime !== '-1') timeDisable.disabled = true;
                              if(index === +this.state.startTime && this.state.startTime !== '-1') timeLabel=' - start time';
                              return (
                                <option {...timeDisable} key={item} value={index}>{this.time[index] + timeLabel}</option>
                              );
                            })
                          }
                        </Input>
                        <FormFeedback {...endTimeErrorProp} >{this.state.endTimeError}</FormFeedback>
                        <FormText className="text-center">End Time</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="12">

                            <Button color="primary" onClick={this.handleSubmit}><i className="fa fa-search"></i> Search</Button>

                      </Col>
                    </FormGroup>


                </Col>
              </Row>
              <Table hover responsive className="table-outline mb-0">
                <thead className="thead-light">
                <tr>
                  <th className="text-center"><i className="fa fa-user"></i></th>
                  <th className="text-center"><i className="fa fa-tag"></i></th>
                  <th className="text-center"><i className="fa fa-map-marker"></i></th>
                  <th className="text-center"><i className="fa fa-star"></i></th>
                </tr>
                </thead>
                <tbody>
                  {
                    this.state.tutors.map((item,index)=>{
                      return (
                        <tr key={item.id}>
                          <td key={item.firstname+' '+item.lastname}>
                            <div className="text-center">{item.firstname+' '+item.lastname}</div>
                            <div className="small text-muted">
                              <i className="fa fa-phone"></i> {item.contact}
                            </div>
                            <div className="small text-muted">
                              <i className="fa fa-envelope"></i> {item.email}
                            </div>
                          </td>
                          <td className="text-center" key={'Price'}>
                            <div><strong>P {
                                item.subjects[this.state.subjectCategories[this.state.subjectCategory].subjects[this.state.subject]].rate_per_hour
                              }</strong></div>
                            <div className="small text-muted">Rate per Hour</div>
                          </td>
                          <td className="text-center" key={'distance'}>
                            <div><strong>{item.distance}</strong></div>
                            <div className="small text-muted">kilometer away</div>
                          </td>
                          <td className="text-center" key={'ratings'}>
                            <div><strong>{item.rating}</strong></div>
                            <div className="small text-muted">
                              <Rating
                                emptySymbol="fa fa-star-o medium"
                                fullSymbol="fa fa-star medium"
                                initialRating={item.rating}
                                readonly
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </div>
    );
  }
}


export {FindTutor};
