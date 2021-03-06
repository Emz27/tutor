import React, { Component } from 'react';

import {Table, Card, CardHeader, CardBody, Button} from 'reactstrap';

import Rating from 'react-rating';
import {notify} from 'react-notify-toast';
import * as firebase from 'firebase';
import 'firebase/firestore';

class Contracts extends Component {
  constructor(props){
    super(props);
    this.state ={
      contracts: []
    };

    this.time = ['6:00 am', '6:30 am', '7:00 am','7:30 am', '8:00 am'
                ,'8:30 am', '9:00 am','9:30 am', '10:00 am','10:30 am'
                , '11:00 am','11:30 am', '12:00 pm', '12:30 am'
                , '1:00 pm','1:30 pm', '2:00 pm','2:30 pm', '3:00 pm'
                ,'3:30 pm', '4:00 pm','4:30 pm', '5:00 pm','5:30 pm', '6:00 pm'
                , '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm','8:30 pm'
                , '9:00 pm','9:30 pm', '10:00 pm'];
    
    console.log(this.props.user.id);
    this.contractListener = firebase.firestore().collection('contracts')
    .where('tutor','==',this.props.user.id)
    .onSnapshot((querySnapshot)=>{
      var contracts = [];
      var tutor = {};
      var student = {};
      querySnapshot.forEach((contractDoc)=>{
        console.dir(contractDoc.data());
        firebase.firestore().collection('users').doc(contractDoc.data().tutor)
        .get()
        .then((userDoc)=>{
          tutor = {
            ...userDoc.data(),
            id: userDoc.id
          };
          firebase.firestore().collection('users').doc(contractDoc.data().student)
          .get()
          .then((userDoc)=>{
            student = userDoc.data();
            contracts.push({
              ...contractDoc.data(),
              tutor: tutor,
              student: student,
              id: contractDoc.id
            });
            console.dir(contracts);
            this.setState({
              contracts: contracts
            });
          });
        });
      });
    },(error)=>console.error(error));
  }
  componentDidMount() {

  }
  componentWillUnmount() {
    this.contractListener = firebase.firestore().collection('cities').where('student','==',this.props.user.id)
    .onSnapshot(function () {});
    this.contractListener();
  }
  render() {
    var getStartEnd = (timeArray)=>{

      var startIndex = this.time.length;

      var endIndex = 0;
      timeArray.forEach((item,index)=>{
        var result = this.time.indexOf(item);
        if(result >= 0){
          if(result > endIndex){
            endIndex = result;
          }
          if(result < startIndex){
            startIndex = result;
          }

        }
      });
      return this.time[startIndex]+' - '+this.time[endIndex+1];
    };
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            Contracts
          </CardHeader>
          <CardBody>
            <Table hover responsive className="table-outline mb-0">
              <thead className="thead-light">
              <tr>
                <th></th>
            </tr>
              </thead>
              <tbody>
                {
                  this.state.contracts.map((contract,index)=>{
                    var user = 'student';
                    return (
                      <tr key={contract.id}>
                        <td>
                          <div><h5>{contract[user].firstname+' '+contract[user].lastname}</h5></div>
                          <div className="d-flex flex-column flex-md-row">
                            <div className="col-md">
                              <hr className="d-md-none" />
                              <div className="small text-muted">
                                <i className="fa fa-phone"></i> {contract[user].contact}
                              </div>
                              <div className="small text-muted">
                                <i className="fa fa-envelope"></i> {contract[user].email}
                              </div>
                              <hr className="d-md-none" />
                            </div>
                            <div className="text-center col-md">
                              <div>{contract.subject}</div>
                              <div className="small text-muted">P{contract.rate_per_hour} per hour</div>
                              <hr className="d-md-none" />
                            </div>
                            <div className="text-center col-md">
                            {
                              (()=>{
                                var day = Object.getOwnPropertyNames(contract.schedule)[0];
                                var time = Object.getOwnPropertyNames(contract.schedule[day]);
                                return (
                                  <div>
                                    <div>{day}</div>
                                    <div className="small text-muted">{getStartEnd(time)}</div>
                                  </div>
                                );
                              })()
                            }
                            <hr className="d-md-none" />
                            </div>
                            <div className="text-center col-md">
                              {
                                (contract.rating >0 && contract.finished)
                                ?<div>
                                  <div><strong>{contract.rating}</strong></div>
                                  <div className="small text-muted">
                                    {
                                      <Rating
                                        emptySymbol="fa fa-star-o medium"
                                        fullSymbol="fa fa-star medium"
                                        initialRating={contract.rating}
                                        readonly
                                      />
                                    }
                                  </div>
                                  <div className="small text-muted">
                                    {'Student\'s rating\nfor your performance'}
                                  </div>
                                </div>
                                :<div></div>
                              }
                            </div>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <div>
                              <h5>
                                {
                                  (()=>{
                                    if(contract.approved && contract.finished){
                                      return 'Finished';
                                    }
                                    else if(contract.approved && !contract.finished){
                                      return 'On Going';
                                    }
                                    else return 'Pending';
                                  })()
                                }
                              </h5>
                            </div>
                            <div>
                              {
                                (()=>{
                                  if(contract.approved && contract.finished){
                                    return (<div></div>);
                                  }
                                  else if(contract.approved && !contract.finished){
                                    return (
                                      <Button color="primary"
                                      onClick={(event)=>{
                                        var arr = this.state.contracts.slice();
                                        arr[index].finished = true;
                                        firebase.firestore().collection('contracts').doc(contract.id)
                                        .update({finished: true})
                                        .then(()=>{
                                          var tutorSched = {...contract.tutor.schedule};
                                          var contractShed = {...contract.schedule};
    
                                          Object.getOwnPropertyNames(contractShed).forEach((day,index)=>{
                                            Object.getOwnPropertyNames(contractShed[day]).forEach((time,index)=>{
                                              tutorSched[day][time].available = true;
                                            });
                                          });
    
                                          firebase.firestore().collection('users').doc(contract.tutor.id)
                                          .update({
                                            schedule: tutorSched
                                          });
    
                                          notify.show('Contract Finish!', 'custom', 3000, { background: '#5cb85c', text: '#FFFFFF' });
                                          this.setState({
                                            contracts : arr
                                          });
                                        })
                                        .catch((error)=>{
                                          notify.show('Contract Finish Error! : '+error, 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });
                                        });
                                      }}
                                      >Done
                                      </Button>
                                    );
                                  }
                                  else return (
                                    <div>
                                      <Button color="primary"
                                      onClick={(event)=>{
                                        var tutorSched = {...contract.tutor.schedule};
                                        var contractShed = {...contract.schedule};
                                        var pass = true;
                                        Object.getOwnPropertyNames(contractShed).forEach((day,index)=>{
                                          console.dir(Object.getOwnPropertyNames(contractShed[day]));
                                          Object.getOwnPropertyNames(contractShed[day]).forEach((time,index)=>{
                                            if(!tutorSched[day][time].available) pass = false;
                                          });
                                        });
                                        if(pass){
                                          var arr = this.state.contracts.slice();
                                          arr[index].approved = true;
                                          firebase.firestore().collection('contracts').doc(contract.id)
                                          .update({approved: true})
                                          .then(()=>{

                                            console.dir(tutorSched);
                                            console.dir(contractShed);
                                            console.dir(Object.getOwnPropertyNames(contractShed));
                                            Object.getOwnPropertyNames(contractShed).forEach((day,index)=>{
                                              console.dir(Object.getOwnPropertyNames(contractShed[day]));
                                              Object.getOwnPropertyNames(contractShed[day]).forEach((time,index)=>{
                                                tutorSched[day][time].available = false;
                                              });
                                            });
                                            console.dir(tutorSched);
                                            firebase.firestore().collection('users').doc(contract.tutor.id)
                                            .update({
                                              schedule: tutorSched
                                            });

                                            notify.show('Contract Accepted!', 'custom', 3000, { background: '#5cb85c', text: '#FFFFFF' });
                                            this.setState({
                                              contracts : arr
                                            });
                                          })
                                          .catch((error)=>{
                                            notify.show('Contract Accept Error! : '+error, 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });
                                          });
                                        }
                                        else notify.show('Conflicting Schedule!', 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });

                                      }}
                                      ><i className="fa fa-check"></i> Accept</Button>
                                      <Button color="primary"
                                      onClick={(event)=>{
                                        firebase.firestore().collection('contracts').doc(contract.id)
                                        .delete()
                                        .then(()=>{
                                          var arr = this.state.contracts.slice();
                                          arr.splice(index,1);
                                          notify.show('Contract Deleted!', 'custom', 3000, { background: '#5cb85c', text: '#FFFFFF' });
                                          this.setState({
                                            contracts : arr
                                          });
                                        })
                                        .catch((error)=>{
                                          notify.show('Contract Delete Error! : '+error, 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });
                                        });
                                      }}
                                      ><i className="fa fa-times"></i> Delete
                                      </Button>
                                    </div>
                                  );
                                })()
                              }
                            </div>
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

      </div>
    );
  }
}

export {Contracts};
