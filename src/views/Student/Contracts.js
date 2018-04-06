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
                , '11:00 am','11:30 am', '12:00 pm', '12:30 pm'
                , '1:00 pm','1:30 pm', '2:00 pm','2:30 pm', '3:00 pm'
                ,'3:30 pm', '4:00 pm','4:30 pm', '5:00 pm','5:30 pm', '6:00 pm'
                , '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm','8:30 pm'
                , '9:00 pm','9:30 pm', '10:00 pm'];
    var contracts = [];
    console.log(this.props.user.id);
    firebase.firestore().collection('contracts')
    .where('student','==',this.props.user.id)
    .get()
    .then((querySnapshot)=>{
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
    })
    .catch((error)=>{
      console.error(error);
    });

  }

  render() {
    var getStartEnd = (timeArray)=>{
      console.dir(timeArray);
      var startIndex = this.time.length;
      console.log('startIndex',startIndex);
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
          console.log(index,item,startIndex,endIndex,result);
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
                <th className="text-center"><i className="fa fa-user"></i></th>
                <th className="text-center"><i className="fa fa-book"></i></th>
                <th className="text-center"><i className="fa fa-calendar" ></i></th>
                <th className="text-center">Status</th>
                <th className="text-center"></th>
            </tr>
              </thead>
              <tbody>
                {
                  this.state.contracts.map((contract,index)=>{
                    var user = 'tutor';
                    return (
                      <tr key={contract.id}>
                        <td>
                          <div className="text-center">{contract[user].firstname+' '+contract[user].lastname}</div>
                          <div className="small text-muted">
                            <i className="fa fa-phone"></i> {contract[user].contact}
                          </div>
                          <div className="small text-muted">
                            <i className="fa fa-envelope"></i> {contract[user].email}
                          </div>
                        </td>
                        <td className="text-center">
                          <div>
                            {
                              contract.subject
                            }
                          </div>
                          <div className="small text-muted">P{contract.rate_per_hour} per hour</div>
                        </td>
                        {
                          (()=>{
                            var day = Object.getOwnPropertyNames(contract.schedule)[0];
                            var time = Object.getOwnPropertyNames(contract.schedule[day]);
                            return (
                              <td className="text-center">
                                <div>{day}</div>
                                <div className="small text-muted">{getStartEnd(time)}</div>
                              </td>
                            );
                          })()
                        }
                        <td className="text-center">
                          <div>
                            {
                              (contract.approved)?'Approved':'Pending'
                            }
                          </div>
                          <div>
                            {
                              (contract.finished)?'Finished':<div></div>
                            }
                          </div>
                          <div className="small text-muted"></div>
                        </td>

                            {
                              (contract.approved)
                              ?<td className="text-center">
                                <div><strong>{contract.rating}</strong></div>
                                <div className="small text-muted">
                                  {
                                    <Rating
                                      emptySymbol="fa fa-star-o medium"
                                      fullSymbol="fa fa-star medium"
                                      initialRating={contract.rating}
                                      onChange={(value)=>{
                                        firebase.firestore().collection('contracts').doc(contract.id)
                                        .update({rating: value})
                                        .then(()=>{
                                          notify.show('Rating Saved!', 'custom', 3000, { background: '#5cb85c', text: '#FFFFFF' });
                                          var arr = this.state.contracts.slice();
                                          arr[index].rating = value;

                                          firebase.firestore().collection('contracts')
                                          .where('tutor','==', contract.tutor.id)
                                          .where('approved','==', true)
                                          .get()
                                          .then((qSnapshot)=>{
                                            console.log('tutor id',contract.tutor.id);

                                            var totalRating = 0;
                                            var length =0;
                                            qSnapshot.forEach((doc)=>{
                                              length++;
                                              totalRating += doc.data().rating;
                                            });
                                            if(length){
                                              var avgRating = Math.round( (totalRating/length) * 10 ) / 10;
                                              firebase.firestore().collection('users').doc(contract.tutor.id)
                                              .update({
                                                rating: avgRating
                                              })
                                              .catch((error)=>{
                                                console.error('tutor no ratings',error);
                                              });
                                            }
                                          })
                                          .catch((error)=>{
                                            console.error('error on fetching tutor ratings',error);
                                          });
                                          this.setState({
                                            contracts: arr
                                          });
                                        })
                                        .catch((error)=>{
                                          notify.show('Rating Save Error! : '+error, 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });
                                        });
                                      }}
                                    />
                                  }
                                </div>
                                <div className="small text-muted">
                                  Rate your tutor
                                </div>
                              </td>

                              :<td className="text-center"><Button color="primary"
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
                                ><i className="fa fa-times"></i> Delete</Button></td>
                            }

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
