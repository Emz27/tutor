import React, {Component} from 'react';
import {Button, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

import Rating from 'react-rating';

import {RatingModal} from './RatingModal.js';

class ContractItem extends Component {

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
        <table>
          <thead><tr><th>Day</th><th>Time</th></tr></thead>
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
            <div className="d-flex flex-column flex-md-row">
              <div className="col-md">
                <hr className="d-md-none" />
                <div className="text-center"><h6>{this.props.subject}</h6> P{this.props.ratePerHour}/hour</div>
                <div className="small text-muted text-center">{this.props.day} {this.props.startEnd}</div>
                <div className="small text-muted text-center">{this.props.distance} kilometer away</div>
                <hr className="d-md-none" />
              </div>
              <div className="col-md">
                {
                  (this.props.contract.finished)
                  ?(this.props.contract.rating <= 0)
                    ?<RatingModal index={this.props.index} contract={this.props.contract} saveRating={this.props.saveRating}/>
                    :<div>
                    <div className="text-center"><strong>{this.props.contract.rating}</strong></div>
                    <div className="small text-muted text-center">
                      <Rating
                        emptySymbol="fa fa-star-o medium"
                        fullSymbol="fa fa-star medium"
                        initialRating={this.props.contract.rating}
                        readonly
                      />
                    </div>
                    <div className="small text-muted text-center">Your rating to tutor</div>
                    </div>
                  :<div></div>
                }
                
              </div>
              <div className="col-md">
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
              </div>

              
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <div>
                <h5>
                  {
                    (()=>{
                      if(this.props.contract.approved && this.props.contract.finished){
                        return 'Finished';
                      }
                      else if(this.props.contract.approved && !this.props.contract.finished){
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
                    if(!this.props.contract.approved){
                      return(
                        <Button color="primary"
                          onClick={(event)=>this.props.deleteContract(this.props.index, this.props.contract.id)}>
                          <i className="fa fa-times"></i> Delete
                        </Button>
                      );
                    }
                  })()
                }
              </div>
            </div>
        </td>
      </tr>
        
    );
  }
}

export {ContractItem};
