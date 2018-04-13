import React, { Component } from 'react';

import {Table, Card, CardHeader, CardBody} from 'reactstrap';
import {notify} from 'react-notify-toast';
import {ContractItem} from './ContractItem.js';
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
    
    console.log(this.props.user.id);
    this.contractListener = firebase.firestore().collection('contracts')
    .where('student','==',this.props.user.id)
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
    this.deleteContract = this.deleteContract.bind(this);
    this.saveRating = this.saveRating.bind(this);
  }
  componentDidMount() {

  }
  componentWillUnmount() {
    this.contractListener = firebase.firestore().collection('cities').where('student','==',this.props.user.id)
    .onSnapshot(function () {});
    this.contractListener();
  }
  deleteContract(index, id){
    firebase.firestore().collection('contracts').doc(id)
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
  }
  saveRating(value, feedback, index, contract, toggleModal){
    firebase.firestore().collection('contracts').doc(contract.id)
    .update({rating: value, feedback: feedback})
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
          if(doc.data().rating>0){
            length++;
            totalRating += doc.data().rating;
          }
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
      toggleModal();
      this.setState({
        contracts: arr
      });
    })
    .catch((error)=>{
      notify.show('Rating Save Error! : '+error, 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });
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
            <Table responsive className="table-outline mb-0">
              <thead className="thead-light">
              <tr>
                <th className="text-center"><i className="fa fa-user"></i></th>
            </tr>
              </thead>
              <tbody>
                {
                  this.state.contracts.map((contract,index)=>{
                    var day = Object.getOwnPropertyNames(contract.schedule)[0];
                    var time = Object.getOwnPropertyNames(contract.schedule[day]);
                    return (
                      <ContractItem 
                        key={contract.id} 
                        handleRequest={this.handleRequest} 
                        tutor={contract.tutor}
                        day={day}
                        distance={contract.distance}
                        startEnd={getStartEnd(time)}
                        subject={contract.subject}
                        ratePerHour={contract.rate_per_hour}
                        contract={contract}
                        index={index}
                        saveRating={this.saveRating}
                        deleteContract={this.deleteContract}
                        />
                        
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
