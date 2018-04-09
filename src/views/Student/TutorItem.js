import React, {Component} from 'react';
import {Button, Table, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

import Rating from 'react-rating';

class TutorItem extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
    this.time = ['6:00 am', '6:30 am', '7:00 am','7:30 am', '8:00 am'
                ,'8:30 am', '9:00 am','9:30 am', '10:00 am','10:30 am'
                , '11:00 am','11:30 am', '12:00 pm', '12:30 pm'
                , '1:00 pm','1:30 pm', '2:00 pm','2:30 pm', '3:00 pm'
                ,'3:30 pm', '4:00 pm','4:30 pm', '5:00 pm','5:30 pm', '6:00 pm'
                , '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm','8:30 pm'
                , '9:00 pm','9:30 pm', '10:00 pm'];
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    var getStartEnd = (timeArray)=>{
      var time = [];
      var startTime = [];
      var endTime = [];
      var prev = false;
      var startEnd = [];
      
      Object.getOwnPropertyNames(timeArray).forEach(element => {
        if(timeArray[element].available && this.time.indexOf(element)>=0){
          time[this.time.indexOf(element)] = element;
        }
      });
      for(let i=0; i < this.time.length; i++){
        if(!prev && time[i]){
          startTime.push(time[i]);
          prev = true;
        }
        else if(prev && !time[i]){
          endTime.push(this.time[i]);
          prev = false;
        }
      }
      console.dir(time);
      console.dir(startTime);
      console.dir(endTime);
      startTime.forEach((item,index) => {
        startEnd.push(item + ' - ' + endTime[index]);
      });
      console.dir(startEnd);
      return startEnd.map((item,index)=>(
        <div className="small text-muted" key={item}>{item}</div>
      ));
    };
    var SchedTable = ()=>{
      return (
        <table responsive bordered>
          <thead><tr><th>Time</th><th>Day</th></tr></thead>
          <tbody>
            {
              Object.getOwnPropertyNames(this.props.tutor.schedule).map((item,index)=>{

                return (
                  <tr key={item}>
                    <td><div className="small text-muted"><strong>{item}</strong></div></td>
                    <td>{getStartEnd(this.props.tutor.schedule[item])}</td>
                  </tr>
                );
              })
              
            }
          </tbody>
        </table>
      );
    };
    
    return (
              <tr key={this.props.tutor.id}>
                <td>
                    <div><h5>{this.props.tutor.firstname+' '+this.props.tutor.lastname}</h5></div>
                    <hr/>
                    <br/>
                    <div>
                            <Nav tabs>
                            <NavItem>
                                <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                                >
                                <i className="icon-notebook"></i>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                                >
                                <i className="icon-book-open"></i>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                                >
                                <i className="icon-calendar"></i>
                                </NavLink>
                            </NavItem>
                            </Nav>
                            <TabContent className="animated fadeIn" activeTab={this.state.activeTab}>
                            <TabPane tabId="1" >
                                <div className="small text-muted">
                                    <i className="fa fa-phone"></i> {this.props.tutor.contact}
                                </div>
                                <div className="small text-muted">
                                    <i className="fa fa-envelope"></i> {this.props.tutor.email}
                                </div>
                                <div className="small text-muted">
                                    <i className="fa fa-map-pin"></i> {this.props.tutor.address}
                                </div>
                            </TabPane>
                            <TabPane tabId="2">
                                {
                                    Object.getOwnPropertyNames(this.props.tutor.subjects).map((item,index)=>{
                                      return (
                                        <div key={item} className="small text-muted">{item} - P{this.props.tutor.subjects[item].rate_per_hour}/hour</div>
                                      );
                                    })
                                }
                            </TabPane>
                            <TabPane tabId="3">
                                <SchedTable />
                            </TabPane>
                            </TabContent>
                    </div>
                    <td>
                      <Button color="primary" onClick={(event)=>this.props.handleRequest(this.props.tutor)}><i className="fa fa-share"></i> Send Request</Button>
                    </td>
                </td>
                <td className="text-center" key={'rate_per_hour'}>
                  <div><strong>P {
                      this.props.tutor.subjects[this.props.subject].rate_per_hour
                    }</strong></div>
                  <div className="small text-muted">Rate per Hour</div>
                </td>
                <td className="text-center" key={'distance'}>
                  <div><strong>{this.props.tutor.distance}</strong></div>
                  <div className="small text-muted">kilometer away</div>
                </td>
                <td className="text-center" key={'ratings'}>
                  <div><strong>{this.props.tutor.rating}</strong></div>
                  <div className="small text-muted">
                    <Rating
                      emptySymbol="fa fa-star-o medium"
                      fullSymbol="fa fa-star medium"
                      initialRating={this.props.tutor.rating}
                      readonly
                    />
                  </div>
                </td>
              </tr>
        
    );
  }
}

export {TutorItem};
