import React, {Component} from 'react';

import {
Label, Input, Card, CardHeader, CardBody, Table, Button
} from 'reactstrap';

import {notify} from 'react-notify-toast';

import * as firebase from 'firebase';
import 'firebase/firestore';

class Schedule extends Component {
  constructor(props){
    super(props);

    this.state = {
      schedule: props.user.schedule,
      contractSchedule: {}
    };
    this.time = ['6:00 am', '6:30 am', '7:00 am','7:30 am', '8:00 am'
                ,'8:30 am', '9:00 am','9:30 am', '10:00 am','10:30 am'
                , '11:00 am','11:30 am', '12:00 pm', '12:30 am'
                , '1:00 pm','1:30 pm', '2:00 pm','2:30 pm', '3:00 pm'
                ,'3:30 pm', '4:00 pm','4:30 pm', '5:00 pm','5:30 pm', '6:00 pm'
                , '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm','8:30 pm'
                , '9:00 pm','9:30 pm', '10:00 pm'];
    firebase.firestore().collection('users').doc(props.user.id).get()
    .then((doc)=>{
      this.setState({schedule: doc.data().schedule});
    })
    .catch((error)=>{
      console.log(error);
    });

    firebase.firestore().collection('contracts').where('tutor','==',props.user.id).get()
    .then((querySnapshot)=>{
      let sched = {};
      querySnapshot.forEach((doc)=>{
        sched = doc.data().schedule;
      });
      console.dir(querySnapshot);
      this.setState({contractSchedule: sched});
    })
    .catch((error)=>{
      console.log(error);
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
  }
  handleSwitchChange(event, timeIndex, day){
    var time = this.time[timeIndex];
    var sched = {...this.state.schedule};
    if(event.target.checked){
      if(sched.hasOwnProperty(day)){
        sched[day][time] = {exist: true, available: true};
      }
      else{
        sched[day] = {};
        sched[day][time] = {exist: true, available: true};
      }
    }
    else {
      if(sched.hasOwnProperty(day)){
        if(sched[day].hasOwnProperty(time)){
          delete sched[day][time];
        }
      }
    }
    firebase.firestore().collection('users').doc(this.props.user.id).get()
    .then((doc)=>{
      var pass = true;
      if(doc.data().schedule.hasOwnProperty(day)){

        if(doc.data().schedule[day].hasOwnProperty(time)){

          if(doc.data().schedule[day][time].available === false) pass = false;
        }

      }
      if(pass){
        // firebase.firestore().collection('users').doc(this.props.user.id).update({
        //   schedule: sched
        // })
        // .then((doc)=>{
        //   this.setState({schedule: sched});
        // });
        this.setState({schedule: sched});
      }
      else{
        notify.show('Conflicting Schedule, Please refresh your browser', 'custom', 3000, { background: '	#d9534f', text: '#FFFFFF' });
      }
    })
    .catch((error)=>{
      console.log(error);
    });

  }
  handleSubmit(event){
    console.log(this.props.user.id);
    firebase.firestore().collection('users').doc(this.props.user.id).update({
      schedule: this.state.schedule
    })
    .then((data)=>{
      let myColor = { background: '#5cb85c', text: '#FFFFFF' };
      notify.show('Schedule Saved!', 'custom', 3000, myColor);
      console.log('save success');
    })
    .catch((error)=>{
      console.error(error);
    });
  }
  render() {
    var tableData = (timeIndex,day)=>{
      var availableClass = 'switch switch-icon switch-pill switch-primary';
      var unavailableClass = 'switch switch-icon switch-pill switch-primary-outline';
      var switchClass = unavailableClass;
      var switchProps = {};

      if(this.state.schedule.hasOwnProperty(day)){
        if(this.state.schedule[day].hasOwnProperty(this.time[timeIndex])){

          switchProps.checked = true;
          if(this.state.schedule[day][this.time[timeIndex]].available){
            switchClass = availableClass;
          }
          else{
            switchProps.disabled = true;
          }
        }
      }

      return (
        <td className="text-center">
          <Label className={switchClass}>
            <Input type="checkbox" className="switch-input" value={true}
              onChange={(event)=>this.handleSwitchChange(event,timeIndex,day)}
              {...switchProps}/>
            <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
            <span className="switch-handle"></span>
          </Label>
        </td>
      );
    };


    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Schedule Table
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
              <tr>
                <th className="text-center">{'Time\\Day'}</th>
                <th className="text-center">Sun</th>
                <th className="text-center">Mon</th>
                <th className="text-center">Tue</th>
                <th className="text-center">Wed</th>
                <th className="text-center">Thu</th>
                <th className="text-center">Fri</th>
                <th className="text-center">Sat</th>
              </tr>
              </thead>
              <tbody>
                {
                  this.time.slice(0,this.time.length-1).map((item, index)=>{

                    return (
                      <tr key={index}>
                        <td className="text-center">{item + '-' + this.time[index+1]}</td>
                        {tableData(index,'Sunday')}
                        {tableData(index,'Monday')}
                        {tableData(index,'Tuesday')}
                        {tableData(index,'Wednesday')}
                        {tableData(index,'Thursday')}
                        {tableData(index,'Friday')}
                        {tableData(index,'Saturday')}
                      </tr>
                    );
                  })
                }
              </tbody>
            </Table>
            <Button color="primary" onClick={this.handleSubmit}><i className="fa fa-save"></i>{'\u00A0'} Save</Button>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export {Schedule};
